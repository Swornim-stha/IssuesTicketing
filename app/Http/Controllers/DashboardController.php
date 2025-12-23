<?php

namespace App\Http\Controllers;

use App\Models\Issue;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $departmentId = $request->input('department_id');

        // Base query
        $query = Issue::query();

        // Apply permissions
        if ($user->can('view all issues')) {
            // Admin sees all
            if ($departmentId) {
                $query->where('department_id', $departmentId);
            }
        } elseif ($user->department_id) {
            // User with a department sees issues from their department, assigned to them, or created by them
            $query->where(function ($q) use ($user) {
                $q->where('department_id', $user->department_id)
                    ->orWhere('assigned_to', $user->id)
                    ->orWhere('created_by', $user->id);
            });
        } else {
            // Regular user sees only their issues
            $query->where('created_by', $user->id);
        }

        // Calculate counts
        $stats = [
            'total_issues' => (clone $query)->count(),
            'open_issues' => (clone $query)->where('status', 'open')->count(),
            'in_progress_issues' => (clone $query)->where('status', 'in_progress')->count(),
            'critical_issues' => (clone $query)->where('priority', 'critical')->count(),
            'high_priority_issues' => (clone $query)->where('priority', 'high')->count(),
            'resolved_today' => (clone $query)
                ->where('status', 'resolved')
                ->whereDate('resolved_at', Carbon::today())
                ->count(),
            'resolved_this_week' => (clone $query)
                ->where('status', 'resolved')
                ->whereBetween('resolved_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
                ->count(),
            'resolved_this_month' => (clone $query)
                ->where('status', 'resolved')
                ->whereMonth('resolved_at', Carbon::now()->month)
                ->count(),
        ];

        // Recent issues
        $recentIssues = (clone $query)
            ->with(['department', 'creator', 'assignee'])
            ->latest()
            ->limit(5)
            ->get();

        // Departments for filter (only for users who can view all)
        $departments = [];
        if ($user->can('view all issues')) {
            $departments = Department::where('is_active', true)->get();
        }

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentIssues' => $recentIssues,
            'departments' => $departments,
            'selectedDepartment' => $departmentId,
        ]);
    }
}
