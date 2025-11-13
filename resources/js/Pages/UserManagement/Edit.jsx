import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Edit({ auth, user, roles, departments }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        role: user.roles[0]?.name || "",
        department_id: user.department_id || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("users.update", user.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit User
                </h2>
            }
        >
            <Head title="Edit User" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-semibold">
                                    Edit User: {user.name}
                                </h2>
                                <Link
                                    href={route("users.index")}
                                    className="rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-700"
                                >
                                    Back to List
                                </Link>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label
                                        className="mb-2 block text-sm font-bold text-gray-700"
                                        htmlFor="name"
                                    >
                                        Name *
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-xs italic text-red-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label
                                        className="mb-2 block text-sm font-bold text-gray-700"
                                        htmlFor="email"
                                    >
                                        Email *
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-xs italic text-red-500">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label
                                        className="mb-2 block text-sm font-bold text-gray-700"
                                        htmlFor="role"
                                    >
                                        Role *
                                    </label>
                                    <select
                                        id="role"
                                        value={data.role}
                                        onChange={(e) =>
                                            setData("role", e.target.value)
                                        }
                                        className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                                    >
                                        <option value="">Select Role</option>
                                        {roles.map((role) => (
                                            <option
                                                key={role.id}
                                                value={role.name}
                                            >
                                                {role.name
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    role.name.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.role && (
                                        <p className="mt-1 text-xs italic text-red-500">
                                            {errors.role}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <label
                                        className="mb-2 block text-sm font-bold text-gray-700"
                                        htmlFor="department_id"
                                    >
                                        Department
                                    </label>
                                    <select
                                        id="department_id"
                                        value={data.department_id}
                                        onChange={(e) =>
                                            setData(
                                                "department_id",
                                                e.target.value
                                            )
                                        }
                                        className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                                    >
                                        <option value="">No Department</option>
                                        {departments.map((dept) => (
                                            <option
                                                key={dept.id}
                                                value={dept.id}
                                            >
                                                {dept.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.department_id && (
                                        <p className="mt-1 text-xs italic text-red-500">
                                            {errors.department_id}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500">
                                        Assign a department for employees to see
                                        department-specific issues
                                    </p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                                    >
                                        {processing
                                            ? "Updating..."
                                            : "Update User"}
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
