import { useState, useEffect } from 'react';

export function useElementHeight(ref) {
    const [height, setHeight] = useState(0);

    useEffect(() => {
        const element = ref?.current;
        if (!element) return;

        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.target === element) {
                    setHeight(entry.contentRect.height);
                }
            }
        });

        observer.observe(element);

        return () => observer.disconnect();
    }, [ref?.current]);

    return height;
}
