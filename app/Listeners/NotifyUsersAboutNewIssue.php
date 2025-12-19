<?php

namespace App\Listeners;

use App\Events\IssueCreated;
use App\Models\User;
use App\Notifications\NewIssueNotification as UserNewIssueNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Log;
use App\Notifications\EmailFailedNotification;
use App\Mail\NewIssueNotification as DepartmentNewIssueNotification;
use Illuminate\Support\Facades\Mail;


class NotifyUsersAboutNewIssue implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 5;

    /**
     * The number of seconds to wait before retrying the job.
     *
     * @var int
     */
    public $backoff = 10;

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

        // If no user is assigned, email the department.
        if (is_null($issue->assigned_to)) {
            $department = $issue->department;
            if ($department && $department->email) {
                try {
                    Mail::to($department->email)
                        ->queue(new DepartmentNewIssueNotification($issue));
                } catch (\Exception $e) {
                    $this->fail($e);
                }
            }
            return;
        }

        // If a user is assigned, notify department users and directors.
        $departmentUsers = User::where('department_id', $issue->department_id)->get();
        $directors = User::role('director')->get();
        $recipients = $departmentUsers->merge($directors)->unique('id');

        // Exclude the user who created the issue
        $recipients = $recipients->reject(function ($user) use ($issue) {
            return $user->id === $issue->created_by;
        });

        try {
            Notification::send($recipients, new UserNewIssueNotification($issue));
        } catch (\Exception $e) {
            $this->fail($e);
        }
    }


    /**
     * Handle a job failure.
     */
    public function failed(IssueCreated $event, \Throwable $exception): void
    {
        // Log the failure
        Log::error('Failed to send new issue notification for issue ' . $event->issue->id, [
            'exception' => $exception->getMessage(),
        ]);

        // Notify the user who created the issue that the email failed to send
        $creator = User::find($event->issue->created_by);
        if ($creator) {
            $creator->notify(new EmailFailedNotification($event->issue));
        }
    }
}
