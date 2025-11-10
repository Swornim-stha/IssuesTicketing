import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Edit({ auth, issue, departments, users }) {
    const { data, setData, post, processing, errors } = useForm({
        title: issue.title,
        description: issue.description,
        priority: issue.priority,
        status: issue.status,
        department_id: issue.department_id,
        assigned_to: issue.assigned_to || "",
        attachment: null,
        _method: "PUT",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("issues.update", issue.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Issue
                </h2>
            }
        >
            <Head title="Edit Issue" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-semibold">
                                    Edit Issue
                                </h2>
                                <Link
                                    href={route("issues.index")}
                                    className="rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-700"
                                >
                                    Back to List
                                </Link>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label
                                        className="mb-2 block text-sm font-bold text-gray-700"
                                        htmlFor="title"
                                    >
                                        Title *
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData("title", e.target.value)
                                        }
                                        className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                                    />
                                    {errors.title && (
                                        <p className="mt-1 text-xs italic text-red-500">
                                            {errors.title}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label
                                        className="mb-2 block text-sm font-bold text-gray-700"
                                        htmlFor="description"
                                    >
                                        Description *
                                    </label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        rows="6"
                                        className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-xs italic text-red-500">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label
                                            className="mb-2 block text-sm font-bold text-gray-700"
                                            htmlFor="priority"
                                        >
                                            Priority *
                                        </label>
                                        <select
                                            id="priority"
                                            value={data.priority}
                                            onChange={(e) =>
                                                setData(
                                                    "priority",
                                                    e.target.value
                                                )
                                            }
                                            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">
                                                Medium
                                            </option>
                                            <option value="high">High</option>
                                            <option value="critical">
                                                Critical
                                            </option>
                                        </select>
                                        {errors.priority && (
                                            <p className="mt-1 text-xs italic text-red-500">
                                                {errors.priority}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            className="mb-2 block text-sm font-bold text-gray-700"
                                            htmlFor="status"
                                        >
                                            Status *
                                        </label>
                                        <select
                                            id="status"
                                            value={data.status}
                                            onChange={(e) =>
                                                setData(
                                                    "status",
                                                    e.target.value
                                                )
                                            }
                                            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                                        >
                                            <option value="open">Open</option>
                                            <option value="in_progress">
                                                In Progress
                                            </option>
                                            <option value="resolved">
                                                Resolved
                                            </option>
                                            <option value="closed">
                                                Closed
                                            </option>
                                        </select>
                                        {errors.status && (
                                            <p className="mt-1 text-xs italic text-red-500">
                                                {errors.status}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label
                                        className="mb-2 block text-sm font-bold text-gray-700"
                                        htmlFor="department_id"
                                    >
                                        Department *
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
                                        <option value="">
                                            Select Department
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
                                    {errors.department_id && (
                                        <p className="mt-1 text-xs italic text-red-500">
                                            {errors.department_id}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label
                                        className="mb-2 block text-sm font-bold text-gray-700"
                                        htmlFor="assigned_to"
                                    >
                                        Assign To (Optional)
                                    </label>
                                    <select
                                        id="assigned_to"
                                        value={data.assigned_to}
                                        onChange={(e) =>
                                            setData(
                                                "assigned_to",
                                                e.target.value
                                            )
                                        }
                                        className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                                    >
                                        <option value="">Unassigned</option>
                                        {users.map((user) => (
                                            <option
                                                key={user.id}
                                                value={user.id}
                                            >
                                                {user.name} ({user.email})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.assigned_to && (
                                        <p className="mt-1 text-xs italic text-red-500">
                                            {errors.assigned_to}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <label
                                        className="mb-2 block text-sm font-bold text-gray-700"
                                        htmlFor="attachment"
                                    >
                                        New Attachment (Optional - Max 10MB)
                                    </label>
                                    {issue.attachment && (
                                        <p className="mb-2 text-sm text-gray-600">
                                            Current:{" "}
                                            <a
                                                href={`/storage/${issue.attachment}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                View Current Attachment
                                            </a>
                                        </p>
                                    )}
                                    <input
                                        id="attachment"
                                        type="file"
                                        onChange={(e) =>
                                            setData(
                                                "attachment",
                                                e.target.files[0]
                                            )
                                        }
                                        className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                                    />
                                    {errors.attachment && (
                                        <p className="mt-1 text-xs italic text-red-500">
                                            {errors.attachment}
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
                                            ? "Updating..."
                                            : "Update Issue"}
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
