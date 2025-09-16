/* eslint-disable no-undef */
import { act, render, renderHook } from '@testing-library/react';
import React, { useRef } from 'react';
import useContainerWidth from '../../../src/hooks/use-container-width';
import { useGridConfig } from '../../../src/hooks/use-grid-config';
import { useVirtualColumns } from '../../../src/hooks/use-virtual-columns';
import { tryParseValue } from '../../../src/utils/component-utils';

jest.mock('../../../src/utils/component-utils', () => ({
    tryParseValue: jest.fn()
}));

jest.mock('../../../src/hooks/use-container-width', () => ({
    __esModule: true,
    default: jest.fn()
}));

jest.mock('../../../src/hooks/use-grid-config', () => ({
    useGridConfig: jest.fn()
}));

describe('useVirtualColumns', () => {
    let hookResult;

    const TestComponent = ({ columns = [], scrollLeft = 0, enableVirtualColumns = false }) => {
        const ref = useRef({
            scrollLeft,
            addEventListener: jest.fn(),
            removeEventListener: jest.fn()
        });

        const computedWidths = {
            current: columns.map(() => ({ width: 120 }))
        };

        useGridConfig.mockReturnValue({
            state: {
                enableVirtualColumns,
                columns,
                gridID: 'test-grid'
            }
        });

        useContainerWidth.mockReturnValue(400);

        tryParseValue.mockImplementation((value, fallback) => value ?? fallback);

        hookResult = useVirtualColumns({
            tableRef: ref,
            computedColumnWidthsRef: computedWidths,
            columnWidth: 100,
            buffer: 1
        });

        return <div ref={ref} />;
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('returns default values when virtual columns are disabled', () => {
        render(<TestComponent enableVirtualColumns={false} />);

        expect(hookResult.visibleColumns).toBeNull();
        expect(hookResult.startIndex).toBe(0);
        expect(hookResult.endIndex).toBe(0);
        expect(hookResult.phantomWidth).toBe(0);
        expect(hookResult.leftBufferWidth).toBe(0);
        expect(hookResult.rightBufferWidth).toBe(0);
    });

    it('calculates visibleColumns when virtual columns are enabled', () => {
        const columns = [
            { id: 'col1' },
            { id: 'col2' },
            { id: 'col3' },
            { id: 'col4' },
            { id: 'col5' }
        ];

        render(<TestComponent columns={columns} enableVirtualColumns={true} scrollLeft={0} />);

        expect(hookResult.visibleColumns.length).toBeGreaterThan(0);
        expect(hookResult.startIndex).toBeGreaterThanOrEqual(0);
        expect(hookResult.endIndex).toBeLessThanOrEqual(columns.length);
        expect(hookResult.phantomWidth).toBeGreaterThan(0);
    });

    it('applies fallback columnWidth when tryParseValue returns undefined', () => {
        tryParseValue.mockImplementation(() => undefined);
        const columns = [{ id: 'col1' }, { id: 'col2' }, { id: 'col3' }];

        render(<TestComponent columns={columns} enableVirtualColumns={true} scrollLeft={0} />);

        expect(hookResult.visibleColumns.length).toBeGreaterThan(0);
        expect(hookResult.leftBufferWidth).toBe(0);
    });

    it('handles empty columns array', () => {
        render(<TestComponent columns={[]} enableVirtualColumns={true} scrollLeft={0} />);

        expect(hookResult.visibleColumns).toEqual([]);
        expect(hookResult.startIndex).toBe(0);
        expect(hookResult.endIndex).toBe(0);
        expect(hookResult.phantomWidth).toBe(0);
    });

    it('does not attach scroll event if container is null (covers: if (!container) return)', () => {
        const hookResult = {};
        useContainerWidth.mockReturnValue(300);
        useGridConfig.mockReturnValue({
            state: {
                enableVirtualColumns: true,
                columns: [{ id: 'col1' }, { id: 'col2' }]
            }
        });

        tryParseValue.mockImplementation((val, fallback) => val ?? fallback);

        const TestComponent = () => {
            const ref = useRef(null); // container is null

            Object.assign(hookResult, useVirtualColumns({
                tableRef: ref,
                computedColumnWidthsRef: { current: {} }
            }));

            return null;
        };

        render(<TestComponent />);

        expect(hookResult.scrollLeft).toBe(0);
        expect(hookResult.containerWidth).toBe(300);
        expect(hookResult.startIndex).toBeGreaterThanOrEqual(0);
    });
});

describe('useVirtualColumns - scroll animation frame handling', () => {
    let hookResult;
    let containerMock;
    let addEventListenerSpy;

    beforeEach(() => {
        jest.useFakeTimers();

        containerMock = {
            scrollLeft: 100,
            addEventListener: jest.fn(),
            removeEventListener: jest.fn()
        };

        addEventListenerSpy = containerMock.addEventListener;
        removeEventListenerSpy = containerMock.removeEventListener;

        useGridConfig.mockReturnValue({
            state: {
                enableVirtualColumns: true,
                columns: [
                    { id: 'col1' },
                    { id: 'col2' },
                    { id: 'col3' },
                    { id: 'col4' }
                ],
                gridID: 'grid-test'
            }
        });

        useContainerWidth.mockReturnValue(400);
        tryParseValue.mockImplementation((val, fallback) => val ?? fallback);
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    const TestComponent = () => {
        const ref = useRef(containerMock);
        hookResult = useVirtualColumns({
            tableRef: ref,
            computedColumnWidthsRef: {
                current: [{ width: 120 }, { width: 120 }, { width: 120 }, { width: 120 }]
            },
            columnWidth: 100,
            buffer: 1
        });
        return <div />;
    };

    it('calls cancelAnimationFrame and schedules requestAnimationFrame on scroll', () => {
        const cancelAnimationFrameSpy = jest.spyOn(global, 'cancelAnimationFrame');
        const requestAnimationFrameSpy = jest
            .spyOn(global, 'requestAnimationFrame')
            .mockImplementation(cb => {
                cb();
                return 123;
            });

        render(<TestComponent />);

        const scrollHandler = addEventListenerSpy.mock.calls.find(
            ([event]) => event === 'scroll'
        )[1];

        act(() => {
            scrollHandler();
        });

        expect(cancelAnimationFrameSpy).toHaveBeenCalled();
        expect(requestAnimationFrameSpy).toHaveBeenCalled();
        expect(hookResult.scrollLeft).toBe(100);
    });
});


describe('useVirtualColumns - cancelAnimationFrame', () => {
    let containerMock;
    let hookResult;

    const columns = [
        { id: 'col1' },
        { id: 'col2' },
        { id: 'col3' }
    ];

    beforeEach(() => {
        jest.useFakeTimers();

        global.requestAnimationFrame = jest.fn(cb => {
            cb();
            return 123;
        });

        global.cancelAnimationFrame = jest.fn();

        containerMock = {
            scrollLeft: 100,
            addEventListener: jest.fn(),
            removeEventListener: jest.fn()
        };

        useGridConfig.mockReturnValue({
            state: {
                enableVirtualColumns: true,
                columns,
                gridID: 'test-grid'
            }
        });

        useContainerWidth.mockReturnValue(400);
        tryParseValue.mockImplementation((val, fallback) => val ?? fallback);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
        delete global.cancelAnimationFrame;
        delete global.requestAnimationFrame;
    });

    const TestComponent = () => {
        const ref = useRef(containerMock);
        hookResult = useVirtualColumns({
            tableRef: ref,
            computedColumnWidthsRef: {
                current: [{ width: 120 }, { width: 120 }, { width: 120 }]
            },
            columnWidth: 100,
            buffer: 1
        });

        return <div />;
    };

    it('calls cancelAnimationFrame if animationFrameId is not null', () => {
        render(<TestComponent />);

        const scrollHandler = containerMock.addEventListener.mock.calls.find(
            ([event]) => event === 'scroll'
        )[1];

        act(() => {
            scrollHandler();
        });

        global.requestAnimationFrame.mockReturnValueOnce(456);

        act(() => {
            scrollHandler();
        });

        expect(global.cancelAnimationFrame).toHaveBeenCalledWith(123);
    });
});

describe('useVirtualColumns - default props', () => {
    beforeEach(() => {
        useGridConfig.mockReturnValue({
            state: {
                enableVirtualColumns: true,
                columns: [
                    { id: 'col1' },
                    { id: 'col2' },
                    { id: 'col3' }
                ],
                gridID: 'grid-id'
            }
        });

        useContainerWidth.mockReturnValue(400);

        tryParseValue.mockImplementation((val, fallback) => val ?? fallback);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('uses default values for columnWidth and buffer', () => {
        const TestComponent = () => {
            const ref = useRef({
                scrollLeft: 0,
                addEventListener: jest.fn(),
                removeEventListener: jest.fn()
            });

            useVirtualColumns({
                tableRef: ref,
                computedColumnWidthsRef: {
                    current: {
                        0: { width: undefined },
                        1: { width: undefined },
                        2: { width: undefined }
                    }
                }
            });

            return <div />;
        };

        render(<TestComponent />);
        expect(tryParseValue).toHaveBeenCalledWith(undefined, 400);
        expect(tryParseValue.mock.calls.length).toBeGreaterThanOrEqual(3);
    });
});

describe('useVirtualColumns - ?? columnWidth fallback', () => {
    beforeEach(() => {
        useGridConfig.mockReturnValue({
            state: {
                enableVirtualColumns: true,
                columns: [{ id: 'col1' }, { id: 'col2' }],
                gridID: 'test-grid'
            }
        });

        useContainerWidth.mockReturnValue(400);
        tryParseValue.mockReturnValue(undefined);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('falls back to columnWidth when tryParseValue returns undefined', () => {
        const result = {};

        const TestComponent = () => {
            const ref = useRef({
                scrollLeft: 0,
                addEventListener: jest.fn(),
                removeEventListener: jest.fn()
            });

            Object.assign(
                result,
                useVirtualColumns({
                    tableRef: ref,
                    computedColumnWidthsRef: {
                        current: {
                            0: { width: undefined },
                            1: { width: undefined }
                        }
                    },
                    columnWidth: 123
                })
            );

            return <div />;
        };

        render(<TestComponent />);

        expect(result.phantomWidth).toBeGreaterThanOrEqual(246);

        expect(tryParseValue).toHaveBeenCalled();
        expect(tryParseValue).toHaveBeenCalledWith(undefined, 400);
    });
});

describe('useVirtualColumns - when start > 0', () => {
    beforeEach(() => {
        global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
        global.cancelAnimationFrame = jest.fn();
        jest.clearAllMocks();
    });

    afterEach(() => {
        delete global.requestAnimationFrame;
        delete global.cancelAnimationFrame;
    });

    it('sets leftBufferWidth to currentOffset when start > 0', async () => {
        const result = {};

        useContainerWidth.mockReturnValue(300);

        useGridConfig.mockReturnValue({
            state: {
                enableVirtualColumns: true,
                columns: [
                    { id: 'col1' },
                    { id: 'col2' },
                    { id: 'col3' },
                    { id: 'col4' }
                ]
            }
        });

        tryParseValue.mockImplementation((val, fallback) => val ?? fallback);

        const tableRefMock = {
            scrollLeft: 201,
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
        };

        const ref = { current: tableRefMock };

        const TestComponent = () => {
            Object.assign(result, useVirtualColumns({
                tableRef: ref,
                computedColumnWidthsRef: {
                    current: {
                        0: { width: 100 },
                        1: { width: 100 },
                        2: { width: 100 },
                        3: { width: 100 }
                    }
                },
                columnWidth: 100,
                buffer: 1
            }));

            return null;
        };

        render(<TestComponent />);

        await act(async () => {
            const scrollEvent = new Event('scroll');
            tableRefMock.addEventListener.mock.calls[0][1](scrollEvent);
            await new Promise((r) => setTimeout(r, 10));
        });

        expect(result.startIndex).toBe(1);
        expect(result.leftBufferWidth).toBe(200);
    });
});

describe('useVirtualColumns - fallback to empty array when columns is undefined', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        useContainerWidth.mockReturnValue(400);
        tryParseValue.mockImplementation((val, fallback) => val ?? fallback);

        global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
        global.cancelAnimationFrame = jest.fn();
    });

    afterEach(() => {
        delete global.requestAnimationFrame;
        delete global.cancelAnimationFrame;
    });

    it('should default to empty array if config.state.columns is undefined', () => {
        useGridConfig.mockReturnValue({
            state: {
                enableVirtualColumns: true,
                columns: undefined
            }
        });

        const tableRefMock = {
            scrollLeft: 0,
            addEventListener: jest.fn(),
            removeEventListener: jest.fn()
        };

        const ref = { current: tableRefMock };

        const { result } = renderHook(() =>
            useVirtualColumns({
                tableRef: ref,
                computedColumnWidthsRef: { current: {} }
            })
        );

        expect(result.current.visibleColumns).toEqual([]);
        expect(result.current.startIndex).toBe(0);
        expect(result.current.endIndex).toBe(0);
    });
});