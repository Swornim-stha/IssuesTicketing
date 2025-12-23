<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class IssueDeleted
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $issueId;
    public string $issueTitle;
    public array $recipientIds;

    /**
     * Create a new event instance.
     * We pass in raw data because the Issue model will be deleted when this event is handled.
     */
    public function __construct(int $issueId, string $issueTitle, array $recipientIds, public User $deleter)
    {
        $this->issueId = $issueId;
        $this->issueTitle = $issueTitle;
        $this->recipientIds = $recipientIds;
    }
}
