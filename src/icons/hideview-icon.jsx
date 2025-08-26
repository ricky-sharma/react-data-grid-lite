import React from 'react';
export default function HideViewIcon({ height = "24", width = "24" }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
            strokeWidth="1.5" width={width} height={height}>
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 3l18 18M10.584 10.587A2 2 0 0112 10a2 2 0 012 2m-3.416-1.413L9 8m6 6l1.586 1.586M9.879 9.879l4.243 4.243M21 12s-3.6 6-9 6a8.985 8.985 0 01-5.874-2.25M3 12s3.6-6 9-6c1.392 0 2.686.364 3.811.997" />
        </svg>
    );
}