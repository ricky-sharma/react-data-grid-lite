import { useEffect, useState } from 'react';

/**
 * Hook to track window.innerWidth with debounced resize updates.
 * @param {number} delay - Debounce delay in milliseconds (default: 100ms)
 * @returns {number} - Current window width
 */
export function useWindowWidth(delay = 100) {
    const [width, setWidth] = useState(() => window.innerWidth);

    useEffect(() => {
        let timeout;

        const handleResize = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                setWidth(window.innerWidth);
            }, delay);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            clearTimeout(timeout);
            window.removeEventListener('resize', handleResize);
        };
    }, [delay]);

    return width;
}