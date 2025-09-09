import { useEffect, useState } from 'react';
import { tryParseValue } from '../utils/component-utils';
import { useElementHeight } from './use-element-height';
import { useGridConfig } from './use-grid-config';

const DEFAULT_ROW_HEIGHT = 40;
const DEFAULT_BUFFER = 1;

export function useVirtualRows({
    pageData,
    tableRef,
    rowHeight = DEFAULT_ROW_HEIGHT,
    buffer = DEFAULT_BUFFER
}) {
    const config = useGridConfig();   
    const [scrollTop, setScrollTop] = useState(0);
    const tableHeight = useElementHeight(tableRef)
    const rowHeightFixed = tryParseValue(config?.state?.rowHeight, tableHeight);

    useEffect(() => {
        const container = tableRef?.current;
        if (!container) return;

        let rafId;

        const handleScroll = () => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const newScrollTop = container.scrollTop;
                if (scrollTop !== newScrollTop) {
                    setScrollTop(newScrollTop);
                }
            });
        };

        container.addEventListener('scroll', handleScroll);

        return () => {
            cancelAnimationFrame(rafId);
            container.removeEventListener('scroll', handleScroll);
        };
    }, [tableRef, scrollTop]);

    const totalRows = pageData?.length || 0;
    const startIndex = Math.max(0, Math.floor(scrollTop / (rowHeightFixed || rowHeight)) - buffer);
    const endIndex = Math.min(
        totalRows - 1,
        Math.ceil((scrollTop + tableHeight) / (rowHeightFixed || rowHeight)) + buffer
    );
    const visibleRows = pageData?.slice(startIndex, endIndex + 1) || [];
    const topPaddingHeight = startIndex * (rowHeightFixed || rowHeight);
    const bottomPaddingHeight = (totalRows - endIndex - 1) * (rowHeightFixed || rowHeight);

    return {
        visibleRows,
        startIndex,
        endIndex,
        topPaddingHeight,
        bottomPaddingHeight
    };
}
