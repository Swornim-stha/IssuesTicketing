import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import Pagination from "@/Components/Pagination"; // Import the Pagination component

export default function Index({
    auth,
    issues,
    departments,
    users,
    filters: initialFilters,
    can_archive_issue,
    can_view_assignee,
    can_delete_issues,
}) {
    const [filters, setFilters] = useState({
        search: initialFilters.search || "",
        department: initialFilters.department || "",
        status: initialFilters.status || "",
        priority: initialFilters.priority || "",
        assignee: initialFilters.assignee || "",
        date: initialFilters.date || "",
    });

    // Function to apply filters by making a new Inertia request
    const applyFilters = () => {
        router.get(route("issues.index"), filters, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

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

    const canDelete = (issue) => {
        const isCreator = issue.created_by === auth.user.id;
        return can_delete_issues || isCreator;
    };

    const resetFilters = () => {
        const newFilters = {
            department: "",
            status: "",
            priority: "",
            search: "",
            assignee: "",
            date: "",
        };
        setFilters(newFilters);
        router.get(route("issues.index"), newFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Issues" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-semibold">
                                    Issues / Tickets
                                </h2>
                                <div className="flex gap-4">
                                    {can_archive_issue && (
                                        <Link
                                            href={route("issues.archived")}
                                            className="rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-700"
                                        >
                                            Archived Issues
                                        </Link>
                                    )}
                                    <Link
                                        href={route("issues.create")}
                                        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                                    >
                                        Create New Issue
                                    </Link>
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="mb-6 grid grid-cols-1 gap-4 rounded-lg bg-gray-50 p-4 md:grid-cols-7">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Search
                                    </label>
                                    <input
                                        type="text"
                                        name="search"
                                        value={filters.search}
                                        onChange={handleChange}
                                        placeholder="Search issues..."
                                        className="w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>

                                {departments && departments.length > 0 && (
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Department
                                        </label>
                                        <select
                                            name="department"
                                            value={filters.department}
                                            onChange={handleChange}
                                            className="w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="">
                                                All Departments
                                            </option>
                                            {departments.map((dept) => (
                                                <option
                                                    key={dept.id}
                                                    value={dept.id}
                                                >
                                                    {dept.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Status
                                    </label>
                                    <select
                                        name="status"
                                        value={filters.status}
                                        onChange={handleChange}
                                        className="w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="">All Status</option>
                                        <option value="open">Open</option>
                                        <option value="in_progress">
                                            In Progress
                                        </option>
                                        <option value="resolved">
                                            Resolved
                                        </option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Priority
                                    </label>
                                    <select
                                        name="priority"
                                        value={filters.priority}
                                        onChange={handleChange}
                                        className="w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="">All Priorities</option>
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="critical">
                                            Critical
                                        </option>
                                    </select>
                                </div>
                                {can_view_assignee && (
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Assignee
                                        </label>
                                        <select
                                            name="assignee"
                                            value={filters.assignee}
                                            onChange={handleChange}
                                            className="w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="">All Users</option>
                                            {users.map((user) => (
                                                <option
                                                    key={user.id}
                                                    value={user.id}
                                                >
                                                    {user.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={filters.date}
                                        onChange={handleChange}
                                        className="w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="flex items-end space-x-2">
                                    <button
                                        onClick={applyFilters}
                                        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                    >
                                        Filter
                                    </button>
                                    <button
                                        onClick={resetFilters}
                                        className="w-full rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>

                            {/* Results count */}
                            <div className="mb-4 text-sm text-gray-600">
                                Showing {issues.from || 0} to {issues.to || 0} of{" "}
                                {issues.total || 0} issues
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Title
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Department
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Priority
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Status
                                            </th>
                                            {can_view_assignee && (
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Assigned To
                                                </th>
                                            )}
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Created At
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {issues.data &&
                                        issues.data.length > 0 ? (
                                            issues.data.map((issue) => (
                                                <tr key={issue.id}>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {issue.title}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            by{" "}
                                                            {
                                                                issue.creator
                                                                    ?.name
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <div className="text-sm text-gray-900">
                                                            {
                                                                issue.department
                                                                    ?.name
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <span
                                                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getPriorityColor(
                                                                issue.priority
                                                            )}`}
                                                        >
                                                            {issue.priority}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <span
                                                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                                                                issue.status
                                                            )}`}
                                                        >
                                                            {issue.status.replace(
                                                                "_",
                                                                " "
                                                            )}
                                                        </span>
                                                    </td>
                                                    {can_view_assignee && (
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                            {issue.assignee
                                                                ?.name ||
                                                                "Unassigned"}
                                                        </td>
                                                    )}

                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {new Date(
                                                            issue.created_at
                                                        ).toLocaleString(
                                                            "en-GB",
                                                            {
                                                                day: "2-digit",
                                                                month: "2-digit",
                                                                year: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                                hour12: true,
                                                            }
                                                        )}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                                        <Link
                                                            href={route(
                                                                "issues.show",
                                                                issue.id
                                                            )}
                                                            className="mr-3 text-blue-600 hover:text-blue-900"
                                                        >
                                                            View
                                                        </Link>
                                                        <Link
                                                            href={route(
                                                                "issues.edit",
                                                                issue.id
                                                            )}
                                                            className="mr-3 text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Edit
                                                        </Link>
                                                        {canDelete(issue) && (
                                                            <Link
                                                                href={route(
                                                                    "issues.destroy",
                                                                    issue.id
                                                                )}
                                                                method="delete"
                                                                as="button"
                                                                className="text-red-600 hover:text-red-900"
                                                                onBefore={() =>
                                                                    confirm(
                                                                        "Are you sure you want to delete this issue?"
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </Link>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={
                                                        can_view_assignee ? 7 : 6
                                                    }
                                                    className="px-6 py-4 text-center text-gray-500"
                                                >
                                                    No issues found matching
                                                    your filters.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination links={issues.links} />{" "}
                            {/* Add the Pagination component here */}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

