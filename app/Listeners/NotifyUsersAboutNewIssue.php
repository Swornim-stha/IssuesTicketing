<?php

namespace App\Listeners;

use App\Events\IssueCreated;
use App\Models\User;
use App\Notifications\NewIssueNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Notification;

class NotifyUsersAboutNewIssue implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(IssueCreated $event): void
    {
        $issue = $event->issue;

        // Find users in the same department
        $departmentUsers = User::where('department_id', $issue->department_id)->get();

        // Find all directors
        $directors = User::role('director')->get();

        // Combine them, ensuring no duplicates
        $recipients = $departmentUsers->merge($directors)->unique('id');

        // Exclude the user who created the issue
        $recipients = $recipients->reject(function ($user) use ($issue) {
            return $user->id === $issue->created_by;
        });

        // Send notification to all recipients
        Notification::send($recipients, new NewIssueNotification($issue));
    }
}
