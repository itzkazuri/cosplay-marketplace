import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        password_confirmation: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit} className="flex flex-col gap-4">
                {/* Full Name */}
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Full Name</legend>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={data.name}
                        placeholder="John Doe"
                        className={`input w-full ${errors.name ? "input-error" : ""}`}
                        autoComplete="name"
                        autoFocus
                        required
                        onChange={(e) => setData("name", e.target.value)}
                    />
                    {errors.name && (
                        <p className="fieldset-label text-error">
                            {errors.name}
                        </p>
                    )}
                </fieldset>

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
                        required
                        onChange={(e) => setData("email", e.target.value)}
                    />
                    {errors.email && (
                        <p className="fieldset-label text-error">
                            {errors.email}
                        </p>
                    )}
                </fieldset>

                {/* Phone (optional) */}
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">
                        Phone Number
                        <span className="text-base-content/40 font-normal text-xs ml-1">
                            (optional)
                        </span>
                    </legend>
                    <input
                        id="phone"
                        type="text"
                        name="phone"
                        value={data.phone}
                        placeholder="+62 8xx xxxx xxxx"
                        className={`input w-full ${errors.phone ? "input-error" : ""}`}
                        autoComplete="tel"
                        onChange={(e) => setData("phone", e.target.value)}
                    />
                    {errors.phone && (
                        <p className="fieldset-label text-error">
                            {errors.phone}
                        </p>
                    )}
                </fieldset>

                <div className="divider my-0" />

                {/* Password */}
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Password</legend>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        placeholder="••••••••"
                        className={`input w-full ${errors.password ? "input-error" : ""}`}
                        autoComplete="new-password"
                        required
                        onChange={(e) => setData("password", e.target.value)}
                    />
                    {errors.password ? (
                        <p className="fieldset-label text-error">
                            {errors.password}
                        </p>
                    ) : (
                        <p className="fieldset-label">Minimum 8 characters</p>
                    )}
                </fieldset>

                {/* Confirm Password */}
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">
                        Confirm Password
                    </legend>
                    <input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        placeholder="••••••••"
                        className={`input w-full ${errors.password_confirmation ? "input-error" : ""}`}
                        autoComplete="new-password"
                        required
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                    />
                    {errors.password_confirmation && (
                        <p className="fieldset-label text-error">
                            {errors.password_confirmation}
                        </p>
                    )}
                </fieldset>

                {/* Submit */}
                <button
                    className="btn btn-primary w-full mt-2"
                    disabled={processing}
                >
                    {processing && (
                        <span className="loading loading-spinner loading-xs" />
                    )}
                    Create Account
                </button>

                <p className="text-center text-sm text-base-content/60">
                    Already have an account?{" "}
                    <Link
                        href={route("login")}
                        className="link link-primary font-medium"
                    >
                        Sign in
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}
