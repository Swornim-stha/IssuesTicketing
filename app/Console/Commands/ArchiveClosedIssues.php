<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Issue;
use Carbon\Carbon;

class ArchiveClosedIssues extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'issues:archive-closed';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Archive issues that were closed on the same day.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $count = Issue::whereNotNull('closed_at')
            ->whereNull('archived_at')
            ->whereDate('closed_at', Carbon::today())
            ->update(['archived_at' => Carbon::now()]);

        $this->info("Archived {$count} issues.");
    }
}
