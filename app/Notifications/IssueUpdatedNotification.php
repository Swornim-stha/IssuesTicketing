<?php

namespace App\Notifications;

use App\Models\Issue;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class IssueUpdatedNotification extends Notification
{
    use Queueable;

    protected $issue;
    protected $updatingUser;
    protected $message;

    /**
     * Create a new notification instance.
     */
    public function __construct(Issue $issue, User $updatingUser, string $message)
    {
        $this->issue = $issue;
        $this->updatingUser = $updatingUser;
        $this->message = $message;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
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
            'message' => $this->message,
            'updater_name' => $this->updatingUser->name,
        ];
    }
}
