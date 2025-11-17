<?php

namespace App\Listeners;

use App\Events\IssueCreated;
use App\Mail\NewIssueNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendNewIssueNotification
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
    public function handle(IssueCreated $event): void
    {
        if ($event->issue->assignee) {
            Mail::to($event->issue->assignee->email)->send(new NewIssueNotification($event->issue));
        }
    }
}
