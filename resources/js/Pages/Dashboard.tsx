import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth }: { auth: any }) {
    return (
        <div className="min-h-screen bg-base-200 p-8">
            <Head title="Dashboard" />

            <div className="mx-auto max-w-4xl">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-2xl font-bold">Welcome, {auth.user.name}!</h2>
                        <p className="py-4">You're logged in as a {auth.user.role}.</p>
                        
                        <div className="card-actions justify-end">
                            <Link href="/" className="btn btn-ghost">Home</Link>
                            <Link 
                                href={route('logout')} 
                                method="post" 
                                as="button" 
                                className="btn btn-error"
                            >
                                Logout
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
