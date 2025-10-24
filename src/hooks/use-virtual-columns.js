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
    const [scrollLeftPosition, setScrollLeftPosition] = useState(0);
    const containerWidth = useContainerWidth(config?.state?.gridID);

    const columns = useMemo(
        () => config?.state?.columns?.filter(col => !col?.hidden && !col?.hideable) || [],
        [config?.state?.columns]
    );

    const enableVirtualColumns = config?.state?.enableVirtualColumns;

    useEffect(() => {
        const container = tableRef?.current;
        if (!container) return;

        let animationFrameId = null;
        const raf = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : (cb) => setTimeout(cb, 0);
        const caf = typeof cancelAnimationFrame === 'function' ? cancelAnimationFrame : (id) => clearTimeout(id);

        const handleScroll = () => {
            if (animationFrameId !== null) {
                caf(animationFrameId);
            }

            animationFrameId = raf(() => {
                setScrollLeftPosition(container.scrollLeft < 0 ? container.scrollLeft * -1 : container.scrollLeft);
            });
        };

        container.addEventListener('scroll', handleScroll);

        return () => {
            if (animationFrameId !== null) {
                caf(animationFrameId);
            }
            container.removeEventListener('scroll', handleScroll);
        };
    }, [tableRef]);

    useEffect(() => {
        setTimeout(() => {
            config?.setState?.(prev => ({
                ...prev,
                scrollLeft: scrollLeftPosition
            }));
        }, 0);
    }, [scrollLeftPosition]);

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
                leftBufferWidth: 0,
                rightBufferWidth: 0
            };
        }

        const columnWidths = computedColumnWidthsRef?.current ?? [];
        let currentOffset = 0;
        let start = 0;
        let end = columns.length;

        for (let i = 0; i < columns.length; i++) {
            const width = tryParseValue(columnWidths?.[i]?.width, containerWidth) ?? columnWidth;
            if (currentOffset + width >= scrollLeftPosition - 50) {
                start = Math.max(0, i);
                break;
            }
            currentOffset += width;
        }

        let visibleWidth = 0;
        for (let i = start; i < columns.length; i++) {
            const width = tryParseValue(columnWidths?.[i]?.width, containerWidth) ?? columnWidth;
            visibleWidth += width;
            if (visibleWidth > containerWidth) {
                end = Math.min(columns.length, i + buffer);
                break;
            }
        }

        const visibleCols = columns.slice(start, end);

        let rightBufferOffset = 0;
        for (let i = Math.max(0, end - buffer); i < columns.length; i++) {
            const width = tryParseValue(columnWidths?.[i]?.width, containerWidth) ?? columnWidth;
            rightBufferOffset += width;
        }

        const leftBufferWidth = start > 0 ? currentOffset : 0;
        const rightBufferWidth = end < columns.length ? rightBufferOffset : 0;

        return {
            visibleColumns: visibleCols,
            startIndex: start,
            endIndex: end,
            leftBufferWidth,
            rightBufferWidth
        };
    }, [
        columns,
        scrollLeftPosition,
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
        scrollLeftPosition,
        containerWidth,
        leftBufferWidth,
        rightBufferWidth
    };
}
