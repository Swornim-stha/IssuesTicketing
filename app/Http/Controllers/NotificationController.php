<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        return response()->json(Auth::user()->unreadNotifications);
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