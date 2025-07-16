import { useEffect, useState } from 'react';
import { Container_Identifier } from '../constants';

function useContainerWidth() {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const element = document.querySelector(Container_Identifier);
        if (!element) {
            return;
        }
        const resizeObserver = new ResizeObserver(() => {
            setWidth(element.clientWidth);
        });

        resizeObserver.observe(element);
        return () => {
            resizeObserver.unobserve(element);
        };
    }, [Container_Identifier]);

    return width;
}

export default useContainerWidth;
