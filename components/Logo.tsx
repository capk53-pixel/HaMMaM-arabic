import React from 'react';

interface LogoProps {
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
    return (
        <svg
            viewBox="0 0 32 32"
            className={`h-10 w-10 ${className || ''}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="HaMMaM Fit Hup Logo"
        >
            <rect x="10" y="14" width="12" height="4" rx="1.5" fill="#94a3b8"/>
            <rect x="4" y="11" width="6" height="10" rx="2" fill="#2563eb"/>
            <rect x="22" y="11" width="6" height="10" rx="2" fill="#2563eb"/>
            <rect x="2" y="13" width="2" height="6" rx="1" fill="#3b82f6"/>
            <rect x="28" y="13" width="2" height="6" rx="1" fill="#3b82f6"/>
        </svg>
    );
};

export default Logo;