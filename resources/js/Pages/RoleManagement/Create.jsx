import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Create({ auth, permissions }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        permissions: [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("roles.store"));
    };

    const togglePermission = (permissionName) => {
        if (data.permissions.includes(permissionName)) {
            setData(
                "permissions",
                data.permissions.filter((p) => p !== permissionName)
            );
        } else {
            setData("permissions", [...data.permissions, permissionName]);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create Role
                </h2>
            }
        >
            <Head title="Create Role" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-semibold">
                                    Create New Role
                                </h2>
                                <Link
                                    href={route("roles.index")}
                                    className="rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-700"
                                >
                                    Back to List
                                </Link>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <label
                                        className="mb-2 block text-sm font-bold text-gray-700"
                                        htmlFor="name"
                                    >
                                        Role Name *
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        placeholder="e.g., hr-staff, it-staff"
                                        className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-xs italic text-red-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <label className="mb-3 block text-sm font-bold text-gray-700">
                                        Permissions
                                    </label>
                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                                        {permissions.map((permission) => (
                                            <label
                                                key={permission.id}
                                                className="flex items-center rounded border p-3 hover:bg-gray-50"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={data.permissions.includes(
                                                        permission.name
                                                    )}
                                                    onChange={() =>
                                                        togglePermission(
                                                            permission.name
                                                        )
                                                    }
                                                    className="mr-2"
                                                />
                                                <span className="text-sm text-gray-700">
                                                    {permission.name}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.permissions && (
                                        <p className="mt-1 text-xs italic text-red-500">
                                            {errors.permissions}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                                    >
                                        {processing
                                            ? "Creating..."
                                            : "Create Role"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
