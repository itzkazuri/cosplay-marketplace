'use client';

import { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from '@radix-ui/react-icons';

export default function ThemeSwitcher() {
    const [theme, setTheme] = useState<'cosplay-light' | 'cosplay-dark'>('cosplay-light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'cosplay-light' | 'cosplay-dark' | null;
        const initialTheme = savedTheme || 'cosplay-light';
        setTheme(initialTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'cosplay-light' ? 'cosplay-dark' : 'cosplay-light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <button
            onClick={toggleTheme}
            className="btn btn-square btn-ghost"
            aria-label="Toggle theme"
        >
            {theme === 'cosplay-light' ? (
                <MoonIcon className="h-5 w-5" />
            ) : (
                <SunIcon className="h-5 w-5" />
            )}
        </button>
    );
}
