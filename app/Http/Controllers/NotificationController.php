<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index()
    {
        return response()->json(Auth::user()->unreadNotifications);
    }

    public function all()
    {
        $notifications = Auth::user()->notifications()
            ->where('created_at', '>', now()->subDays(7))
            ->paginate(15);

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
        ]);
    }

    public function markAsRead(Request $request)
    {
        $user = Auth::user();
        if ($request->id) {
            $user->notifications()->where('id', $request->id)->first()?->markAsRead();
        } else {
            $user->unreadNotifications->markAsRead();
        }

        return response()->noContent();
    }
}