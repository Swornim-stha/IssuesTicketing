<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Define permissions in a structured way
        $permissionsByGroup = [
            'issues' => [
                'issues.view_all',
                'issues.view_department',
                'issues.view_own',
                'issues.create',
                'issues.edit',
                'issues.delete',
                'issues.change_status',
                'issues.view_assignee',
                'issues.archive',
            ],
            'departments' => [
                'departments.view',
                'departments.create',
                'departments.edit',
                'departments.delete',
            ],
            'users' => [
                'users.view',
                'users.create',
                'users.edit',
                'users.delete',
            ],
            'roles' => [
                'roles.view',
                'roles.create',
                'roles.edit',
                'roles.delete',
            ],
        ];

        // Create permissions
        foreach ($permissionsByGroup as $group => $permissions) {
            // Create a parent permission for the group
            Permission::firstOrCreate(['name' => $group]);
            foreach ($permissions as $permissionName) {
                Permission::firstOrCreate(['name' => $permissionName]);
            }
        }

        // Create Roles if they don't exist
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $directorRole = Role::firstOrCreate(['name' => 'director']);
        $employeeRole = Role::firstOrCreate(['name' => 'employee']);
        $userRole = Role::firstOrCreate(['name' => 'user']);

        // Assign all permissions to Admin
        $adminRole->syncPermissions(Permission::all());

        // Assign permissions to Director
        $directorRole->syncPermissions([
            'issues', 'issues.view_department', 'issues.create', 'issues.edit', 'issues.change_status', 'issues.view_assignee','issues.archive',
            'users', 'users.view', 'users.edit',
            'roles', 'roles.view',
            'departments', 'departments.view',
        ]);

        // Assign permissions to Employee
        $employeeRole->syncPermissions([
            'issues', 'issues.view_department', 'issues.create', 'issues.edit', 'issues.change_status',
        ]);

        // Assign permissions to User (basic user)
        $userRole->syncPermissions([
            'issues', 'issues.view_own', 'issues.create',
        ]);
    }
}