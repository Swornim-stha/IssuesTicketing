<?php

namespace App\Listeners;

use App\Events\CommentCreated;
use App\Mail\NewCommentNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendCommentCreatedNotification
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
    public function handle(CommentCreated $event): void
    {
        $comment = $event->comment;
        $issue = $comment->issue;
        $commenter = $comment->user;

        $recipient = null;

        // If commenter is the assignee, notify the creator
        if ($issue->assignee && $commenter->id === $issue->assignee->id) {
            $recipient = $issue->creator;
        } 
        // If commenter is the creator, notify the assignee
        elseif ($commenter->id === $issue->creator->id) {
            $recipient = $issue->assignee;
        } 
        // If commenter is another user, notify both creator and assignee
        else {
            if ($issue->creator) {
                Mail::to($issue->creator->email)->send(new NewCommentNotification($comment));
            }
            if ($issue->assignee && $issue->assignee->id !== $issue->creator->id) {
                Mail::to($issue->assignee->email)->send(new NewCommentNotification($comment));
            }
            return;
        }

        if ($recipient) {
            Mail::to($recipient->email)->send(new NewCommentNotification($comment));
        }
    }
}
