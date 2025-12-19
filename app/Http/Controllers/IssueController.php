<?php

namespace App\Http\Controllers;

use App\Events\CommentCreated;
use App\Models\Issue;
use App\Models\Department;
use App\Models\User;
use App\Models\Comment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Events\IssueCreated;
use App\Events\IssueUpdated;

class IssueController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        $issuesQuery = Issue::with(['department', 'creator', 'assignee'])
            ->whereNull('archived_at')
            ->latest();

        // Apply filters
        if ($request->has('department') && $request->department != '') {
            $issuesQuery->where('department_id', $request->department);
        }
        if ($request->has('status') && $request->status != '') {
            $issuesQuery->where('status', $request->status);
        }
        if ($request->has('priority') && $request->priority != '') {
            $issuesQuery->where('priority', $request->priority);
        }
        if ($request->has('search') && $request->search != '') {
            $issuesQuery->where(function ($query) use ($request) {
                $query->where('title', 'like', '%' . $request->search . '%')
                    ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }
        if ($request->has('assignee') && $request->assignee != '') {
            $issuesQuery->where('assigned_to', $request->assignee);
        }
        if ($request->has('date') && $request->date != '') {
            $issuesQuery->whereDate('created_at', $request->date);
        }


        if ($user->can('issues.view_all')) {
            // No additional WHERE clause needed
        } elseif ($user->can('issues.view_department')) {
            $issuesQuery->where(function ($query) use ($user) {
                $query->where('department_id', $user->department_id)
                    ->orWhere('assigned_to', $user->id)
                    ->orWhere('created_by', $user->id);
            });
        } else { // view own issues
            $issuesQuery->where('created_by', $user->id);
        }

        $issues = $issuesQuery->paginate(10)->withQueryString(); // Paginate the results

        $departments = Department::where('is_active', true)->get();
        // Fetch all users to populate the assignee filter dropdown, if needed
        $users = User::all();
        $can_archive_issue = $user->can('issues.archive');
        $can_view_assignee = $user->can('issues.view_assignee');
        $can_delete_issues = $user->can('issues.delete');

        return Inertia::render('Issues/Index', [
            'issues' => $issues,
            'departments' => $departments,
            'users' => $users,
            'filters' => $request->all(['search', 'department', 'status', 'priority', 'assignee', 'date']), // Pass current filters back to the frontend
            'can_archive_issue' => $can_archive_issue,
            'can_view_assignee' => $can_view_assignee,
            'can_delete_issues' => $can_delete_issues,
        ]);
    }

    public function create()
    {
        abort_unless(auth()->user()->can('issues.create'), 403);

        $departments = Department::where('is_active', true)->get();
        $users = User::with('roles')->get();

        return Inertia::render('Issues/Create', [
            'departments' => $departments,
            'users' => $users
        ]);
    }

    // public function store(Request $request)
    // {
    //     abort_unless(auth()->user()->can('issues.create'), 403);

    //     // $validated = $request->validate([
    //     //     'title' => 'required|string|max:255',
    //     //     'description' => 'required|string',
    //     //     'priority' => 'required|in:low,medium,high,critical',
    //     //     'department_id' => 'required|exists:departments,id',
    //     //     'assigned_to' => 'nullable|exists:users,id',
    //     //     'attachment' => 'nullable|file|max:10240',
    //     // ]);

    //     // $validated['created_by'] = auth()->id();
    //     // $validated['status'] = 'open';

    //     // if ($request->hasFile('attachment')) {
    //     //     $file = $request->file('attachment');
    //     //     $filename = time() . '_' . $file->getClientOriginalName();
    //     //     $validated['attachment'] = $file->storeAs('attachments', $filename, 'public');
    //     // }

    //     // $issue = Issue::create($validated);

    //     event(new IssueCreated($issue));
    //     return redirect()->route('issues.index')->with('success', 'Issue created.');
    // }
    public function store(Request $request)
    {
        abort_unless(auth()->user()->can('issues.create'), 403);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:low,medium,high,critical',
            'department_id' => 'required|exists:departments,id',
            'assigned_to' => 'nullable|exists:users,id',
            'attachments' => 'nullable|array',
            'attachments.*' => 'nullable|file|max:10240',
        ]);

        $validated['created_by'] = auth()->id();
        $validated['status'] = 'open';

        $issue = Issue::create($validated);

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $filename = time() . '_' . uniqid() . '_' . $file->getClientOriginalName();
                $filePath = $file->storeAs('attachments', $filename, 'public');

                $issue->attachments()->create([
                    'file_path' => $filePath,
                    'original_name' => $file->getClientOriginalName(),
                    'file_size' => $file->getSize(),
                ]);
            }
        }

        event(new IssueCreated($issue));
        return redirect()->route('issues.index')->with('success', 'Issue created.');
    }
    public function show(Issue $issue)
    {
        $user = auth()->user();

        if (!$user->can('issues.view_all')) {
            if (
                $user->can('issues.view_department') && $issue->department_id !== $user->department_id
                && $issue->assigned_to !== $user->id && $issue->created_by !== $user->id
            ) {
                abort(403);
            }
            if ($user->can('issues.view_own') && $issue->created_by !== $user->id) {
                abort(403);
            }
        }

        $issue->load(['department', 'creator', 'assignee', 'comments.user', 'attachments']);
        $canViewAssignee = $user->can('issues.view_assignee');
        $can_archive_issue = $user->can('issues.archive');

        return Inertia::render('Issues/Show', [
            'issue' => $issue,
            'canComment' => $user->can('issues.edit') || $issue->assigned_to === $user->id || $issue->created_by === $user->id,
            'canViewAssignee' => $canViewAssignee,
            'can_archive_issue' => $can_archive_issue,
        ]);
    }

    public function edit(Issue $issue)
    {
        $user = auth()->user();

        if (!$user->can('issues.edit')) {
            abort(403);
        }

        $departments = Department::where('is_active', true)->get();
        $users = User::with('roles')->get();
        $canChangeStatus = $user->can('issues.change_status') &&
            ($user->can('issues.view_all') || $issue->assigned_to === $user->id);
        $canViewAssignee = $user->can('issues.view_assignee');

        return Inertia::render('Issues/Edit', [
            'issue' => $issue,
            'departments' => $departments,
            'users' =>       $users,
            'canChangeStatus' => $canChangeStatus,
            'canViewAssignee' => $canViewAssignee
        ]);
    }

    // public function update(Request $request, Issue $issue)
    // {
    //     abort_unless(auth()->user()->can('issues.edit'), 403);

    //     $validated = $request->validate([
    //         'title' => 'required|string|max:255',
    //         'description' => 'required|string',
    //         'priority' => 'required|in:low,medium,high,critical',
    //         'status' => 'required|in:open,in_progress,resolved,closed',
    //         'department_id' => 'required|exists:departments,id',
    //         'assigned_to' => 'nullable|exists:users,id',
    //         'attachment' => 'nullable|file|max:10240',
    //         'notify_directors' => 'nullable|boolean',
    //     ]);

    //     $originalData = $issue->getOriginal();

    //     if ($request->hasFile('attachment')) {
    //         if ($issue->attachment) {
    //             Storage::disk('public')->delete($issue->attachment);
    //         }
    //         $file = $request->file('attachment');
    //         $filename = time() . '_' . $file->getClientOriginalName();
    //         $validated['attachment'] = $file->storeAs('attachments', $filename, 'public');
    //     }

    //     if ($validated['status'] === 'resolved' && $issue->status !== 'resolved') {
    //         $validated['resolved_at'] = now();
    //     }

    //     if ($validated['status'] === 'closed' && $issue->status !== 'closed') {
    //         $validated['closed_at'] = now();
    //         $validated['archived_at'] = now();
    //     }

    //     $issue->update($validated);
    //     event(new IssueUpdated($issue, $originalData, auth()->user()));
    //     return redirect()->route('issues.index')->with('success', 'Issue updated.');
    // }
    public function update(Request $request, Issue $issue)
    {
        abort_unless(auth()->user()->can('issues.edit'), 403);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:low,medium,high,critical',
            'status' => 'required|in:open,in_progress,resolved,closed',
            'department_id' => 'required|exists:departments,id',
            'assigned_to' => 'nullable|exists:users,id',
            'attachments' => 'nullable|array',
            'attachments.*' => 'nullable|file|max:10240',
            // 'notify_directors' => 'nullable|boolean',
        ]);

        $originalData = $issue->getOriginal();

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $filename = time() . '_' . uniqid() . '_' . $file->getClientOriginalName();
                $filePath = $file->storeAs('attachments', $filename, 'public');

                $issue->attachments()->create([
                    'file_path' => $filePath,
                    'original_name' => $file->getClientOriginalName(),
                    'file_size' => $file->getSize(),
                ]);
            }
        }

        if ($validated['status'] === 'resolved' && $issue->status !== 'resolved') {
            $validated['resolved_at'] = now();
        }

        if ($validated['status'] === 'closed' && $issue->status !== 'closed') {
            $validated['closed_at'] = now();
            $validated['archived_at'] = now();
        }

        $issue->update($validated);
        event(new IssueUpdated($issue, $originalData, auth()->user()));
        return redirect()->route('issues.index')->with('success', 'Issue updated.');
    }
    // public function destroy(Issue $issue)
    // {
    //     abort_unless(auth()->user()->can('issues.delete'), 403);

    //     if ($issue->attachment) {
    //         Storage::disk('public')->delete($issue->attachment);
    //     }
    //     $issue->delete();
    //     return redirect()->route('issues.index')->with('success', 'Issue deleted.');
    // }
    public function destroy(Issue $issue)
    {
        abort_unless(auth()->user()->can('issues.delete'), 403);

        // Delete all attachments associated with this issue
        foreach ($issue->attachments as $attachment) {
            Storage::disk('public')->delete($attachment->file_path);
            $attachment->delete();
        }

        $issue->delete();
        return redirect()->route('issues.index')->with('success', 'Issue deleted.');
    }
    public function storeComment(Request $request, Issue $issue)
    {
        $validated = $request->validate([
            'comment' => 'required|string|max:1000'
        ]);

        $comment = $issue->comments()->create([
            'user_id' => auth()->id(),
            'comment' => $validated['comment']
        ]);

        event(new CommentCreated($comment));

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
        if ($comment->user_id !== auth()->id() && !auth()->user()->can('issues.delete')) {
            abort(403);
        }

        $comment->delete();
        return back()->with('success', 'Comment deleted.');
    }

    public function archived()
    {
        abort_unless(auth()->user()->can('issues.archive'), 403);

        $issues = Issue::with(['department', 'creator', 'assignee'])->whereNotNull('archived_at')->latest()->get();

        return Inertia::render('Issues/Archived', [
            'issues' => $issues,
        ]);
    }

    public function archive(Issue $issue)
    {
        abort_unless(auth()->user()->can('issues.archive'), 403);
        $issue->update(['archived_at' => now()]);
        return redirect()->route('issues.index')->with('success', 'Issue archived successfully.');
    }
}
