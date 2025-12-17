import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import { Tree, Input, Button, message } from "antd";

export default function EditRole({ role, permissionsTree, rolePermissions }) {
    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        permissions: rolePermissions,
    });

    const [checkedKeys, setCheckedKeys] = useState(rolePermissions);

    const onCheck = (keys) => {
        setCheckedKeys(keys);
        setData('permissions', keys);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("roles.update", role.id), {
            onSuccess: () => {
                message.success("Role updated successfully!");
            },
            onError: () => {
                message.error("Failed to update role.");
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Role: {role.name}
                </h2>
            }
        >
            <Head title={`Edit Role - ${role.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-semibold">
                                    Edit Role
                                </h2>
                                <Link
                                    href={route("roles.index")}
                                    className="rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-700"
                                >
                                    Back to Roles
                                </Link>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <label
                                        className="mb-2 block text-sm font-bold text-gray-700"
                                        htmlFor="name"
                                    >
                                        Role Name
                                    </label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                        placeholder="Enter role name"
                                        className="max-w-md"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-xs italic text-red-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <label className="mb-2 block text-sm font-bold text-gray-700">
                                        Permissions
                                    </label>
                                    <div className="rounded-md border p-4">
                                        <Tree
                                            checkable
                                            onCheck={onCheck}
                                            checkedKeys={checkedKeys}
                                            treeData={permissionsTree}
                                            defaultExpandAll={true}
                                            className="w-full"
                                        />
                                    </div>
                                    {errors.permissions && (
                                        <p className="mt-1 text-xs italic text-red-500">
                                            {errors.permissions}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={processing}
                                        className="bg-blue-500"
                                    >
                                        {processing ? "Saving..." : "Save Role"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}