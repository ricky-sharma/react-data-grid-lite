import { useRef, useCallback } from 'react';

export function useDoubleTap(delay = 200) {
    const lastTapRef = useRef(0);

    const getTouchHandler = useCallback((callback) => {
        return () => {
            const now = Date.now();
            if (now - lastTapRef.current < delay) {
                callback();
            }
            lastTapRef.current = now;
        };
    }, [delay]);

    return { onTouchStart: getTouchHandler };
}
