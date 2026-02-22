import { Config } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    avatar?: string | null;
    role?: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    image?: string | null;
    type: 'aksesori' | 'custom' | 'ready_stock' | 'wig' | 'props';
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
};
