<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Str;

class RoleManagementController extends Controller
{
    public function index()
    {
        $roles = Role::withCount('users')->get();
        return Inertia::render('RoleManagement/Index', ['roles' => $roles]);
    }

    public function create()
    {
        $permissions = Permission::all()->pluck('name');
        return Inertia::render('RoleManagement/Create', ['permissions' => $permissions]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'permissions' => 'array',
        ]);

        $role = Role::create(['name' => $validated['name']]);

        $permissions = $validated['permissions'] ?? [];
        $this->syncPermissions($role, $permissions);

        return redirect()->route('roles.index')->with('success', 'Role created.');
    }

    public function edit(Role $role)
    {
        $allPermissions = Permission::all();
        $rolePermissions = $role->permissions->pluck('name')->toArray();

        $permissionsTree = $this->buildPermissionsTree($allPermissions);

        return Inertia::render('RoleManagement/Edit', [
            'role' => $role,
            'permissionsTree' => $permissionsTree,
            'rolePermissions' => $rolePermissions,
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'permissions' => 'array',
        ]);

        $role->update(['name' => $validated['name']]);
        
        $permissions = $validated['permissions'] ?? [];
        $this->syncPermissions($role, $permissions);

        return redirect()->route('roles.index')->with('success', 'Role updated.');
    }

    public function destroy(Role $role)
    {
        if (in_array($role->name, ['admin', 'director', 'employee', 'user'])) {
            return back()->withErrors(['error' => 'Cannot delete core roles.']);
        }
        $role->delete();
        return redirect()->route('roles.index')->with('success', 'Role deleted.');
    }

    private function buildPermissionsTree($permissions)
    {
        $tree = [];
        $permissions->each(function ($permission) use (&$tree) {
            $parts = explode('.', $permission->name);
            $group = $parts[0];

            if (!isset($tree[$group])) {
                $tree[$group] = [
                    'title' => Str::ucfirst($group),
                    'key' => $group,
                    'children' => [],
                ];
            }

            if (count($parts) > 1) {
                $tree[$group]['children'][] = [
                    'title' => Str::ucfirst(str_replace('_', ' ', $parts[1])),
                    'key' => $permission->name,
                ];
            }
        });

        return array_values($tree);
    }
    
    private function syncPermissions(Role $role, array $permissions)
    {
        $allPermissions = Permission::all()->pluck('name')->toArray();
        $finalPermissions = [];

        foreach ($permissions as $permission) {
            $finalPermissions[] = $permission;
            // If a parent permission is selected, add all its children
            if (!Str::contains($permission, '.')) {
                foreach ($allPermissions as $child) {
                    if (Str::startsWith($child, $permission . '.')) {
                        $finalPermissions[] = $child;
                    }
                }
            }
        }
        
        $role->syncPermissions(array_unique($finalPermissions));
    }
}
