<?php

namespace App\Listeners;

use App\Events\IssueUpdated;
use App\Mail\IssueUpdatedNotification;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Arr;

class SendIssueUpdatedNotification
{
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
        $updater = $event->updater;

        $changes = [];
        $interestingKeys = ['title', 'description', 'priority', 'status', 'department_id', 'assigned_to'];

        foreach ($interestingKeys as $key) {
            $oldValue = Arr::get($originalData, $key);
            $newValue = $issue->{$key};

            if ($oldValue != $newValue) {
                $changes[$key] = [
                    'old' => $oldValue,
                    'new' => $newValue,
                ];
            }
        }


        if (empty($changes)) {
            return;
        }

        $recipients = collect();

        // Add creator to recipients if they are not the updater
        if ($issue->creator && $issue->creator->id !== $updater->id) {
            $recipients->push($issue->creator);
        }

        // Add assignee to recipients if they are not the updater
        if ($issue->assignee && $issue->assignee->id !== $updater->id) {
            $recipients->push($issue->assignee);
        }

        // If updater is a director, notify department head
        if ($updater->hasRole('director')) {
            if ($issue->department && $issue->department->head) {
                $recipients->push($issue->department->head);
            }
        }

        // Notify directors if ticked
        if ($issue->notify_directors) {
            $directors = User::whereHas('roles', function ($query) {
                $query->where('name', 'director');
            })->get();

            foreach ($directors as $director) {
                if ($director->id !== $updater->id) {
                    $recipients->push($director);
                }
            }
        }

        $recipients = $recipients->unique('id');

        foreach ($recipients as $recipient) {
            Mail::to($recipient->email)->send(new IssueUpdatedNotification($issue, $changes));
        }
    }
}
