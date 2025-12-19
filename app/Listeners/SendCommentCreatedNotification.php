<?php

namespace App\Listeners;

use App\Events\CommentCreated;
use App\Mail\NewCommentNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendCommentCreatedNotification implements ShouldQueue
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
    public function handle(CommentCreated $event): void
    {
        $comment = $event->comment;
        $issue = $comment->issue;
        $commenter = $comment->user;

        $recipients = collect();

        // If commenter is the assignee, notify the creator
        if ($issue->assignee && $commenter->id === $issue->assignee->id) {
            $recipients->push($issue->creator);
        }
        // If commenter is the creator, notify the assignee
        elseif ($commenter->id === $issue->creator->id) {
            $recipients->push($issue->assignee);
        }
        // If commenter is another user, notify both creator and assignee
        else {
            $recipients->push($issue->creator);
            $recipients->push($issue->assignee);
        }

        $recipients = $recipients->filter()->unique('id');

        foreach ($recipients as $recipient) {
            Mail::to($recipient->email)->queue(new NewCommentNotification($comment));
        }
    }
}
