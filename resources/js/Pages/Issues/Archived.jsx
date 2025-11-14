import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Archived({ auth, issues }) {
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
        <AuthenticatedLayout>
            <Head title="Archived Issues" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-semibold">
                                    Archived Issues
                                </h2>
                                <Link
                                    href={route("issues.index")}
                                    className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                                >
                                    Back to Issues
                                </Link>
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
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Archived At
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {issues && issues.length > 0 ? (
                                            issues.map((issue) => (
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
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {new Date(issue.archived_at).toLocaleString()}
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
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="6"
                                                    className="px-6 py-4 text-center text-gray-500"
                                                >
                                                    No archived issues found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
