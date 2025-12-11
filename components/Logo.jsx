
import React from 'react';

/**
 * Logo component
 * @param {Object} props
 * @param {string} [props.className]
 */
const Logo = ({ className = "" }) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {/* Icon: Syncing Heart */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z" fill="white" fillOpacity="0.2" />
                <path fillRule="evenodd" clipRule="evenodd" d="M11.5 16C11.5 13.5147 13.5147 11.5 16 11.5C18.4853 11.5 20.5 13.5147 20.5 16C20.5 18.4853 18.4853 20.5 16 20.5C13.5147 20.5 11.5 18.4853 11.5 16ZM16 13C14.3431 13 13 14.3431 13 16C13 17.6569 14.3431 19 16 19C17.6569 19 19 17.6569 19 16C19 14.3431 17.6569 13 16 13Z" fill="#14B8A6" />
                <path d="M19 16H23" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" />
                <path d="M9 16H13" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
                <path d="M16 9V13" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" />
                <path d="M16 19V23" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-xl font-bold text-slate-800 tracking-tight">
                Care<span className="text-teal-600">Sync</span>
            </span>
        </div>
    );
};

export default Logo;
