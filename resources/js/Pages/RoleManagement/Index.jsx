import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Index({ auth, roles }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Role Management
                </h2>
            }
        >
            <Head title="Role Management" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-semibold">
                                    Roles & Permissions
                                </h2>
                                <Link
                                    href={route("roles.create")}
                                    className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                                >
                                    Create New Role
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {roles && roles.length > 0 ? (
                                    roles.map((role) => (
                                        <div
                                            key={role.id}
                                            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                                        >
                                            <div className="mb-4">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {role.name
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        role.name.slice(1)}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {role.users_count}{" "}
                                                    {role.users_count === 1
                                                        ? "user"
                                                        : "users"}
                                                </p>
                                            </div>

                                            <div className="flex space-x-2">
                                                <Link
                                                    href={route(
                                                        "roles.edit",
                                                        role.id
                                                    )}
                                                    className="flex-1 rounded bg-indigo-500 px-3 py-2 text-center text-sm font-medium text-white hover:bg-indigo-600"
                                                >
                                                    Edit
                                                </Link>
                                                {![
                                                    "admin",
                                                    "director",
                                                ].includes(role.name) && (
                                                    <Link
                                                        href={route(
                                                            "roles.destroy",
                                                            role.id
                                                        )}
                                                        method="delete"
                                                        as="button"
                                                        className="flex-1 rounded bg-red-500 px-3 py-2 text-center text-sm font-medium text-white hover:bg-red-600"
                                                        onBefore={() =>
                                                            confirm(
                                                                "Are you sure you want to delete this role?"
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center text-gray-500">
                                        No roles found.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
