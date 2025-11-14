import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import CreateUserForm from "./CreateUserForm";
import Modal from "@/Components/Modal";

export default function Index({ auth, users, roles, departments }) {
    const [showCreateUserModal, setShowCreateUserModal] = useState(false);
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);

    const handleUserCreated = () => {
        setShowCreateUserModal(false);
        setShowSuccessNotification(true);
        setTimeout(() => setShowSuccessNotification(false), 3000);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    User Management
                </h2>
            }
        >
            <Head title="User Management" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-semibold">
                                    User Management
                                </h2>
                                <button
                                    onClick={() => setShowCreateUserModal(true)}
                                    className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                                >
                                    Create User
                                </button>
                            </div>

                            {showSuccessNotification && (
                                <div className="mb-4 rounded-lg bg-green-100 p-4 text-green-800">
                                    User created successfully!
                                </div>
                            )}

                            <Modal show={showCreateUserModal} onClose={() => setShowCreateUserModal(false)}>
                                <CreateUserForm
                                    roles={roles}
                                    departments={departments}
                                    onSuccess={handleUserCreated}
                                    onCancel={() => setShowCreateUserModal(false)}
                                />
                            </Modal>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Role
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Department
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {users && users.length > 0 ? (
                                            users.map((user) => (
                                                <tr key={user.id}>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.name}
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <div className="text-sm text-gray-900">
                                                            {user.email}
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800">
                                                            {user.roles[0]
                                                                ?.name ||
                                                                "No Role"}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {user.department
                                                            ?.name || "N/A"}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                                        <Link
                                                            href={route(
                                                                "users.edit",
                                                                user.id
                                                            )}
                                                            className="mr-3 text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Edit
                                                        </Link>
                                                        {user.id !==
                                                            auth.user.id && (
                                                            <Link
                                                                href={route(
                                                                    "users.destroy",
                                                                    user.id
                                                                )}
                                                                method="delete"
                                                                as="button"
                                                                className="text-red-600 hover:text-red-900"
                                                                onBefore={() =>
                                                                    confirm(
                                                                        "Are you sure you want to delete this user?"
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
                                                    colSpan="5"
                                                    className="px-6 py-4 text-center text-gray-500"
                                                >
                                                    No users found.
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
