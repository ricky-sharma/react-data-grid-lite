import { useEffect, useState } from 'react';
import { Container_Identifier } from '../constants';

function useContainerWidth(gridID) {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const element = document.querySelector(`#${gridID} ${Container_Identifier}`);
        if (!element) {
            return;
        }
        if (typeof ResizeObserver !== 'undefined') {
            const resizeObserver = new ResizeObserver(() => {
                setWidth(element.clientWidth);
            });

            resizeObserver.observe(element);
            return () => {
                resizeObserver.unobserve(element);
            };
        }
    }, [Container_Identifier]);

    return width;
}

export default useContainerWidth;
