<?php

namespace App\Listeners;

use App\Events\IssueUpdated;
use App\Models\User;
use App\Notifications\IssueUpdatedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Arr;

class NotifyUsersAboutIssueUpdate implements ShouldQueue
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
    public function handle(IssueUpdated $event): void
    {
        $issue = $event->issue;
        $originalData = $event->originalData;
        $updatingUser = $event->updater; // Corrected: changed from $event->updatingUser to $event->updater

        $recipients = collect();
        $message = '';

        // Add creator, department users, and directors as base recipients
        if ($issue->creator) {
            $recipients->push($issue->creator);
        }
        $departmentUsers = User::where('department_id', $issue->department_id)->get();
        $recipients = $recipients->merge($departmentUsers);
        $directors = User::role('director')->get();
        $recipients = $recipients->merge($directors);

        // Check if status has changed
        if (Arr::get($originalData, 'status') !== $issue->status) {
            $message = "The status of issue \"{$issue->title}\" was changed to '{$issue->status}'.";
            if ($issue->assignee) {
                $recipients->push($issue->assignee);
            }
        }

        // Check if assignee has changed
        if (Arr::get($originalData, 'assigned_to') !== $issue->assigned_to) {
            $oldAssigneeId = Arr::get($originalData, 'assigned_to');
            if ($oldAssigneeId) {
                $recipients->push(User::find($oldAssigneeId));
            }
            if ($issue->assignee) {
                $message = "You have been assigned a new issue: \"{$issue->title}\".";
                // Send a specific notification just to the new assignee
                Notification::send($issue->assignee, new IssueUpdatedNotification($issue, $updatingUser, $message));
                $recipients->push($issue->assignee);
            } else {
                $message = "The issue \"{$issue->title}\" has been unassigned.";
            }
        }

        // If no specific message has been set, use a generic one
        if (empty($message)) {
            $message = "The issue \"{$issue->title}\" has been updated.";
            if ($issue->assignee) {
                $recipients->push($issue->assignee);
            }
        }

        // Exclude the user who triggered the event and remove duplicates
        $finalRecipients = $recipients->filter()->unique('id')->reject(function ($user) use ($updatingUser) {
            return $user->id === $updatingUser->id;
        });

        if ($finalRecipients->isNotEmpty()) {
            Notification::send($finalRecipients, new IssueUpdatedNotification($issue, $updatingUser, $message));
        }
    }
}
