import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';

export default function Index({ auth, notifications }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">All Notifications</h2>}
        >
            <Head title="All Notifications" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="space-y-4">
                                {notifications.data.map((notification) => (
                                    <div key={notification.id} className="border-b pb-4">
                                        <p className="text-sm text-gray-800">{notification.data.message}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(notification.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                                {notifications.data.length === 0 && (
                                    <p>No notifications from the last 7 days.</p>
                                )}
                            </div>

                            <Pagination className="mt-6" links={notifications.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
