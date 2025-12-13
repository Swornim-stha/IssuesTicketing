import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useMemo } from "react";

export default function Create({ auth, departments, users }) {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        description: "",
        priority: "medium",
        department_id: "",
        assigned_to: "",
        attachments: [],
        // escalate_to_director: false,
    });

    // ✅ Department-based user filtering
    const filteredUsers = useMemo(() => {
        if (!data.department_id) return [];
        return users.filter(
            (user) => user.department_id === parseInt(data.department_id)
        );
    }, [data.department_id, users]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("issues.store"));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create New Issue
                </h2>
            }
        >
            <Head title="Create Issue" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-semibold">
                                    Create New Issue
                                </h2>
                                <Link
                                    href={route("issues.index")}
                                    className="rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-700"
                                >
                                    Back to List
                                </Link>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {/* Title */}
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

                                {/* Description */}
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

                                {/* Priority & Department */}
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
                                </div>

                                {/* Assign To */}
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
                                        disabled={data.escalate_to_director}
                                    >
                                        <option value="">Unassigned</option>
                                        {filteredUsers.map((user) => (
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
                                {/* Attachment */}
                                {/* <div className="mb-6">
                                    <label
                                        className="mb-2 block text-sm font-bold text-gray-700"
                                        htmlFor="attachments"
                                    >
                                        Attachments (Optional - Max 10MB each)
                                    </label>
                                    <input
                                        id="attachments"
                                        type="file"
                                        multiple={true}
                                        onChange={(e) =>
                                            setData("attachments", [
                                                ...data.attachments,
                                                ...Array.from(e.target.files),
                                            ])
                                        }
                                        // className="..."
                                    />
                                    {data.attachments.length > 0 && (
                                        <div className="mt-3">
                                            <p className="mb-2 text-sm font-medium text-gray-700">
                                                Selected Files (
                                                {data.attachments.length}):
                                            </p>
                                            <div className="space-y-2">
                                                {data.attachments.map(
                                                    (file, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center justify-between rounded bg-gray-50 p-2"
                                                        >
                                                            <span className="text-sm text-gray-700">
                                                                {file.name}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setData(
                                                                        "attachments",
                                                                        data.attachments.filter(
                                                                            (
                                                                                _,
                                                                                i
                                                                            ) =>
                                                                                i !==
                                                                                index
                                                                        )
                                                                    )
                                                                }
                                                                className="text-sm text-red-600 hover:text-red-800"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {errors.attachments && (
                                        <p className="mt-1 text-xs italic text-red-500">
                                            {errors.attachments}
                                        </p>
                                    )}
                                </div> */}
                                {/* Attachments */}
                                <div className="mb-6">
                                    <label
                                        className="mb-2 block text-sm font-bold text-gray-700"
                                        htmlFor="attachments"
                                    >
                                        Attachments (Optional - Max 10MB each)
                                    </label>

                                    {/* Hidden file input */}
                                    <input
                                        id="attachments"
                                        type="file"
                                        multiple={true}
                                        onChange={(e) =>
                                            setData("attachments", [
                                                ...data.attachments,
                                                ...Array.from(e.target.files),
                                            ])
                                        }
                                        className="hidden"
                                    />

                                    {/* Custom upload area */}
                                    <label
                                        htmlFor="attachments"
                                        className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 p-8 transition hover:border-blue-500 hover:bg-blue-100"
                                    >
                                        <div className="text-center">
                                            <svg
                                                className="mx-auto h-12 w-12 text-blue-500"
                                                stroke="currentColor"
                                                fill="none"
                                                viewBox="0 0 48 48"
                                            >
                                                <path
                                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-8l-3.172-3.172a4 4 0 00-5.656 0L28 20m0 0l-3.172-3.172a4 4 0 00-5.656 0l-10.172 10.172"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <p className="mt-2 text-sm font-medium text-gray-700">
                                                Click to upload or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG, PDF up to 10MB each
                                            </p>
                                        </div>
                                    </label>

                                    {/* Selected files list */}
                                    {data.attachments.length > 0 && (
                                        <div className="mt-4">
                                            <p className="mb-3 text-sm font-semibold text-gray-700">
                                                📎 Selected Files (
                                                {data.attachments.length}):
                                            </p>
                                            <div className="space-y-2">
                                                {data.attachments.map(
                                                    (file, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center justify-between rounded-lg bg-gradient-to-r from-gray-200 to-gray-500 p-3 border border-gray-500"
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-200">
                                                                    <span className="text-xs font-bold text-gray-700">
                                                                        {file.name
                                                                            .split(
                                                                                "."
                                                                            )
                                                                            .pop()
                                                                            .toUpperCase()}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-800">
                                                                        {
                                                                            file.name
                                                                        }
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        {(
                                                                            file.size /
                                                                            1024
                                                                        ).toFixed(
                                                                            2
                                                                        )}{" "}
                                                                        KB
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setData(
                                                                        "attachments",
                                                                        data.attachments.filter(
                                                                            (
                                                                                _,
                                                                                i
                                                                            ) =>
                                                                                i !==
                                                                                index
                                                                        )
                                                                    )
                                                                }
                                                                className="rounded-full bg-red-100 p-1 text-red-600 hover:bg-red-200 transition"
                                                            >
                                                                <svg
                                                                    className="h-5 w-5"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 20 20"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {errors.attachments && (
                                        <p className="mt-2 text-xs italic text-red-500">
                                            {errors.attachments}
                                        </p>
                                    )}
                                </div>
                                {/* Submit */}
                                <div className="flex items-center justify-between">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                                    >
                                        {processing
                                            ? "Creating..."
                                            : "Create Issue"}
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
