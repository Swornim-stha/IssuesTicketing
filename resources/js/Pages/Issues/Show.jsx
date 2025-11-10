import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Show({ auth, issue }) {
    const getPriorityColor = (priority) => {
        const colors = {
            low: "bg-gray-100 text-gray-800",
            medium: "bg-blue-100 text-blue-800",
            high: "bg-orange-100 text-orange-800",
            critical: "bg-red-100 text-red-800",
        };
        return colors[priority] || "bg-gray-100 text-gray-800";
    };

    const getStatusColor = (status) => {
        const colors = {
            open: "bg-yellow-100 text-yellow-800",
            in_progress: "bg-blue-100 text-blue-800",
            resolved: "bg-green-100 text-green-800",
            closed: "bg-gray-100 text-gray-800",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Issue Details
                </h2>
            }
        >
            <Head title={`Issue: ${issue.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-semibold">
                                    Issue Details
                                </h2>
                                <div className="space-x-2">
                                    <Link
                                        href={route("issues.edit", issue.id)}
                                        className="rounded bg-indigo-500 px-4 py-2 font-bold text-white hover:bg-indigo-700"
                                    >
                                        Edit
                                    </Link>
                                    <Link
                                        href={route("issues.index")}
                                        className="rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-700"
                                    >
                                        Back to List
                                    </Link>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Title */}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Title
                                    </h3>
                                    <p className="mt-1 text-lg font-semibold text-gray-900">
                                        {issue.title}
                                    </p>
                                </div>

                                {/* Status and Priority */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">
                                            Status
                                        </h3>
                                        <span
                                            className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
                                                issue.status
                                            )}`}
                                        >
                                            {issue.status
                                                .replace("_", " ")
                                                .toUpperCase()}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">
                                            Priority
                                        </h3>
                                        <span
                                            className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getPriorityColor(
                                                issue.priority
                                            )}`}
                                        >
                                            {issue.priority.toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Description
                                    </h3>
                                    <p className="mt-1 whitespace-pre-wrap text-gray-900">
                                        {issue.description}
                                    </p>
                                </div>

                                {/* Department */}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Department
                                    </h3>
                                    <p className="mt-1 text-gray-900">
                                        {issue.department?.name}
                                    </p>
                                </div>

                                {/* Created By and Assigned To */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">
                                            Created By
                                        </h3>
                                        <p className="mt-1 text-gray-900">
                                            {issue.creator?.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {issue.creator?.email}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">
                                            Assigned To
                                        </h3>
                                        <p className="mt-1 text-gray-900">
                                            {issue.assignee?.name ||
                                                "Unassigned"}
                                        </p>
                                        {issue.assignee && (
                                            <p className="text-sm text-gray-500">
                                                {issue.assignee.email}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Attachment */}
                                {issue.attachment && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">
                                            Attachment
                                        </h3>
                                        <a
                                            href={`/storage/${issue.attachment}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-1 inline-flex items-center text-blue-600 hover:text-blue-800"
                                        >
                                            <svg
                                                className="mr-2 h-5 w-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                                />
                                            </svg>
                                            View Attachment
                                        </a>
                                    </div>
                                )}

                                {/* Timestamps */}
                                <div className="grid grid-cols-1 gap-6 border-t pt-6 md:grid-cols-3">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">
                                            Created At
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {new Date(
                                                issue.created_at
                                            ).toLocaleString()}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">
                                            Last Updated
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {new Date(
                                                issue.updated_at
                                            ).toLocaleString()}
                                        </p>
                                    </div>

                                    {issue.resolved_at && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">
                                                Resolved At
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {new Date(
                                                    issue.resolved_at
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
