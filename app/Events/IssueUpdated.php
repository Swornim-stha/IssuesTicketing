<?php

namespace App\Events;

use App\Models\Issue;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class IssueUpdated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $issue;
    public $originalData;
    public $updater;

    /**
     * Create a new event instance.
     */
    public function __construct(Issue $issue, array $originalData, User $updater)
    {
        $this->issue = $issue;
        $this->originalData = $originalData;
        $this->updater = $updater;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('channel-name'),
        ];
    }
}
