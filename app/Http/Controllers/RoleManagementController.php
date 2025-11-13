<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleManagementController extends Controller
{
    public function index()
    {
        $roles = Role::withCount('users')->get();
        return Inertia::render('RoleManagement/Index', ['roles' => $roles]);
    }

    public function create()
    {
        $permissions = Permission::all();
        return Inertia::render('RoleManagement/Create', ['permissions' => $permissions]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'permissions' => 'array',
        ]);

        $role = Role::create(['name' => $validated['name']]);
        if (!empty($validated['permissions'])) {
            $role->givePermissionTo($validated['permissions']);
        }
        return redirect()->route('roles.index')->with('success', 'Role created.');
    }

    public function edit(Role $role)
    {
        $permissions = Permission::all();
        $rolePermissions = $role->permissions->pluck('name')->toArray();
        return Inertia::render('RoleManagement/Edit', [
            'role' => $role,
            'permissions' => $permissions,
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
        $role->syncPermissions($validated['permissions'] ?? []);
        return redirect()->route('roles.index')->with('success', 'Role updated.');
    }

    public function destroy(Role $role)
    {
        if (in_array($role->name, ['admin', 'director'])) {
            return back()->withErrors(['error' => 'Cannot delete core roles.']);
        }
        $role->delete();
        return redirect()->route('roles.index')->with('success', 'Role deleted.');
    }
}
