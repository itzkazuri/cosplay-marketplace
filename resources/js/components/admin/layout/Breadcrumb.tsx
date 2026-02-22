import { Link, usePage } from '@inertiajs/react';
import { ChevronRight, Home } from 'lucide-react';
import React from 'react';

export default function Breadcrumb() {
    const { url } = usePage();
    const segments = url.split('/').filter(segment => segment !== '');
    
    // Breadcrumbs format: Admin > Segment 1 > Segment 2 ...
    return (
        <nav className="flex items-center space-x-2 text-sm text-base-content/60">
            <Link href="/admin" className="hover:text-primary transition-colors">
                <Home className="w-4 h-4" />
            </Link>
            
            {segments.map((segment, index) => {
                const href = `/${segments.slice(0, index + 1).join('/')}`;
                const isLast = index === segments.length - 1;
                const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
                
                // Don't show "admin" again
                if (segment === 'admin') return null;

                return (
                    <React.Fragment key={href}>
                        <ChevronRight className="w-4 h-4" />
                        {isLast ? (
                            <span className="font-semibold text-base-content">{label}</span>
                        ) : (
                            <Link href={href} className="hover:text-primary transition-colors">
                                {label}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
}
