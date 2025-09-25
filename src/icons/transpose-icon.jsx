import React from 'react';

export default function TransposeIcon({ height = "24", width = "24" }) {
    return (
        <svg stroke="currentColor"
            strokeWidth="1.5" width={width} height={height}
            viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 7L10 1V5H20V9H10V13L4 7Z" fill="none" />
            <path d="M20 17L14 23V19H4V15H14V11L20 17Z" fill="none" />
        </svg>
    )
};
