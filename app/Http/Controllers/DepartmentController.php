<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    public function index()
    {
        $departments = Department::with('head')->latest()->get();

        return Inertia::render('Departments/Index', [
            'departments' => $departments
        ]);
    }

    public function create()
    {
        return Inertia::render('Departments/Create', [
            'users' => User::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:departments',
            'email' => 'required|email|unique:departments,email',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'head_id' => 'nullable|integer|exists:users,id',
        ]);

        Department::create($validated);

        return redirect()->route('departments.index')
            ->with('success', 'Department created successfully.');
    }

    public function edit(Department $department)
    {
        return Inertia::render('Departments/Edit', [
            'department' => $department,
            'users' => User::all()
        ]);
    }

    public function update(Request $request, Department $department)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:departments,name,' . $department->id,
            'email' => 'required|email|unique:departments,email,' . $department->id,
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'head_id' => 'nullable|integer|exists:users,id',
        ]);

        $department->update($validated);

        return redirect()->route('departments.index')
            ->with('success', 'Department updated successfully.');
    }

    public function destroy(Department $department)
    {
        $department->delete();

        return redirect()->route('departments.index')
            ->with('success', 'Department deleted successfully.');
    }
}
