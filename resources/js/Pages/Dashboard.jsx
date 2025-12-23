import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

export default function Dashboard({
    auth,
    stats,
    recentIssues,
    departments,
    selectedDepartment,
}) {
    const handleDepartmentChange = (e) => {
        router.get(
            route("dashboard"),
            { department_id: e.target.value },
            { preserveState: true }
        );
    };

    const getPriorityColor = (priority) => {
        const colors = {
            low: "text-gray-600",
            medium: "text-blue-600",
            high: "text-orange-600",
            critical: "text-red-600",
        };
        return colors[priority] || "text-gray-600";
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
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Dashboard
                        </h2>
                        {departments && departments.length > 0 && (
                            <select
                                value={selectedDepartment || ""}
                                onChange={handleDepartmentChange}
                                className="rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="">All Departments</option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Stats Grid */}
                    <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Total Issues */}
                        <div className="overflow-hidden rounded-lg bg-white shadow">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg
                                            className="h-6 w-6 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="truncate text-sm font-medium text-gray-500">
                                                Total Issues
                                            </dt>
                                            <dd className="text-3xl font-semibold text-gray-900">
                                                {stats.total_issues}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Open Issues */}
                        <div className="overflow-hidden rounded-lg bg-white shadow">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg
                                            className="h-6 w-6 text-yellow-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="truncate text-sm font-medium text-gray-500">
                                                Open Issues
                                            </dt>
                                            <dd className="text-3xl font-semibold text-yellow-600">
                                                {stats.open_issues}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* In Progress */}
                        <div className="overflow-hidden rounded-lg bg-white shadow">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg
                                            className="h-6 w-6 text-blue-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 10V3L4 14h7v7l9-11h-7z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="truncate text-sm font-medium text-gray-500">
                                                In Progress
                                            </dt>
                                            <dd className="text-3xl font-semibold text-blue-600">
                                                {stats.in_progress_issues}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Critical Issues */}
                        <div className="overflow-hidden rounded-lg bg-white shadow">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg
                                            className="h-6 w-6 text-red-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="truncate text-sm font-medium text-gray-500">
                                                Critical Issues
                                            </dt>
                                            <dd className="text-3xl font-semibold text-red-600">
                                                {stats.critical_issues}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resolved Stats */}
                    <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
                        <div className="overflow-hidden rounded-lg bg-white shadow">
                            <div className="p-5">
                                <dl>
                                    <dt className="truncate text-sm font-medium text-gray-500">
                                        Resolved Today
                                    </dt>
                                    <dd className="text-2xl font-semibold text-green-600">
                                        {stats.resolved_today}
                                    </dd>
                                </dl>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg bg-white shadow">
                            <div className="p-5">
                                <dl>
                                    <dt className="truncate text-sm font-medium text-gray-500">
                                        Resolved This Week
                                    </dt>
                                    <dd className="text-2xl font-semibold text-green-600">
                                        {stats.resolved_this_week}
                                    </dd>
                                </dl>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg bg-white shadow">
                            <div className="p-5">
                                <dl>
                                    <dt className="truncate text-sm font-medium text-gray-500">
                                        Resolved This Month
                                    </dt>
                                    <dd className="text-2xl font-semibold text-green-600">
                                        {stats.resolved_this_month}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>

                    {/* Recent Issues */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Recent Issues
                                </h3>
                                <Link
                                    href={route("issues.index")}
                                    className="text-sm text-indigo-600 hover:text-indigo-900"
                                >
                                    View All →
                                </Link>
                            </div>

                            {recentIssues && recentIssues.length > 0 ? (
                                <div className="space-y-4">
                                    {recentIssues.map((issue) => (
                                        <Link
                                            key={issue.id}
                                            href={route(
                                                "issues.show",
                                                issue.id
                                            )}
                                            className="block rounded-lg border border-gray-200 p-4 transition hover:border-indigo-500 hover:shadow-md"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">
                                                        {issue.title}
                                                    </h4>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {issue.department?.name}{" "}
                                                        • Created by{" "}
                                                        {issue.creator?.name}
                                                    </p>
                                                </div>
                                                <div className="ml-4 flex flex-col items-end gap-2">
                                                    <span
                                                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
                                                            issue.status
                                                        )}`}
                                                    >
                                                        {issue.status.replace(
                                                            "_",
                                                            " "
                                                        )}
                                                    </span>
                                                    <span
                                                        className={`text-xs font-semibold ${getPriorityColor(
                                                            issue.priority
                                                        )}`}
                                                    >
                                                        {issue.priority.toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500">
                                    No recent issues
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
