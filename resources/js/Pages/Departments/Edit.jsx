import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Edit({ auth, department }) {
    const { data, setData, put, processing, errors } = useForm({
        name: department.name,
        description: department.description || "",
        is_active: department.is_active,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("departments.update", department.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Department
                </h2>
            }
        >
            <Head title="Edit Department" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-semibold">
                                    Edit Department
                                </h2>
                                <Link
                                    href={route("departments.index")}
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
                                        Department Name *
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
                                        htmlFor="description"
                                    >
                                        Description
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
                                        rows="4"
                                        className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-xs italic text-red-500">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={(e) =>
                                                setData(
                                                    "is_active",
                                                    e.target.checked
                                                )
                                            }
                                            className="mr-2"
                                        />
                                        <span className="text-sm text-gray-700">
                                            Active
                                        </span>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                                    >
                                        {processing
                                            ? "Updating..."
                                            : "Update Department"}
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
