import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Index({ auth, departments }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Departments
                </h2>
            }
        >
            <Head title="Departments" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-semibold">
                                    Departments
                                </h2>
                                <Link
                                    href={route("departments.create")}
                                    className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                                >
                                    Add Department
                                </Link>
                            </div>

                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Description
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {departments.map((department) => (
                                        <tr key={department.id}>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                {department.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                {department.description ||
                                                    "N/A"}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                                        department.is_active
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {department.is_active
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                                <Link
                                                    href={route(
                                                        "departments.edit",
                                                        department.id
                                                    )}
                                                    className="mr-4 text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Edit
                                                </Link>
                                                <Link
                                                    href={route(
                                                        "departments.destroy",
                                                        department.id
                                                    )}
                                                    method="delete"
                                                    as="button"
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
