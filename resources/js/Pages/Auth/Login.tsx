import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword?: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div role="alert" className="alert alert-success mb-6 text-sm">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>{status}</span>
                </div>
            )}

            <form onSubmit={submit} className="flex flex-col gap-4">
                {/* Email */}
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Email</legend>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        placeholder="you@example.com"
                        className={`input w-full ${errors.email ? "input-error" : ""}`}
                        autoComplete="username"
                        autoFocus
                        onChange={(e) => setData("email", e.target.value)}
                    />
                    {errors.email && (
                        <p className="fieldset-label text-error">
                            {errors.email}
                        </p>
                    )}
                </fieldset>

                {/* Password */}
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">
                        <span>Password</span>
                        {canResetPassword && (
                            <Link
                                href={route("password.request")}
                                className="link link-primary text-xs font-normal ml-auto"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </legend>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        placeholder="••••••••"
                        className={`input w-full ${errors.password ? "input-error" : ""}`}
                        autoComplete="current-password"
                        onChange={(e) => setData("password", e.target.value)}
                    />
                    {errors.password && (
                        <p className="fieldset-label text-error">
                            {errors.password}
                        </p>
                    )}
                </fieldset>

                {/* Remember me */}
                <label className="label gap-2 cursor-pointer justify-start">
                    <input
                        type="checkbox"
                        name="remember"
                        checked={data.remember}
                        className="checkbox checkbox-primary checkbox-sm"
                        onChange={(e) => setData("remember", e.target.checked)}
                    />
                    <span className="label-text text-sm">Remember me</span>
                </label>

                {/* Submit */}
                <button
                    className="btn btn-primary w-full mt-2"
                    disabled={processing}
                >
                    {processing && (
                        <span className="loading loading-spinner loading-xs" />
                    )}
                    Sign in
                </button>

                <div className="divider text-xs text-base-content/40 my-0">
                    or
                </div>

                <p className="text-center text-sm text-base-content/60">
                    Don't have an account?{" "}
                    <Link
                        href={route("register")}
                        className="link link-primary font-medium"
                    >
                        Create one
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}
