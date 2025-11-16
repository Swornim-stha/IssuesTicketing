import { useForm } from "@inertiajs/react";
import { useState } from "react";

export default function CreateUserForm({
    roles,
    departments,
    onSuccess,
    onCancel,
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
        department_id: "",
    });

    const [passwordVisible, setPasswordVisible] = useState(false);

    const generatePassword = () => {
        const length = 12;
        const charset =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
        let retVal = "";
        for (let i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    };

    const handleGeneratePassword = () => {
        const newPassword = generatePassword();
        setData((prevData) => ({
            ...prevData,
            password: newPassword,
            password_confirmation: newPassword,
        }));
    };

    const handleCopyPassword = () => {
        navigator.clipboard.writeText(data.password);
        alert("Password copied to clipboard!");
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("users.store"), {
            onSuccess: () => {
                reset();
                onSuccess();
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="p-6">
            <h2 className="text-lg font-medium text-gray-900">
                Create New User
            </h2>

            <div className="mt-6">
                <label htmlFor="name">Name</label>
                <input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    className="mt-1 block w-full"
                    required
                />
                {errors.name && (
                    <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                )}
            </div>

            <div className="mt-4">
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    className="mt-1 block w-full"
                    required
                />
                {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
            </div>

            <div className="mt-4">
                <label htmlFor="password">Password</label>
                <div className="relative mt-1">
                    <input
                        id="password"
                        type={passwordVisible ? "text" : "password"}
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        className="mt-1 block w-full"
                        required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <button
                            type="button"
                            onClick={handleGeneratePassword}
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            Generate
                        </button>
                        <button
                            type="button"
                            onClick={handleCopyPassword}
                            className="ml-2 text-sm text-gray-600 hover:text-gray-900"
                        >
                            Copy
                        </button>
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="ml-2 text-sm text-gray-600 hover:text-gray-900"
                        >
                            {passwordVisible ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>
                {errors.password && (
                    <p className="mt-2 text-sm text-red-600">
                        {errors.password}
                    </p>
                )}
            </div>

            <div className="mt-4">
                <label htmlFor="password_confirmation">Confirm Password</label>
                <input
                    id="password_confirmation"
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) =>
                        setData("password_confirmation", e.target.value)
                    }
                    className="mt-1 block w-full"
                    required
                />
            </div>

            <div className="mt-4">
                <label htmlFor="role">Role</label>
                <select
                    id="role"
                    value={data.role}
                    onChange={(e) => setData("role", e.target.value)}
                    className="mt-1 block w-full"
                    required
                >
                    <option value="">Select a role</option>
                    {roles.map((role) => (
                        <option key={role.id} value={role.name}>
                            {role.name}
                        </option>
                    ))}
                </select>
                {errors.role && (
                    <p className="mt-2 text-sm text-red-600">{errors.role}</p>
                )}
            </div>

            <div className="mt-4">
                <label htmlFor="department_id">Department</label>
                <select
                    id="department_id"
                    value={data.department_id}
                    onChange={(e) => setData("department_id", e.target.value)}
                    className="mt-1 block w-full"
                >
                    <option value="">Select a department</option>
                    {departments.map((department) => (
                        <option key={department.id} value={department.id}>
                            {department.name}
                        </option>
                    ))}
                </select>
                {errors.department_id && (
                    <p className="mt-2 text-sm text-red-600">
                        {errors.department_id}
                    </p>
                )}
            </div>

            <div className="mt-6 flex justify-end">
                <button type="button" onClick={onCancel} className="mr-4">
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    Create User
                </button>
            </div>
        </form>
    );
}
