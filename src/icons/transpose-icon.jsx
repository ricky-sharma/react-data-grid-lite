import React from 'react';

export default function TransposeIcon({ height = "24", width = "24" }) {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4V1L8 5L12 9V6C15.31 6 18 8.69 18 12C18 13.39 17.56 14.68 16.82 15.74L18.26 17.18C19.36 15.86 20 14 20 12C20 7.58 16.42 4 12 4Z" fill="currentColor" />
            <path d="M6 12C6 10.61 6.44 9.32 7.18 8.26L5.74 6.82C4.64 8.14 4 10 4 12C4 16.42 7.58 20 12 20V23L16 19L12 15V18C8.69 18 6 15.31 6 12Z" fill="currentColor" />
        </svg>
    )
};
