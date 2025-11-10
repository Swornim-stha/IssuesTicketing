<?php

namespace App\Http\Controllers;

use App\Models\Issue;
use App\Models\Department;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class IssueController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Admins can see all issues, users see only their created/assigned issues
        if ($user->hasRole('admin')) {
            $issues = Issue::with(['department', 'creator', 'assignee'])
                ->latest()
                ->get();
        } else {
            $issues = Issue::with(['department', 'creator', 'assignee'])
                ->where('created_by', $user->id)
                ->orWhere('assigned_to', $user->id)
                ->latest()
                ->get();
        }

        return Inertia::render('Issues/Index', [
            'issues' => $issues
        ]);
    }

    public function create()
    {
        $departments = Department::where('is_active', true)->get();
        $users = User::all();

        return Inertia::render('Issues/Create', [
            'departments' => $departments,
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:low,medium,high,critical',
            'department_id' => 'required|exists:departments,id',
            'assigned_to' => 'nullable|exists:users,id',
            'attachment' => 'nullable|file|max:10240', // 10MB max
        ]);

        $validated['created_by'] = Auth::id();
        $validated['status'] = 'open';

        // Handle file upload
        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('attachments', $filename, 'public');
            $validated['attachment'] = $path;
        }

        Issue::create($validated);

        return redirect()->route('issues.index')
            ->with('success', 'Issue created successfully.');
    }

    public function show(Issue $issue)
    {
        // Check if user has permission to view this issue
        $user = Auth::user();
        if (!$user->hasRole('admin') && $issue->created_by !== $user->id && $issue->assigned_to !== $user->id) {
            abort(403, 'Unauthorized to view this issue.');
        }

        $issue->load(['department', 'creator', 'assignee']);

        return Inertia::render('Issues/Show', [
            'issue' => $issue
        ]);
    }

    public function edit(Issue $issue)
    {
        // Only admin or creator can edit
        $user = Auth::user();
        if (!$user->hasRole('admin') && $issue->created_by !== $user->id) {
            abort(403, 'Unauthorized to edit this issue.');
        }

        $departments = Department::where('is_active', true)->get();
        $users = User::all();

        return Inertia::render('Issues/Edit', [
            'issue' => $issue,
            'departments' => $departments,
            'users' => $users,
        ]);
    }

    public function update(Request $request, Issue $issue)
    {
        // Only admin or creator can update
        $user = Auth::user();
        if (!$user->hasRole('admin') && $issue->created_by !== $user->id) {
            abort(403, 'Unauthorized to update this issue.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:low,medium,high,critical',
            'status' => 'required|in:open,in_progress,resolved,closed',
            'department_id' => 'required|exists:departments,id',
            'assigned_to' => 'nullable|exists:users,id',
            'attachment' => 'nullable|file|max:10240',
        ]);

        // Handle file upload
        if ($request->hasFile('attachment')) {
            // Delete old attachment if exists
            if ($issue->attachment) {
                Storage::disk('public')->delete($issue->attachment);
            }

            $file = $request->file('attachment');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('attachments', $filename, 'public');
            $validated['attachment'] = $path;
        }

        // If status changed to resolved, set resolved_at timestamp
        if ($validated['status'] === 'resolved' && $issue->status !== 'resolved') {
            $validated['resolved_at'] = now();
        }

        $issue->update($validated);

        return redirect()->route('issues.index')
            ->with('success', 'Issue updated successfully.');
    }

    public function destroy(Issue $issue)
    {
        // Only admin can delete
        if (!Auth::user()->hasRole('admin')) {
            abort(403, 'Unauthorized to delete this issue.');
        }

        // Delete attachment if exists
        if ($issue->attachment) {
            Storage::disk('public')->delete($issue->attachment);
        }

        $issue->delete();

        return redirect()->route('issues.index')
            ->with('success', 'Issue deleted successfully.');
    }
}
