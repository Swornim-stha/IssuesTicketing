<?php

namespace App\Console\Commands;

use App\Models\Department;
use Illuminate\Console\Command;
use function Laravel\Prompts\table;

class ListDepartmentEmails extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'departments:list-emails';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'List all departments with their configured email and their head\'s email';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Fetching department email configurations...');

        $departments = Department::with('head')->get();

        if ($departments->isEmpty()) {
            $this->info('No departments found.');
            return;
        }

        $tableData = $departments->map(function ($department) {
            return [
                'ID' => $department->id,
                'Department Name' => $department->name,
                'Department Email' => $department->email,
                'Head Email' => $department->head ? $department->head->email : '(No Head)',
                'Status' => ($department->head && $department->email === $department->head->email)
                    ? ' Mismatched'
                    : ' OK',
            ];
        });

        $this->table(
            ['ID', 'Department Name', 'Department Email', 'Head Email', 'Status'],
            $tableData
        );

        $this->info('Departments marked with "Mismatched" are likely using the head\'s email instead of a shared mailbox.');
        $this->info('Please update these via your application\'s "Edit Department" page.');
    }
}
