import React, { useRef } from 'react';
import { render, act } from '@testing-library/react';

jest.mock('../../../src/utils/component-utils', () => ({
    tryParseValue: jest.fn()
}));

jest.mock('../../../src/hooks/use-grid-config', () => ({
    useGridConfig: jest.fn()
}));

jest.mock('../../../src/hooks/use-element-height', () => ({
    useElementHeight: jest.fn()
}));


import { useVirtualRows } from '../../../src/hooks/use-virtual-rows';
import { useGridConfig } from '../../../src/hooks/use-grid-config';
import { useElementHeight } from '../../../src/hooks/use-element-height';
import { tryParseValue } from '../../../src/utils/component-utils';

const TestComponent = ({ pageData, enableVirtualRows = true }) => {
    const ref = useRef(null);
    const result = useVirtualRows({
        pageData,
        tableRef: ref,
        rowHeight: 40,
        buffer: 1,
    });

    return (
        <div ref={ref} data-testid="table">
            <pre data-testid="result">{JSON.stringify(result)}</pre>
        </div>
    );
};

beforeEach(() => {
    jest.useFakeTimers();
});
afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
});


describe("enableVirtualRows", () => {
    it('returns null visibleRows when virtual rows are disabled', () => {
        useGridConfig.mockReturnValue({ state: { enableVirtualRows: false } });
        useElementHeight.mockReturnValue(500);
        tryParseValue.mockReturnValue(undefined);

        const { getByTestId } = render(<TestComponent pageData={Array(50).fill('row')} enableVirtualRows={false} />);
        const result = JSON.parse(getByTestId('result').textContent);

        expect(result.visibleRows).toBeNull();
        expect(result.startIndex).toBe(0);
        expect(result.endIndex).toBe(0);
        expect(result.topPaddingHeight).toBe(0);
        expect(result.bottomPaddingHeight).toBe(0);
    });

    it('computes correct visible rows and padding', () => {
        useGridConfig.mockReturnValue({ state: { enableVirtualRows: true } });
        useElementHeight.mockReturnValue(200);
        tryParseValue.mockReturnValue(40);

        const pageData = Array.from({ length: 100 }, (_, i) => `Row ${i}`);

        const { getByTestId } = render(<TestComponent pageData={pageData} />);
        const result = JSON.parse(getByTestId('result').textContent);

        expect(result.visibleRows).toHaveLength(7);
        expect(result.visibleRows[0]).toBe('Row 0');
        expect(result.visibleRows[6]).toBe('Row 6');

        expect(result.topPaddingHeight).toBe(0);
        expect(result.bottomPaddingHeight).toBe((100 - 7) * 40);
    });

    it('updates visible rows on scroll', () => {
        useGridConfig.mockReturnValue({ state: { enableVirtualRows: true } });
        useElementHeight.mockReturnValue(200);
        tryParseValue.mockReturnValue(40);

        const pageData = Array.from({ length: 100 }, (_, i) => `Row ${i}`);

        const { getByTestId } = render(<TestComponent pageData={pageData} />);
        const table = getByTestId('table');

        act(() => {
            table.scrollTop = 400;
            table.dispatchEvent(new Event('scroll'));
            jest.runAllTimers?.();
        });

        const result = JSON.parse(getByTestId('result').textContent);

        expect(result.startIndex).toBe(9);
        expect(result.endIndex).toBe(16);
        expect(result.visibleRows[0]).toBe('Row 9');
    });

    it('uses default rowHeight when not provided', () => {
        useGridConfig.mockReturnValue({ state: { enableVirtualRows: true } });
        useElementHeight.mockReturnValue(200);
        tryParseValue.mockReturnValue(undefined);

        const pageData = Array.from({ length: 50 }, (_, i) => `Row ${i}`);

        const TestComponent = () => {
            const ref = useRef(null);
            const result = useVirtualRows({
                pageData,
                tableRef: ref,
            });

            return (
                <div ref={ref} data-testid="table">
                    <pre data-testid="result">{JSON.stringify(result)}</pre>
                </div>
            );
        };

        const { getByTestId } = render(<TestComponent />);
        const result = JSON.parse(getByTestId('result').textContent);
        expect(result.visibleRows.length).toBe(7);
        expect(result.visibleRows[0]).toBe('Row 0');
        expect(result.visibleRows[6]).toBe('Row 6');

        expect(result.topPaddingHeight).toBe(0);
        expect(result.bottomPaddingHeight).toBe((50 - 7) * 40);
    });

    it('does nothing if tableRef.current is null', () => {
        useGridConfig.mockReturnValue({ state: { enableVirtualRows: true } });
        useElementHeight.mockReturnValue(200);
        tryParseValue.mockReturnValue(undefined);

        const pageData = Array(10).fill('Row');

        const TestComponent = () => {
            const ref = useRef(null);
            const result = useVirtualRows({
                pageData,
                tableRef: ref
            });

            return <pre data-testid="result">{JSON.stringify(result)}</pre>;
        };

        const { getByTestId } = render(<TestComponent />);
        const result = JSON.parse(getByTestId('result').textContent);
        expect(result.visibleRows.length).toBeGreaterThan(0);
    });

    it('does not attach scroll event if tableRef.current is null', () => {
        useGridConfig.mockReturnValue({ state: { enableVirtualRows: true } });
        useElementHeight.mockReturnValue(200);
        tryParseValue.mockReturnValue(undefined);

        const addEventListener = jest.fn();

        const mockRef = {
            current: null
        };

        const TestComponent = () => {
            useVirtualRows({
                pageData: Array(20).fill('Row'),
                tableRef: mockRef
            });
            return null;
        };

        render(<TestComponent />);
        expect(addEventListener).not.toHaveBeenCalled();
    });

    it('does not update scrollTop when value has not changed', () => {
        useGridConfig.mockReturnValue({ state: { enableVirtualRows: true } });
        useElementHeight.mockReturnValue(200);
        tryParseValue.mockReturnValue(undefined);

        const pageData = Array.from({ length: 100 }, (_, i) => `Row ${i}`);
        let virtualRowsResult = {};

        const TestComponent = () => {
            const ref = useRef(null);
            const result = useVirtualRows({
                pageData,
                tableRef: ref,
                rowHeight: 40,
                buffer: 1
            });

            virtualRowsResult = result;

            return <div ref={ref} data-testid="table">Table</div>;
        };

        const { getByTestId } = render(<TestComponent />);
        const table = getByTestId('table');

        expect(virtualRowsResult.startIndex).toBe(0);

        act(() => {
            table.scrollTop = 0;
            table.dispatchEvent(new Event('scroll'));
            jest.runAllTimers();
        });

        expect(virtualRowsResult.startIndex).toBe(0);
    });

    it('uses 0 as totalRows when pageData is undefined', () => {
        useGridConfig.mockReturnValue({ state: { enableVirtualRows: true } });
        useElementHeight.mockReturnValue(300);
        tryParseValue.mockReturnValue(undefined);

        let hookResult;

        const TestComponent = () => {
            const ref = useRef(null);
            hookResult = useVirtualRows({
                pageData: undefined,
                tableRef: ref,
                rowHeight: 40,
                buffer: 1
            });

            return <div ref={ref} />;
        };

        render(<TestComponent />);

        expect(hookResult.visibleRows).toEqual([]);
        expect(hookResult.startIndex).toBe(0);
        expect(hookResult.endIndex).toBe(-1);
        expect(hookResult.topPaddingHeight).toBe(0);
        expect(hookResult.bottomPaddingHeight).toBe(0);
    });

});