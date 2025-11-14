<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\IssueController;
use App\Http\Controllers\UserManagementController;
use App\Http\Controllers\RoleManagementController;
use App\Http\Controllers\DashboardController;
use App\Models\Comment;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Issues
    Route::get('issues/archived', [IssueController::class, 'archived'])->name('issues.archived');
    Route::resource('issues', IssueController::class);
    Route::post('issues/{issue}/comments', [IssueController::class, 'storeComment'])->name('issues.comments.store');
    Route::put('comments/{comment}', [IssueController::class, 'updateComment'])->name('comments.update');
    Route::delete('comments/{comment}', [IssueController::class, 'destroyComment'])->name('comments.destroy');

    // Departments
    Route::resource('departments', DepartmentController::class)->middleware('can:view departments');

    // Users
    Route::middleware('can:view users')->group(function () {
        Route::get('users', [UserManagementController::class, 'index'])->name('users.index');
        Route::post('users', [UserManagementController::class, 'store'])->name('users.store')->middleware('can:edit users');
        Route::get('users/{user}/edit', [UserManagementController::class, 'edit'])->name('users.edit')->middleware('can:edit users');
        Route::put('users/{user}', [UserManagementController::class, 'update'])->name('users.update')->middleware('can:edit users');
        Route::delete('users/{user}', [UserManagementController::class, 'destroy'])->name('users.destroy')->middleware('can:delete users');
    });

    // Roles
    Route::middleware('can:view roles')->group(function () {
        Route::resource('roles', RoleManagementController::class);
    });
});

require __DIR__ . '/auth.php';
