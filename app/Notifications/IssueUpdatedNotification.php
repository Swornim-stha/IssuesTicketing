<?php

namespace App\Notifications;

use App\Models\Issue;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class IssueUpdatedNotification extends Notification implements ShouldQueue
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
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Issue Updated: ' . $this->issue->title)
            ->line($this->message)
            ->line('This update was made by ' . $this->updatingUser->name . '.')
            ->action('View Issue', url('/issues/' . $this->issue->id))
            ->line('Thank you for using our application!');
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
