import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function GuestLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-base-200 pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/" className="text-4xl font-extrabold text-primary">
                    COSPLAY STORE
                </Link>
            </div>

            <div className="mt-6 w-full max-w-md px-6 py-4">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
