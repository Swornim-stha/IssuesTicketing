<?php

namespace App\Listeners;

use App\Events\IssueCreated;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Log;
use App\Notifications\EmailFailedNotification;
use App\Mail\NewIssueNotification as DepartmentNewIssueNotification;
use App\Notifications\NewIssueForEmployeeNotification;
use Illuminate\Support\Facades\Mail;

class NotifyUsersAboutNewIssue implements ShouldQueue
{
    use InteractsWithQueue;

    public $tries = 5;
    public $backoff = 10;

    /**
     * Handle the event.
     */
    public function handle(IssueCreated $event): void
    {
        try {
            $issue = $event->issue->load('department', 'creator');
            $department = $issue->department;
            $creator = $issue->creator;

            // 1. Email the department's shared mailbox, if it exists.
            if ($department && $department->email) {
                Mail::to($department->email)
                    ->queue(new DepartmentNewIssueNotification($issue));
            }

            // 2. Send a database notification to all employees in the department.
            if ($department) {
                $recipients = User::where('department_id', $department->id)
                    ->whereHas('roles', fn ($query) => $query->where('name', 'employee'))
                    ->where('id', '!=', $creator->id) // Exclude the creator
                    ->get();

                if ($recipients->isNotEmpty()) {
                    Notification::send($recipients, new NewIssueForEmployeeNotification($issue));
                }
            }
        } catch (\Exception $e) {
            $this->fail($event, $e);
        }
    }


    /**
     * Handle a job failure.
     */
    public function failed(IssueCreated $event, \Throwable $exception): void
    {
        Log::error('Failed to send new issue notification for issue ' . $event->issue->id, [
            'exception' => $exception->getMessage(),
        ]);

        $creator = User::find($event->issue->creator->id);
        if ($creator) {
            // Using a generic notification as we don't know which part failed.
            // You might want to create a more specific one.
            $creator->notify(new EmailFailedNotification(
                'system',
                'New Issue Notification Failure',
                'We failed to send one or more notifications for your new issue: ' . $event->issue->title
            ));
        }
    }
}
