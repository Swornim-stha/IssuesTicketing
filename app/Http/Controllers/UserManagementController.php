<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserManagementController extends Controller
{
    public function index()
    {
        $users = User::with(['roles', 'department'])->get();
        return Inertia::render('UserManagement/Index', ['users' => $users]);
    }

    public function edit(User $user)
    {
        $roles = Role::all();
        $departments = Department::where('is_active', true)->get();
        return Inertia::render('UserManagement/Edit', [
            'user' => $user->load('roles'),
            'roles' => $roles,
            'departments' => $departments,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role' => 'required|exists:roles,name',
            'department_id' => 'nullable|exists:departments,id',
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'department_id' => $validated['department_id'],
        ]);

        $user->syncRoles([$validated['role']]);
        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'You cannot delete yourself.']);
        }
        $user->delete();
        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }
}
