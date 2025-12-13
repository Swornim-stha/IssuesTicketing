import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Show({ auth, issue, canComment }) {
    const [editingComment, setEditingComment] = useState(null);

    const { data, setData, post, processing, reset } = useForm({
        comment: "",
    });

    const {
        data: editData,
        setData: setEditData,
        put,
        processing: editProcessing,
    } = useForm({
        comment: "",
    });

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

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("issues.comments.store", issue.id), {
            onSuccess: () => reset(),
        });
    };

    const handleEdit = (comment) => {
        setEditingComment(comment.id);
        setEditData("comment", comment.comment);
    };

    const handleUpdate = (e, commentId) => {
        e.preventDefault();
        put(route("comments.update", commentId), {
            onSuccess: () => setEditingComment(null),
        });
    };

    const handleDelete = (commentId) => {
        if (confirm("Delete this comment?")) {
            router.delete(route("comments.destroy", commentId));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Issue: ${issue.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-semibold">
                                    Issue Details
                                </h2>
                                <div className="space-x-2">
                                    <Link
                                        href={route("issues.edit", issue.id)}
                                        className="rounded bg-indigo-500 px-4 py-2 font-bold text-white hover:bg-indigo-700"
                                    >
                                        Edit
                                    </Link>
                                    <Link
                                        href={route("issues.index")}
                                        className="rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-700"
                                    >
                                        Back
                                    </Link>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Title
                                    </h3>
                                    <p className="mt-1 text-lg font-semibold text-gray-900">
                                        {issue.title}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">
                                            Status
                                        </h3>
                                        <span
                                            className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
                                                issue.status
                                            )}`}
                                        >
                                            {issue.status
                                                .replace("_", " ")
                                                .toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">
                                            Priority
                                        </h3>
                                        <span
                                            className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getPriorityColor(
                                                issue.priority
                                            )}`}
                                        >
                                            {issue.priority.toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Description
                                    </h3>
                                    <p className="mt-1 whitespace-pre-wrap text-gray-900">
                                        {issue.description}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Department
                                    </h3>
                                    <p className="mt-1 text-gray-900">
                                        {issue.department?.name}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">
                                            Created By
                                        </h3>
                                        <p className="mt-1 text-gray-900">
                                            {issue.creator?.name}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">
                                            Created At:
                                        </h3>

                                        <p className="text-sm text-gray-900">
                                            {new Date(
                                                issue.created_at
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">
                                            Assigned To
                                        </h3>
                                        <p className="mt-1 text-gray-900">
                                            {issue.assignee?.name ||
                                                "Unassigned"}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">
                                            Last Updated:
                                        </h3>
                                        <p className="text-sm text-gray-900">
                                            {new Date(
                                                issue.updated_at
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                {/* {issue.attachment && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">
                                            Attachment
                                        </h3>
                                        <a
                                            href={`/storage/${issue.attachment}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-1 inline-flex items-center text-blue-600 hover:text-blue-800"
                                        >
                                            View Attachment
                                        </a>
                                    </div>
                                )} */}
                                {issue.attachments &&
                                    issue.attachments.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-3">
                                                Attachments
                                            </h3>
                                            <div className="space-y-2">
                                                {issue.attachments.map(
                                                    (attachment) => (
                                                        <div
                                                            key={attachment.id}
                                                            className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                                                        >
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">
                                                                    {
                                                                        attachment.original_name
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    {(
                                                                        attachment.file_size /
                                                                        1024
                                                                    ).toFixed(
                                                                        2
                                                                    )}{" "}
                                                                    KB
                                                                </p>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <a
                                                                    href={`/storage/${attachment.file_path}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                                                                >
                                                                    View
                                                                </a>
                                                                <a
                                                                    href={`/storage/${attachment.file_path}?download`}
                                                                    download
                                                                    className="rounded bg-gray-500 px-3 py-1 text-sm text-white hover:bg-gray-600"
                                                                >
                                                                    Download
                                                                </a>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                {/* Comments Section */}
                                <div className="border-t pt-6">
                                    <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                        Comments
                                    </h3>

                                    {issue.comments &&
                                    issue.comments.length > 0 ? (
                                        <div className="mb-6 space-y-4">
                                            {issue.comments.map((comment) => (
                                                <div
                                                    key={comment.id}
                                                    className="rounded-lg bg-gray-50 p-4"
                                                >
                                                    <div className="mb-2 flex items-start justify-between">
                                                        <div>
                                                            <span className="font-medium text-gray-900">
                                                                {
                                                                    comment.user
                                                                        .name
                                                                }
                                                            </span>
                                                            <span className="ml-2 text-sm text-gray-500">
                                                                {new Date(
                                                                    comment.created_at
                                                                ).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        {comment.user_id ===
                                                            auth.user.id && (
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() =>
                                                                        handleEdit(
                                                                            comment
                                                                        )
                                                                    }
                                                                    className="text-sm text-indigo-600 hover:text-indigo-900"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            comment.id
                                                                        )
                                                                    }
                                                                    className="text-sm text-red-600 hover:text-red-900"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {editingComment ===
                                                    comment.id ? (
                                                        <form
                                                            onSubmit={(e) =>
                                                                handleUpdate(
                                                                    e,
                                                                    comment.id
                                                                )
                                                            }
                                                            className="mt-2"
                                                        >
                                                            <textarea
                                                                value={
                                                                    editData.comment
                                                                }
                                                                onChange={(e) =>
                                                                    setEditData(
                                                                        "comment",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                rows="3"
                                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                            />
                                                            <div className="mt-2 flex space-x-2">
                                                                <button
                                                                    type="submit"
                                                                    disabled={
                                                                        editProcessing
                                                                    }
                                                                    className="rounded bg-indigo-500 px-3 py-1 text-sm text-white hover:bg-indigo-600"
                                                                >
                                                                    Save
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setEditingComment(
                                                                            null
                                                                        )
                                                                    }
                                                                    className="rounded bg-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-400"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </form>
                                                    ) : (
                                                        <p className="text-gray-700">
                                                            {comment.comment}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="mb-6 text-gray-500">
                                            No comments yet.
                                        </p>
                                    )}

                                    {canComment && (
                                        <form onSubmit={handleSubmit}>
                                            <textarea
                                                value={data.comment}
                                                onChange={(e) =>
                                                    setData(
                                                        "comment",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Add a comment..."
                                                rows="4"
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                                            >
                                                {processing
                                                    ? "Adding..."
                                                    : "Add Comment"}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
