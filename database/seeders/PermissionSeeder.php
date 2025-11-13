<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Create permissions
        $permissions = [
            'view issues',
            'create issues',
            'edit issues',
            'delete issues',
            'change issue status',
            'view all issues',
            'view department issues',
            'view own issues',
            'view departments',
            'create departments',
            'edit departments',
            'delete departments',
            'view users',
            'edit users',
            'delete users',
            'view roles',
            'create roles',
            'edit roles',
            'delete roles',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Admin role - all permissions
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $admin->syncPermissions(Permission::all());

        // Director role
        $director = Role::firstOrCreate(['name' => 'director']);
        $director->syncPermissions([
            'view issues',
            'create issues',
            'edit issues',
            'change issue status',
            'view department issues',
            'view users',
            'edit users',
            'view roles',
        ]);

        // Employee role
        $employee = Role::firstOrCreate(['name' => 'employee']);
        $employee->syncPermissions([
            'view issues',
            'create issues',
            'edit issues',
            'change issue status',
            'view department issues',
        ]);

        // User role
        $user = Role::firstOrCreate(['name' => 'user']);
        $user->syncPermissions(['view own issues', 'create issues', 'edit issues', 'delete issues']);
    }
}
