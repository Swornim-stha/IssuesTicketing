import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import axios from "axios";

const BellIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V5a1 1 0 00-2 0v.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9"
        />
    </svg>
);

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(route("notifications.index"));
            setNotifications(response.data);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id) => {
        try {
            await axios.post(route("notifications.markRead"), { id });
            fetchNotifications(); // Re-fetch to update the list
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.post(route("notifications.markRead"), {});
            fetchNotifications();
            setIsOpen(false);
        } catch (error) {
            console.error("Failed to mark all notifications as read:", error);
        }
    };

    const handleBellClick = () => {
        setIsOpen(!isOpen);
    };

    const handleNotificationClick = (notification) => {
        console.log(notification.data);
        let notificationUrl = "#"; // Default fallback URL

        if (notification.data.comment_id && notification.data.issue_id) {
            notificationUrl = route('issues.show', notification.data.issue_id) + '#comment-' + notification.data.comment_id;
        } else if (notification.data.url) {
            notificationUrl = notification.data.url;
        }

        markAsRead(notification.id);
        router.visit(notificationUrl);
    };

    return (
        <div className="relative">
            <button
                onClick={handleBellClick}
                className="relative text-gray-600 hover:text-gray-800 focus:outline-none"
            >
                <BellIcon />
                {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {notifications.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-md shadow-lg z-50">
                    <div className="py-2">
                        <div className="flex justify-between items-center px-4 py-2 border-b">
                            <h3 className="text-lg font-semibold">
                                Notifications
                            </h3>
                            <button
                                onClick={markAllAsRead}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                Mark all as read
                            </button>
                        </div>
                        {notifications.length > 0 ? (
                            notifications.map((notification) => {
                                return (
                                  <div
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className="block px-4 py-3 border-b hover:bg-gray-100 cursor-pointer"
                                    >
                                        <p className="text-sm text-gray-800">
                                            {notification.data.message}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(
                                                notification.created_at
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="px-4 py-4 text-sm text-gray-500">
                                No new notifications.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
