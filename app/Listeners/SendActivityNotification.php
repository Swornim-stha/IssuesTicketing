<?php

namespace App\Listeners;

use App\Events\CommentCreated;
use App\Events\IssueClosed;
use App\Events\IssueDeleted;
use App\Events\IssueResolved;
use App\Events\IssueUpdated;
use App\Models\User;
use App\Notifications\ActivityNotification;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Notification;

class SendActivityNotification implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Handle the events.
     */
    public function handleIssueUpdate(IssueUpdated $event): void
    {
        $message = "Issue #{$event->issue->id} '{$event->issue->title}' was updated by {$event->updater->name}.";
        $url = route('issues.show', $event->issue->id);

        $recipients = $this->getIssueRecipients($event->issue, $event->updater);

        Notification::send($recipients, new ActivityNotification($message, $url));
    }

    public function handleIssueResolve(IssueResolved $event): void
    {
        $message = "Issue #{$event->issue->id} '{$event->issue->title}' was resolved by {$event->updater->name}.";
        $url = route('issues.show', $event->issue->id);

        $recipients = $this->getIssueRecipients($event->issue, $event->updater);

        Notification::send($recipients, new ActivityNotification($message, $url));
    }

    public function handleIssueClose(IssueClosed $event): void
    {
        $message = "Issue #{$event->issue->id} '{$event->issue->title}' was closed by {$event->updater->name}.";
        $url = route('issues.show', $event->issue->id);

        $recipients = $this->getIssueRecipients($event->issue, $event->updater);

        Notification::send($recipients, new ActivityNotification($message, $url));
    }

    public function handleIssueDelete(IssueDeleted $event): void
    {
        $message = "Issue #{$event->issueId} '{$event->issueTitle}' was deleted by {$event->deleter->name}.";
        $url = route('issues.index'); // Redirect to index as issue is gone.

        $recipients = User::find($event->recipientIds);

        Notification::send($recipients, new ActivityNotification($message, $url));
    }

    public function handleCommentCreate(CommentCreated $event): void
    {
        $comment = $event->comment;
        $issue = $comment->issue;
        $commenter = $comment->user;

        $message = "{$commenter->name} added a new comment to issue #{$issue->id} '{$issue->title}'.";
        $url = route('issues.show', $issue->id) . '#comment-' . $comment->id;

        $recipients = $this->getIssueRecipients($issue, $commenter);

        Notification::send($recipients, new ActivityNotification($message, $url, $issue->id, $comment->id));
        \Log::info('Generated comment notification URL: ' . $url);
    }

    /**
     * Get a collection of relevant users for an issue notification.
     */
    private function getIssueRecipients($issue, $actor): \Illuminate\Support\Collection
    {
        return collect([$issue->creator, $issue->assignee])
            ->filter() // Remove nulls if no creator or assignee
            ->push($issue->department->head) // Add department head
            ->filter() // filter again in case of no head
            ->unique('id')
            ->reject(fn ($user) => $user->id === $actor->id); // Exclude the user who triggered the action
    }

    /**
     * Register the listeners for the subscriber.
     *
     * @return array<string, string>
     */
    public function subscribe(Dispatcher $events): array
    {
        return [
            IssueUpdated::class => 'handleIssueUpdate',
            IssueResolved::class => 'handleIssueResolve',
            IssueClosed::class => 'handleIssueClose',
            IssueDeleted::class => 'handleIssueDelete',
            CommentCreated::class => 'handleCommentCreate',
        ];
    }
}
