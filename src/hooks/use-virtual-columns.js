import { useEffect, useMemo, useState } from 'react';
import { tryParseValue } from '../utils/component-utils';
import useContainerWidth from './use-container-width';
import { useGridConfig } from './use-grid-config';
import { Fallback_Column_Width } from '../constants';

const DEFAULT_BUFFER = 2;

export function useVirtualColumns({
    tableRef,
    computedColumnWidthsRef,
    columnWidth = Fallback_Column_Width,
    buffer = DEFAULT_BUFFER
}) {
    const config = useGridConfig();
    const [scrollLeft, setScrollLeft] = useState(0);
    const containerWidth = useContainerWidth(config?.state?.gridID);
    const columns = config?.state?.columns?.filter(col => !col?.hidden && !col?.hideable) || [];
    const enableVirtualColumns = config?.state?.enableVirtualColumns;

    useEffect(() => {
        const container = tableRef?.current;
        if (!container) return;

        let animationFrameId = null;

        const handleScroll = () => {
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
            }

            animationFrameId = requestAnimationFrame(() => {
                setScrollLeft(container.scrollLeft < 0 ? container.scrollLeft * -1 : container.scrollLeft);
            });
        };

        container.addEventListener('scroll', handleScroll);

        return () => {
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
            }
            container.removeEventListener('scroll', handleScroll);
        };
    }, [tableRef]);

    useEffect(() => {
        config?.setState(prev => ({
            ...prev,
            scrollLeft
        }));
    }, [scrollLeft]);

    const {
        visibleColumns,
        startIndex,
        endIndex,
        leftBufferWidth,
        rightBufferWidth
    } = useMemo(() => {
        if (!enableVirtualColumns) {
            return {
                visibleColumns: null,
                startIndex: 0,
                endIndex: 0,
                phantomWidth: 0,
                leftBufferWidth: 0,
                rightBufferWidth: 0
            };
        }

        let currentOffset = 0;
        let start = 0;
        let end = columns.length;
        let endOffset = 0;
        for (let i = 0; i < columns.length; i++) {
            const width = tryParseValue(computedColumnWidthsRef?.current?.[i]?.width, containerWidth) ?? columnWidth;
            if (currentOffset + width >= scrollLeft) {
                start = Math.max(0, i);
                break;
            }
            currentOffset += width;
        }
        let visibleWidth = 0;
        for (let i = start; i < columns.length; i++) {
            const width = tryParseValue(computedColumnWidthsRef?.current?.[i]?.width, containerWidth) ?? columnWidth;
            visibleWidth += width;
            if (visibleWidth > containerWidth) {
                end = Math.min(columns.length, i + buffer);
                break;
            }
        }
        const visibleCols = columns.slice(start, end);

        for (let i = (end - buffer); i <= columns.length; i++) {
            const width = tryParseValue(computedColumnWidthsRef?.current?.[i]?.width, containerWidth) ?? columnWidth;
            endOffset += width;
        }

        const leftBufferWidth = start > 0 ? currentOffset : 0;
        const rightBufferWidth = end < columns.length ? endOffset : 0;

        return {
            visibleColumns: visibleCols,
            startIndex: start,
            endIndex: end,
            leftBufferWidth,
            rightBufferWidth
        };
    }, [
        columns,
        scrollLeft,
        containerWidth,
        computedColumnWidthsRef,
        columnWidth,
        enableVirtualColumns,
        buffer
    ]);
    return {
        visibleColumns,
        startIndex,
        endIndex,
        scrollLeft,
        containerWidth,
        leftBufferWidth,
        rightBufferWidth
    };
}