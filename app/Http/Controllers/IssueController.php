<?php

namespace App\Http\Controllers;

use App\Models\Issue;
use App\Models\Department;
use App\Models\User;
use App\Models\Comment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class IssueController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if ($user->can('view all issues')) {
            $issues = Issue::with(['department', 'creator', 'assignee'])->whereNull('archived_at')->latest()->get();
            $departments = Department::where('is_active', true)->get();
        } elseif ($user->can('view department issues')) {
            $issues = Issue::with(['department', 'creator', 'assignee'])
                ->whereNull('archived_at')
                ->where(function ($query) use ($user) {
                    $query->where('department_id', $user->department_id)
                        ->orWhere('assigned_to', $user->id)
                        ->orWhere('created_by', $user->id);
                })
                ->latest()->get();
            $departments = Department::where('is_active', true)->get();
        } else {
            $issues = Issue::with(['department', 'creator', 'assignee'])
                ->whereNull('archived_at')
                ->where('created_by', $user->id)
                ->latest()->get();
            $departments = [];
        }

        return Inertia::render('Issues/Index', [
            'issues' => $issues,
            'departments' => $departments
        ]);
    }

    public function create()
    {
        abort_unless(auth()->user()->can('create issues'), 403);

        $departments = Department::where('is_active', true)->get();
        $users = User::with('roles')->get();

        return Inertia::render('Issues/Create', [
            'departments' => $departments,
            'users' => $users
        ]);
    }

    public function store(Request $request)
    {
        abort_unless(auth()->user()->can('create issues'), 403);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:low,medium,high,critical',
            'department_id' => 'required|exists:departments,id',
            'assigned_to' => 'nullable|exists:users,id',
            'attachment' => 'nullable|file|max:10240',
        ]);

        $validated['created_by'] = auth()->id();
        $validated['status'] = 'open';

        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $filename = time() . '_' . $file->getClientOriginalName();
            $validated['attachment'] = $file->storeAs('attachments', $filename, 'public');
        }

        Issue::create($validated);
        return redirect()->route('issues.index')->with('success', 'Issue created.');
    }

    public function show(Issue $issue)
    {
        $user = auth()->user();

        if (!$user->can('view all issues')) {
            if (
                $user->can('view department issues') && $issue->department_id !== $user->department_id
                && $issue->assigned_to !== $user->id && $issue->created_by !== $user->id
            ) {
                abort(403);
            }
            if ($user->can('view own issues') && $issue->created_by !== $user->id) {
                abort(403);
            }
        }

        $issue->load(['department', 'creator', 'assignee', 'comments.user']);

        return Inertia::render('Issues/Show', [
            'issue' => $issue,
            'canComment' => $user->can('edit issues') || $issue->assigned_to === $user->id || $issue->created_by === $user->id
        ]);
    }

    public function edit(Issue $issue)
    {
        $user = auth()->user();

        if (!$user->can('edit issues')) {
            abort(403);
        }

        $departments = Department::where('is_active', true)->get();
        $users = User::with('roles')->get();
        $canChangeStatus = $user->can('change issue status') &&
            ($user->can('view all issues') || $issue->assigned_to === $user->id);

        return Inertia::render('Issues/Edit', [
            'issue' => $issue,
            'departments' => $departments,
            'users' => $users,
            'canChangeStatus' => $canChangeStatus
        ]);
    }

    public function update(Request $request, Issue $issue)
    {
        abort_unless(auth()->user()->can('edit issues'), 403);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:low,medium,high,critical',
            'status' => 'required|in:open,in_progress,resolved,closed',
            'department_id' => 'required|exists:departments,id',
            'assigned_to' => 'nullable|exists:users,id',
            'attachment' => 'nullable|file|max:10240',
        ]);

        if ($request->hasFile('attachment')) {
            if ($issue->attachment) {
                Storage::disk('public')->delete($issue->attachment);
            }
            $file = $request->file('attachment');
            $filename = time() . '_' . $file->getClientOriginalName();
            $validated['attachment'] = $file->storeAs('attachments', $filename, 'public');
        }

        if ($validated['status'] === 'resolved' && $issue->status !== 'resolved') {
            $validated['resolved_at'] = now();
        }

        if ($validated['status'] === 'closed' && $issue->status !== 'closed') {
            $validated['closed_at'] = now();
        }

        $issue->update($validated);
        return redirect()->route('issues.index')->with('success', 'Issue updated.');
    }

    public function destroy(Issue $issue)
    {
        abort_unless(auth()->user()->can('delete issues'), 403);

        if ($issue->attachment) {
            Storage::disk('public')->delete($issue->attachment);
        }
        $issue->delete();
        return redirect()->route('issues.index')->with('success', 'Issue deleted.');
    }
    public function storeComment(Request $request, Issue $issue)
    {
        $validated = $request->validate([
            'comment' => 'required|string|max:1000'
        ]);

        $issue->comments()->create([
            'user_id' => auth()->id(),
            'comment' => $validated['comment']
        ]);

        return back()->with('success', 'Comment added.');
    }

    public function updateComment(Request $request, Comment $comment)
    {
        if ($comment->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'comment' => 'required|string|max:1000'
        ]);

        $comment->update($validated);
        return back()->with('success', 'Comment updated.');
    }

    public function destroyComment(Comment $comment)
    {
        if ($comment->user_id !== auth()->id() && !auth()->user()->can('delete issues')) {
            abort(403);
        }

        $comment->delete();
        return back()->with('success', 'Comment deleted.');
    }

    public function archived()
    {
        abort_unless(auth()->user()->can('view all issues'), 403);

        $issues = Issue::with(['department', 'creator', 'assignee'])->whereNotNull('archived_at')->latest()->get();

        return Inertia::render('Issues/Archived', [
            'issues' => $issues,
        ]);
    }
}
