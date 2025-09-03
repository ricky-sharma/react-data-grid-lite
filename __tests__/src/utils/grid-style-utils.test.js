import {
    Button_Column_Key,
    Button_Column_Width,
    Selection_Column_Key,
    Selection_Column_Width
} from '../../../src/constants';
import {
    getActionColumnStyle,
    getHeaderCellStyles
} from '../../../src/utils/grid-style-utils';

describe('getActionColumnStyle', () => {
    const baseArgs = {
        isActionColumnLeft: false,
        isActionColumnRight: false,
        isSelectionColumnLeft: false,
        isSelectionColumnRight: false,
        isMobile: false,
        enableRtl: false,
        withLightBoxShadow: false
    };

    it('returns correct style for left action button column (LTR)', () => {
        const result = getActionColumnStyle(
            Button_Column_Key,
            true, false, false, false,
            false, false
        );
        expect(result.left).toBe(0);
        expect(result.right).toBe('');
        expect(result.position).toBe('sticky');
        expect(result.zIndex).toBe(10);
        expect(result.backgroundColor).toBe('inherit');
        expect(result.boxShadow).toBe('#e0e0e0 -0.6px 0 0 0 inset');
    });

    it('returns correct style for right selection column (LTR)', () => {
        const result = getActionColumnStyle(
            Selection_Column_Key,
            false, true, false, true,
            false, false
        );
        expect(result.left).toBe('');
        expect(result.right).toBe('99.5px');
        expect(result.boxShadow).toBe('#e0e0e0 0.6px 0 0 0 inset');
    });

    it('returns correct style for RTL action right', () => {
        const result = getActionColumnStyle(
            Button_Column_Key,
            false, true, false, false,
            false, true
        );
        expect(result.left).toBe('-0.5px');
        expect(result.right).toBe('');
        expect(result.boxShadow).toBe('#e0e0e0 -0.6px 0 0 0 inset');
    });

    it('returns light shadow when withLightBoxShadow is true', () => {
        const result = getActionColumnStyle(
            Button_Column_Key,
            true, false, false, false,
            false, false, true
        );
        expect(result.boxShadow).toBe('#e0e0e0 -0.2px 0 0 0 inset');
    });

    it('returns minimal style when isMobile is true', () => {
        const result = getActionColumnStyle(
            Button_Column_Key,
            true, false, false, false,
            true, false
        );
        expect(result.position).toBe('');
        expect(result.zIndex).toBe('');
        expect(result.boxShadow).toBeUndefined();
    });
});

describe('getHeaderCellStyles', () => {
    const computed = [{ name: 'col1', leftPosition: '20px' }];

    it('applies sticky positioning when fixed and LTR', () => {
        const result = getHeaderCellStyles(
            { name: 'col1', fixed: true },
            '100px',
            false,
            false,
            false,
            computed
        );

        expect(result.position).toBe('sticky');
        expect(result.left).toBe('20px');
        expect(result.right).toBe('');
        expect(result.width).toBe('100px');
        expect(result.maxWidth).toBe('100px');
        expect(result.minWidth).toBe('100px');
    });

    it('applies sticky positioning when fixed and RTL', () => {
        const result = getHeaderCellStyles(
            { name: 'col1', fixed: true },
            '100px',
            false,
            true,
            false,
            computed
        );

        expect(result.left).toBe('');
        expect(result.right).toBe('20px');
    });

    it('removes fixed styles when isMobile', () => {
        const result = getHeaderCellStyles(
            { name: 'col1', fixed: true },
            '100px',
            false,
            false,
            true,
            computed
        );

        expect(result.position).toBe('');
        expect(result.left).toBe('');
        expect(result.right).toBe('');
    });

    it('allows override with headerStyle', () => {
        const result = getHeaderCellStyles(
            {
                name: 'col1',
                fixed: true,
                headerStyle: {
                    backgroundColor: 'red',
                    border: '1px solid black'
                }
            },
            '100px',
            false,
            false,
            false,
            computed
        );

        expect(result.backgroundColor).toBe('red');
        expect(result.border).toBe('1px solid black');
    });

    it('applies default max/min width based on resizable flag', () => {
        const result = getHeaderCellStyles(
            { name: 'col1', resizable: false },
            '120px',
            true,
            false,
            false,
            computed
        );

        expect(result.maxWidth).toBe('120px');
        expect(result.minWidth).toBe('120px');
    });
});

describe('getActionColumnStyle - selectionColLeft', () => {
    it('returns Button_Column_Width as left when action and selection columns are left-aligned and not mobile', () => {
        const result = getActionColumnStyle(
            Selection_Column_Key,
            true,
            false,
            true,
            false,
            false,
            false
        );

        expect(result.left).toBe(Button_Column_Width);
        expect(result.position).toBe('sticky');
        expect(result.zIndex).toBe(10);
        expect(result.backgroundColor).toBe('inherit');
    });
});


describe('getActionColumnStyle - selection column presence', () => {
    it('applies styles when isSelectionColumnLeft is true and not mobile', () => {
        const result = getActionColumnStyle(
            Selection_Column_Key,
            false,
            false,
            true,
            false,
            false,
            false
        );

        expect(result.position).toBe('sticky');
        expect(result.zIndex).toBe(10);
        expect(result.backgroundColor).toBe('inherit');
        expect(result.width).toBe(Selection_Column_Width);
    });

    it('applies styles when isSelectionColumnRight is true and not mobile', () => {
        const result = getActionColumnStyle(
            Selection_Column_Key,
            false,
            false,
            false,
            true,
            false,
            false
        );

        expect(result.position).toBe('sticky');
        expect(result.zIndex).toBe(10);
        expect(result.backgroundColor).toBe('inherit');
    });

    it('does not apply sticky styles when both selection columns are false', () => {
        const result = getActionColumnStyle(
            Selection_Column_Key,
            false,
            false,
            false,
            false,
            false,
            false
        );

        expect(result.position).toBe('');
        expect(result.zIndex).toBe('');
        expect(result.backgroundColor).toBe('');
    });
});

describe('getActionColumnStyle - RTL selectionColRight and selectionColLeft logic', () => {
    it('sets left to selectionColRight when RTL and header is Selection_Column_Key', () => {
        const result = getActionColumnStyle(
            Selection_Column_Key,
            false,
            true,
            false,
            true,
            false,
            true
        );

        expect(result.left).toBe('99.5px');
    });

    it('sets right to selectionColLeft when RTL and header is Selection_Column_Key', () => {
        const result = getActionColumnStyle(
            Selection_Column_Key,
            false,
            false,
            true,
            false,
            false,
            true
        );

        expect(result.right).toBe(0);
    });

    it('does not use selectionColRight or selectionColLeft when RTL is false', () => {
        const result = getActionColumnStyle(
            Selection_Column_Key,
            false,
            true,
            false,
            true,
            false,
            false
        );

        expect(result.left).not.toBe('99.5px');
        expect(result.right).not.toBe('50px');
    });
});

describe('getHeaderCellStyles - colResizable logic', () => {
    it('returns undefined for maxWidth and minWidth when column is resizable', () => {
        const header = { name: 'TestCol', resizable: true };
        const width = '100px';

        const result = getHeaderCellStyles(header, width, false, false, false);

        expect(result.maxWidth).toBeUndefined();
        expect(result.minWidth).toBeUndefined();
    });

    it('returns width for maxWidth and minWidth when column is not resizable', () => {
        const header = { name: 'TestCol', resizable: false };
        const width = '100px';

        const result = getHeaderCellStyles(header, width, true, false, false);

        expect(result.maxWidth).toBe(width);
        expect(result.minWidth).toBe(width);
    });

    it('falls back to enableColumnResize when resizable is not explicitly set', () => {
        const header = { name: 'TestCol' };
        const width = '100px';

        const result = getHeaderCellStyles(header, width, true, false, false);

        expect(result.maxWidth).toBeUndefined();
        expect(result.minWidth).toBeUndefined();
    });
});

describe('getHeaderCellStyles - ?? fallback in left/right', () => {
    const width = '100px';
    const headerName = 'TestCol';

    it('returns empty string for left when leftPosition is undefined (LTR)', () => {
        const header = { name: headerName, fixed: true };
        const computedColumnWidths = [];
        const result = getHeaderCellStyles(header, width, false, false, false, computedColumnWidths);

        expect(result.left).toBe('');
    });

    it('returns empty string for right when leftPosition is undefined (RTL)', () => {
        const header = { name: headerName, fixed: true };
        const computedColumnWidths = [];
        const result = getHeaderCellStyles(header, width, false, true, false, computedColumnWidths);

        expect(result.right).toBe('');
    });

    it('returns leftPosition for left when available (LTR)', () => {
        const header = { name: headerName, fixed: true };
        const computedColumnWidths = [
            { name: headerName, leftPosition: '123px' }
        ];
        const result = getHeaderCellStyles(header, width, false, false, false, computedColumnWidths);

        expect(result.left).toBe('123px');
    });

    it('returns leftPosition for right when available (RTL)', () => {
        const header = { name: headerName, fixed: true };
        const computedColumnWidths = [
            { name: headerName, leftPosition: '456px' }
        ];
        const result = getHeaderCellStyles(header, width, false, true, false, computedColumnWidths);

        expect(result.right).toBe('456px');
    });
});