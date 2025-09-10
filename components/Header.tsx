
import React from 'react';
import { LogoIcon } from './Icons';

export const Header: React.FC = () => {
    return (
        <header className="flex items-center gap-4 mb-8">
            <LogoIcon />
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">See My Plan</h1>
                <p className="text-gray-400">Bring your architectural plans to life with AI-powered visualization.</p>
            </div>
        </header>
    );
};
