<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class ActivityNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public string $message,
        public string $url,
        public ?int $issue_id = null,
        public ?int $comment_id = null,
    ) {
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        // This notification is designed for the database channel.
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     * This is what will be stored in the 'data' column of the 'notifications' table.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'message' => $this->message,
            'url' => $this->url,
            'issue_id' => $this->issue_id,
            'comment_id' => $this->comment_id,
        ];
    }
}
