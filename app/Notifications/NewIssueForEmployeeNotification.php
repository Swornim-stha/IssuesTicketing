<?php

namespace App\Notifications;

use App\Models\Issue;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class NewIssueForEmployeeNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Issue $issue)
    {
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        // This notification is only for the in-app database channel.
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'issue_id' => $this->issue->id,
            'title' => $this->issue->title,
            'message' => "A new issue '{$this->issue->title}' has been created in your department.",
            'url' => route('issues.show', $this->issue->id),
        ];
    }
}
