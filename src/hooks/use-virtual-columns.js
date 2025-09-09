import { useEffect, useMemo, useState } from 'react';
import { tryParseValue } from '../utils/component-utils';
import useContainerWidth from './use-container-width';
import { useGridConfig } from './use-grid-config';

const DEFAULT_COLUMN_WIDTH = 100;
const DEFAULT_BUFFER = 2;
const DEFAULT_SCROLL_DELAY = 200;

export function useVirtualColumns({
    tableRef,
    computedColumnWidthsRef,
    columnWidth = DEFAULT_COLUMN_WIDTH,
    buffer = DEFAULT_BUFFER,
    scrollDelay = DEFAULT_SCROLL_DELAY
}) {
    const config = useGridConfig();
    const [scrollLeft, setScrollLeft] = useState(0);
    const containerWidth = useContainerWidth(config?.state?.gridID);
    const columns = config?.state?.columns || [];

    useEffect(() => {
        const container = tableRef?.current;
        if (!container) return;

        let timeoutId = null;

        const handleScroll = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setScrollLeft(container.scrollLeft);
            }, scrollDelay);
        };

        container.addEventListener('scroll', handleScroll);

        return () => {
            clearTimeout(timeoutId);
            container.removeEventListener('scroll', handleScroll);
        };
    }, [tableRef, scrollDelay]);

    const {
        visibleColumns,
        startIndex,
        endIndex,
        phantomWidth,
        leftBufferWidth,
        rightBufferWidth
    } = useMemo(() => {
        let currentOffset = 0;
        let start = 0;
        let end = columns.length;
        for (let i = 0; i < columns.length; i++) {
            const width = tryParseValue(computedColumnWidthsRef?.current?.[i]?.width, containerWidth) ?? columnWidth;
            if (currentOffset + width >= scrollLeft) {
                start = Math.max(0, i - buffer);
                break;
            }
            currentOffset += width;
        }
        let visibleWidth = 0;
        for (let i = start; i < columns.length; i++) {
            const width = tryParseValue(computedColumnWidthsRef?.current?.[i]?.width, containerWidth)  ?? columnWidth;
            visibleWidth += width;
            if (visibleWidth > containerWidth) {
                end = Math.min(columns.length, i + buffer);
                break;
            }
        }
        const visibleCols = columns.slice(start, end);
        const totalWidth = columns.reduce((sum, _, i) => {
            const w = tryParseValue(computedColumnWidthsRef?.current?.[i]?.width, containerWidth) ?? columnWidth;
            return sum + w;
        }, 0);

        const leftBufferWidth = start > 0 ? currentOffset : 0;
        const rightBufferWidth = end < columns.length ? (columns.length - end) * columnWidth : 0;
        const phantomWidth = totalWidth + leftBufferWidth + rightBufferWidth;

        return {
            visibleColumns: visibleCols,
            startIndex: start,
            endIndex: end,
            phantomWidth,
            leftBufferWidth,
            rightBufferWidth
        };
    }, [columns, scrollLeft, containerWidth, computedColumnWidthsRef, buffer, columnWidth]);

    return {
        visibleColumns,
        startIndex,
        endIndex,
        scrollLeft,
        containerWidth,
        phantomWidth,
        leftBufferWidth,
        rightBufferWidth
    };
}