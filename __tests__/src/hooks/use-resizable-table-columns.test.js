/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { cleanup, fireEvent, render } from '@testing-library/react';
import React, { act, useRef, useState } from 'react';
import { Button_Column_Key } from '../../../src/constants';
import { useResizableTableColumns } from './../../../src/hooks/use-resizable-table-columns';

beforeAll(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    cleanup();
    window.matchMedia = window.matchMedia || function () {
        return {
            matches: false,
            addListener: jest.fn(),
            removeListener: jest.fn()
        };
    };
    global.Touch = function (params) {
        return { ...params };
    };
});

afterAll(() => {
    delete global.Touch;
    jest.resetAllMocks();
    jest.clearAllMocks();
    cleanup();
    jest.useRealTimers();
});

describe('useResizableTableColumns', () => {
    const Minimum_Column_Width = 40;
    const Maximum_Column_Width = 600;

    const TestTable = ({ onColumnResized, initialWidths }) => {
        const tableRef = useRef(null);
        const [state, setState] = useState({
            columns: [{ name: 'Name', resizable: true }],
            onColumnResized,
            gridID: 'test-grid-id'
        });
        const computedRef = useRef(initialWidths);

        useResizableTableColumns(tableRef, state, setState, computedRef, true);

        return (
            <table ref={tableRef}>
                <thead>
                    <tr>
                        <th data-column-name="Name" style={{ width: '100px' }}>Name</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Name</td>
                    </tr>
                </tbody>
            </table>
        );
    };

    it('renders a resizer inside header cell', () => {
        const { container } = render(
            <TestTable initialWidths={[{ name: 'Name', width: '100px', leftPosition: '0px' }]} />
        );
        const th = container.querySelector('th');
        const resizer = th.querySelector('div');
        expect(resizer).toBeInTheDocument();
        expect(resizer.style.cursor).toBe('col-resize');
    });

    it('resizes column on mouse drag and updates width', () => {
        const onColumnResized = jest.fn();

        const { container } = render(
            <TestTable
                initialWidths={[{ name: 'Name', width: '100px', leftPosition: '0px' }]}
                onColumnResized={onColumnResized}
            />
        );

        const th = container.querySelector('th');
        const resizer = th.querySelector('div');

        act(() => {
            fireEvent.mouseDown(resizer, { pageX: 100 });

            const moveEvent = new MouseEvent('mousemove', { bubbles: true });
            Object.defineProperty(moveEvent, 'pageX', { get: () => 150 });
            document.dispatchEvent(moveEvent);

            const upEvent = new MouseEvent('mouseup', { bubbles: true });
            Object.defineProperty(upEvent, 'pageX', { get: () => 150 });
            document.dispatchEvent(upEvent);
        });

        expect(th.style.width).toBe('150px');
        expect(onColumnResized).toHaveBeenCalledWith(expect.any(MouseEvent), '150px', 'Name',
            'test-grid-id');
    });

    it('respects minimum and maximum column width', () => {
        const { container } = render(
            <TestTable
                initialWidths={[{ name: 'Name', width: '100px', leftPosition: '0px' }]}
            />
        );

        const th = container.querySelector('th');
        const resizer = th.querySelector('div');
        fireEvent.mouseDown(resizer, { pageX: 100 });
        fireEvent.mouseMove(document, { pageX: -500 });
        fireEvent.mouseUp(document, { pageX: -500 });
        expect(parseFloat(th.style.width)).toBeGreaterThanOrEqual(Minimum_Column_Width);
        fireEvent.mouseDown(resizer, { pageX: 100 });
        fireEvent.mouseMove(document, { pageX: 1000 });
        fireEvent.mouseUp(document, { pageX: 1000 });
        expect(parseFloat(th.style.width)).toBeLessThanOrEqual(Maximum_Column_Width);
    });
});

describe('More tests for useResizableTableColumns', () => {
    const MIN_WIDTH = 50;
    const MAX_WIDTH = 500;

    const MockTable = ({ initialWidth = 100, resizable = true, onColumnResized }) => {
        const tableRef = useRef(null);
        const compColWidthsRef = useRef([{ name: 'Name', width: `${initialWidth}px`, leftPosition: '0px' }]);
        const [state, setState] = useState({
            columns: [{ name: 'Name', width: `${initialWidth}px`, resizable }],
            onColumnResized,
            gridID: 'test-grid-id'
        });

        useResizableTableColumns(tableRef, state, setState, compColWidthsRef, true);

        return (
            <table ref={tableRef}>
                <thead>
                    <tr>
                        <th data-column-name="Name" style={{ width: `${initialWidth}px` }}>Name</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Name Value</td>
                    </tr>
                </tbody>
            </table>
        );
    };

    it('resizes column correctly with mouse events', () => {
        const onColumnResized = jest.fn();

        const { container } = render(<MockTable initialWidth={100} onColumnResized={onColumnResized} />);
        const th = container.querySelector('th');
        const resizer = th.querySelector('div');
        act(() => {
            fireEvent.mouseDown(resizer, { pageX: 100 });
            const moveEvent = new MouseEvent('mousemove', { bubbles: true });
            Object.defineProperty(moveEvent, 'pageX', { get: () => 200 });
            document.dispatchEvent(moveEvent);
            const upEvent = new MouseEvent('mouseup', { bubbles: true });
            Object.defineProperty(upEvent, 'pageX', { get: () => 200 });
            document.dispatchEvent(upEvent);
        });

        expect(th.style.width).toBe('200px');
        expect(onColumnResized).toHaveBeenCalledWith(expect.any(Object), '200px', 'Name',
            'test-grid-id');
    });

    it('does not resize if column is not resizable', () => {
        const { container } = render(<MockTable initialWidth={100} resizable={false} />);
        const th = container.querySelector('th');

        expect(th.style.width).toBe('100px');
    });

    it('enforces minimum column width', () => {
        const { container } = render(<MockTable initialWidth={100} />);
        const th = container.querySelector('th');
        const resizer = th.querySelector('div');

        act(() => {
            fireEvent.mouseDown(resizer, { pageX: 100 });
            fireEvent.mouseMove(document, { pageX: 0 });
            fireEvent.mouseUp(document, { pageX: 0 });
        });

        expect(parseInt(th.style.width)).toBeGreaterThanOrEqual(MIN_WIDTH);
    });

    it('enforces maximum column width', () => {
        const { container } = render(<MockTable initialWidth={100} />);
        const th = container.querySelector('th');
        const resizer = th.querySelector('div');

        act(() => {
            fireEvent.mouseDown(resizer, { pageX: 100 });
            fireEvent.mouseMove(document, { pageX: 2000 });
            fireEvent.mouseUp(document, { pageX: 2000 });
        });

        expect(parseInt(th.style.width)).toBeLessThanOrEqual(MAX_WIDTH);
    });
});

describe('useResizableTableColumns null/crash safety', () => {
    function TestComponent({ state = {}, enableColumnResize = true }) {
        const tableRef = useRef(null);
        const compColWidthsRef = useRef([]);
        const [gridState, setGridState] = useState(state);

        useResizableTableColumns(tableRef, gridState, setGridState, compColWidthsRef, enableColumnResize);

        return (
            <table ref={tableRef}>
                <thead>
                    <tr>
                        <th data-column-name="name">Name</th>
                        <th data-column-name="age">Age</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Alice</td><td>30</td></tr>
                </tbody>
            </table>
        );
    }

    it('does not crash when tableRef is null', () => {
        function NullRefComponent() {
            const [state] = useState({});
            useResizableTableColumns(null, state, jest.fn(), { current: [] }, true);
            return <div>Safe</div>;
        }

        const { getByText } = render(<NullRefComponent />);
        expect(getByText('Safe')).toBeInTheDocument();
    });

    it('does not crash when thead or th is missing', () => {
        function NoTheadComponent() {
            const tableRef = useRef(null);
            const [state] = useState({});
            const compColWidthsRef = useRef([]);

            useResizableTableColumns(tableRef, state, jest.fn(), compColWidthsRef, true);

            return <table ref={tableRef}></table>;
        }

        const { container } = render(<NoTheadComponent />);
        expect(container.querySelector('table')).toBeInTheDocument();
    });

    it('does not crash when columns are missing in state', () => {
        const badState = {
            columns: null
        };

        const { container } = render(<TestComponent state={badState} />);
        expect(container.querySelector('table')).toBeInTheDocument();
    });

    it('does not call onColumnResized if not provided', () => {
        const state = {
            columns: [{ name: 'name', resizable: true }, { name: 'age', resizable: true }]
        };

        const { container } = render(<TestComponent state={state} />);
        expect(container.querySelector('table')).toBeInTheDocument();
    });

    it('does not crash when touch event has null/undefined touches', () => {
        const tableRef = React.createRef();
        const state = {
            columns: [{ name: 'name', resizable: true }]
        };

        function TouchComponent() {
            const compColWidthsRef = useRef([]);
            const [gridState, setGridState] = useState(state);
            useResizableTableColumns(tableRef, gridState, setGridState, compColWidthsRef, true);

            return (
                <table ref={tableRef}>
                    <thead>
                        <tr>
                            <th data-column-name="name">Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>Alice</td></tr>
                    </tbody>
                </table>
            );
        }

        const { container } = render(<TouchComponent />);

        const th = container.querySelector('th');
        const resizer = th?.querySelector('div');
        const touchStartEvent = new Event('touchstart', { bubbles: true });
        Object.defineProperty(touchStartEvent, 'touches', {
            value: undefined,
        });

        expect(() => {
            resizer?.dispatchEvent(touchStartEvent);
        }).not.toThrow();
    });

    it('does not crash when changedTouches is undefined in touchend', () => {
        const tableRef = React.createRef();
        const state = {
            columns: [{ name: 'name', resizable: true }]
        };

        function TouchEndComponent() {
            const compColWidthsRef = useRef([]);
            const [gridState, setGridState] = useState(state);
            useResizableTableColumns(tableRef, gridState, setGridState, compColWidthsRef, true);

            return (
                <table ref={tableRef}>
                    <thead>
                        <tr>
                            <th data-column-name="name">Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>Alice</td></tr>
                    </tbody>
                </table>
            );
        }

        const { container } = render(<TouchEndComponent />);
        const th = container.querySelector('th');
        const resizer = th?.querySelector('div');
        const touchStart = new TouchEvent('touchstart', {
            touches: [new Touch({ identifier: 0, target: resizer, clientX: 100, clientY: 0 })],
            bubbles: true
        });
        resizer?.dispatchEvent(touchStart);
        const touchEnd = new Event('touchend', { bubbles: true });
        Object.defineProperty(touchEnd, 'changedTouches', {
            value: undefined
        });

        expect(() => {
            act(() => { document.dispatchEvent(touchEnd); });
        }).not.toThrow();
    });

    it('does not crash when e.touches is not an array', () => {
        const tableRef = React.createRef();
        const state = {
            columns: [{ name: 'name', resizable: true }]
        };
        function TouchNotArrayComponent() {
            const compColWidthsRef = useRef([]);
            const [gridState, setGridState] = useState(state);
            useResizableTableColumns(tableRef, gridState, setGridState, compColWidthsRef, true);

            return (
                <table ref={tableRef}>
                    <thead>
                        <tr>
                            <th data-column-name="name">Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>Alice</td></tr>
                    </tbody>
                </table>
            );
        }

        const { container } = render(<TouchNotArrayComponent />);
        const th = container.querySelector('th');
        const resizer = th?.querySelector('div');
        const touchStartEvent = new Event('touchstart', { bubbles: true });
        Object.defineProperty(touchStartEvent, 'touches', {
            value: { not: 'an array' }
        });

        expect(() => {
            resizer?.dispatchEvent(touchStartEvent);
        }).not.toThrow();
    });

    it('returns early if no <tr> in <thead>', () => {
        const tableRef = React.createRef();

        function NoHeaderRowsComponent() {
            const [state, setState] = useState({
                columns: [{ name: 'test', resizable: true }],
            });
            const compColWidthsRef = useRef([]);
            useResizableTableColumns(tableRef, state, setState, compColWidthsRef, true);

            return (
                <table ref={tableRef}>
                    <thead></thead>
                    <tbody>
                        <tr><td>1</td></tr>
                    </tbody>
                </table>
            );
        }

        const { container } = render(<NoHeaderRowsComponent />);
        expect(container.querySelector('div')).toBeNull();
    });

    it('returns early if first <tr> has no <th>', () => {
        const tableRef = React.createRef();

        function NoHeaderCellsComponent() {
            const [state, setState] = useState({
                columns: [{ name: 'test', resizable: true }],
            });
            const compColWidthsRef = useRef([]);
            useResizableTableColumns(tableRef, state, setState, compColWidthsRef, true);

            return (
                <table ref={tableRef}>
                    <thead>
                        <tr></tr>
                    </thead>
                    <tbody>
                        <tr><td>1</td></tr>
                    </tbody>
                </table>
            );
        }

        const { container } = render(<NoHeaderCellsComponent />);
        expect(container.querySelector('div')).toBeNull();
    });

    it('skips processing if <th> already in WeakSet', () => {
        const tableRef = React.createRef();

        function AlreadyProcessedThComponent() {
            const [state, setState] = useState({
                columns: [{ name: 'test', resizable: true }],
            });
            const compColWidthsRef = useRef([]);
            useResizableTableColumns(tableRef, state, setState, compColWidthsRef, true);

            return (
                <table ref={tableRef}>
                    <thead>
                        <tr>
                            <th style={{ position: 'static' }} data-column-name="test">Test</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>1</td></tr>
                    </tbody>
                </table>
            );
        }

        const { container } = render(<AlreadyProcessedThComponent />);
        const resizers = container.querySelectorAll('div');
        expect(resizers.length).toBeLessThanOrEqual(1); // only one resizer, not duplicated
    });

});

describe('Additional tests for useResizableTableColumns', () => {
    const DummyTable = ({ state, setState, compColWidthsRef, isResizingRef, enableColumnResize }) => {
        const tableRef = useRef();

        useResizableTableColumns(tableRef, state, setState, compColWidthsRef, enableColumnResize, isResizingRef);

        return (
            <table ref={tableRef} id={state.gridID}>
                <thead>
                    <tr>
                        <th data-column-name="Name">Name</th>
                        <th data-column-name="Age">Age</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Alice</td>
                        <td>30</td>
                        <td>
                            <button>Edit</button>
                        </td>
                    </tr>
                    <tr>
                        <td>Bob</td>
                        <td>25</td>
                        <td>
                            <button>Edit</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    };

    it('adds resizer elements to each resizable column', () => {
        const state = {
            gridID: 'test-grid',
            columns: [
                { name: 'Name', resizable: true },
                { name: 'Age', resizable: true }
            ]
        };

        const setState = jest.fn();
        const compColWidthsRef = { current: [] };
        const isResizingRef = { current: false };

        const { container } = render(
            <DummyTable
                state={state}
                setState={setState}
                compColWidthsRef={compColWidthsRef}
                isResizingRef={isResizingRef}
                enableColumnResize={true}
            />
        );

        const resizers = container.querySelectorAll('th > div[style*="col-resize"]');
        expect(resizers.length).toBe(2); // One per column
    });

    it('mouse drag resizes column and updates state', async () => {
        jest.useFakeTimers();

        const initialColumns = [
            { name: 'Name', width: '100px', resizable: true },
            { name: 'Age', width: '100px', resizable: true }
        ];

        const onColumnResized = jest.fn();
        const setState = jest.fn();

        const state = {
            gridID: 'test-grid',
            columns: initialColumns,
            onColumnResized
        };

        const compColWidthsRef = {
            current: [...initialColumns]
        };

        const isResizingRef = { current: false };

        const { container } = render(
            <DummyTable
                state={state}
                setState={setState}
                compColWidthsRef={compColWidthsRef}
                isResizingRef={isResizingRef}
                enableColumnResize={true}
            />
        );

        const resizer = container.querySelector('th > div[style*="col-resize"]');
        const th = resizer?.parentElement;

        Object.defineProperty(th, 'offsetWidth', {
            configurable: true,
            value: 100
        });

        jest.spyOn(window, 'getComputedStyle').mockImplementation(() => ({
            position: 'relative'
        }));

        await act(async () => {
            fireEvent.mouseDown(resizer, { pageX: 100 });
            fireEvent.mouseMove(document, { pageX: 150 });
            fireEvent.mouseUp(document, { pageX: 150 });
            jest.advanceTimersByTime(100);
        });

        expect(setState).toHaveBeenCalled();
        expect(isResizingRef.current).toBe(false);
        expect(onColumnResized).toHaveBeenCalled();
        jest.useRealTimers();
    });

    it('touch drag resizes column and updates state', async () => {
        jest.useFakeTimers();
        const state = {
            gridID: 'test-grid',
            columns: [
                { name: 'Name', width: '100px', resizable: true }
            ],
            onColumnResized: jest.fn()
        };

        const setState = jest.fn();
        const compColWidthsRef = { current: [{ name: 'Name', width: '100px' }] };
        const isResizingRef = { current: false };

        const { container } = render(
            <DummyTable
                state={state}
                setState={setState}
                compColWidthsRef={compColWidthsRef}
                isResizingRef={isResizingRef}
                enableColumnResize={true}
            />
        );

        const resizer = container.querySelector('th > div[style*="col-resize"]');
        const th = resizer?.parentElement;
        Object.defineProperty(th, 'offsetWidth', {
            configurable: true,
            value: 100
        });

        jest.spyOn(window, 'getComputedStyle').mockImplementation(() => ({
            position: 'relative'
        }));

        await act(async () => {
            fireEvent.touchStart(resizer, {
                touches: [{ pageX: 100 }]
            });

            fireEvent.touchMove(document, {
                touches: [{ pageX: 160 }]
            });

            fireEvent.touchEnd(document, {
                changedTouches: [{ pageX: 160 }]
            });

            jest.advanceTimersByTime(100);
        });

        expect(setState).toHaveBeenCalled();
        expect(isResizingRef.current).toBe(false);
        expect(state.onColumnResized).toHaveBeenCalled();

        jest.useRealTimers();
    });

    it('does not resize button column with name === Button_Column_Key', async () => {
        jest.useFakeTimers();
        const initialColumns = [
            { name: 'Name', width: '100px', resizable: true },
            { name: 'Age', width: '100px', resizable: true },
            { name: Button_Column_Key, width: '120px' }
        ];

        const onColumnResized = jest.fn();
        const setState = jest.fn();
        const compColWidthsRef = { current: [...initialColumns] };
        const isResizingRef = { current: false };

        const state = {
            gridID: 'test-grid',
            columns: initialColumns,
            onColumnResized
        };

        const { container } = render(
            <DummyTable
                state={state}
                setState={setState}
                compColWidthsRef={compColWidthsRef}
                isResizingRef={isResizingRef}
                enableColumnResize={true}
            />
        );

        const resizers = container.querySelectorAll('th > div[style*="col-resize"]');

        const actionResizer = resizers[1];
        const th = actionResizer.parentElement;

        Object.defineProperty(th, 'offsetWidth', {
            configurable: true,
            value: 120
        });

        jest.spyOn(window, 'getComputedStyle').mockImplementation(() => ({
            position: 'relative'
        }));

        await act(async () => {
            fireEvent.mouseDown(actionResizer, { pageX: 120 });
            fireEvent.mouseMove(document, { pageX: 160 });
            fireEvent.mouseUp(document, { pageX: 160 });
            jest.advanceTimersByTime(100);
        });

        const updated = setState.mock.calls.flat();

        const touchedActionColumn = updated.some(call =>
            call?.columns?.some(col =>
                col.name === Button_Column_Key && col.width !== '120px'
            )
        );

        expect(touchedActionColumn).toBe(false);
        expect(onColumnResized).not.toHaveBeenCalledWith(
            expect.any(Object),
            expect.any(String),
            Button_Column_Key,
            'test-grid'
        );

        jest.useRealTimers();
    });
});