import { useTableCellNavigation } from '../../../src/hooks/use-table-cell-navigation';

describe('useTableCellNavigation', () => {
    let onKeyDown;

    const mockOnCellEdit = jest.fn();
    const columns = [
        { name: 'col1', displayIndex: 0 },
        { name: 'col2', displayIndex: 1 },
        { name: 'col3', displayIndex: 2, hidden: true },
        { name: 'col4', displayIndex: 3 },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        onKeyDown = useTableCellNavigation();
    });

    function createEvent(key) {
        return {
            key,
            preventDefault: jest.fn(),
        };
    }

    function setupDom() {
        document.body.innerHTML = `
      <div data-row-index="0" data-col-name="col1" tabindex="0"></div>
      <div data-row-index="1" data-col-name="col1" tabindex="0"></div>
      <div data-row-index="0" data-col-name="col2" tabindex="0"></div>
      <div data-row-index="0" data-col-name="col4" tabindex="0"></div>
    `;
    }

    it('returns immediately if not editable', () => {
        const e = createEvent('Enter');
        onKeyDown(e, { editable: false });
        expect(e.preventDefault).not.toHaveBeenCalled();
        expect(mockOnCellEdit).not.toHaveBeenCalled();
    });

    it('returns immediately if cell is already editing', () => {
        const e = createEvent('Enter');
        onKeyDown(e, {
            editable: true,
            editingCell: { rowIndex: 1, columnName: 'col1' },
            rowIndex: 1,
            col: { name: 'col1' },
        });
        expect(e.preventDefault).not.toHaveBeenCalled();
    });

    describe('Enter key behavior', () => {
        it('does nothing if active element is interactive', () => {
            const e = createEvent('Enter');
            Object.defineProperty(document, 'activeElement', {
                value: { tagName: 'INPUT' },
                configurable: true,
            });

            onKeyDown(e, {
                editable: true,
                editingCell: null,
                rowIndex: 0,
                col: { name: 'col1' },
                onCellEdit: mockOnCellEdit,
            });

            expect(e.preventDefault).not.toHaveBeenCalled();
            expect(mockOnCellEdit).not.toHaveBeenCalled();
        });

        it('calls onCellEdit when Enter is pressed and active element is not interactive', () => {
            const e = createEvent('Enter');

            Object.defineProperty(document, 'activeElement', {
                value: { tagName: 'DIV' },
                configurable: true,
            });

            onKeyDown(e, {
                editable: true,
                editingCell: null,
                rowIndex: 0,
                col: { name: 'col1' },
                onCellEdit: mockOnCellEdit,
                baseRowIndex:0
            });

            expect(e.preventDefault).toHaveBeenCalled();
            expect(mockOnCellEdit).toHaveBeenCalledWith('col1', 0, 0);
        });
    });

    describe('Arrow keys behavior', () => {
        beforeEach(() => {
            setupDom();
        });

        it('ArrowDown focuses cell below', () => {
            const e = createEvent('ArrowDown');
            const focusMock = jest.fn();
            const nextCell = document.querySelector('[data-row-index="1"][data-col-name="col1"]');
            nextCell.focus = focusMock;

            onKeyDown(e, {
                editable: true,
                rowIndex: 0,
                col: { name: 'col1' },
            });

            expect(e.preventDefault).toHaveBeenCalled();
            expect(focusMock).toHaveBeenCalled();
        });

        it('ArrowUp focuses cell above', () => {
            const e = createEvent('ArrowUp');
            const focusMock = jest.fn();
            const prevCell = document.querySelector('[data-row-index="-1"][data-col-name="col1"]');
            if (prevCell) prevCell.focus = focusMock;
            onKeyDown(e, {
                editable: true,
                rowIndex: 0,
                col: { name: 'col1' },
            });

            expect(e.preventDefault).toHaveBeenCalled();
            expect(focusMock).not.toHaveBeenCalled();
        });

        it('ArrowRight focuses next visible column', () => {
            const e = createEvent('ArrowRight');
            const focusMock = jest.fn();
            const nextCell = document.querySelector('[data-row-index="0"][data-col-name="col2"]');
            nextCell.focus = focusMock;

            onKeyDown(e, {
                editable: true,
                rowIndex: 0,
                col: { name: 'col1' },
                columns,
            });

            expect(e.preventDefault).toHaveBeenCalled();
            expect(focusMock).toHaveBeenCalled();
        });

        it('ArrowRight skips hidden columns', () => {
            const e = createEvent('ArrowRight');
            const focusMock = jest.fn();
            const nextCell = document.querySelector('[data-row-index="0"][data-col-name="col4"]');
            nextCell.focus = focusMock;

            onKeyDown(e, {
                editable: true,
                rowIndex: 0,
                col: { name: 'col2' },
                columns,
            });

            expect(e.preventDefault).toHaveBeenCalled();
            expect(focusMock).toHaveBeenCalled();
        });

        it('ArrowLeft focuses previous visible column', () => {
            const e = createEvent('ArrowLeft');
            const focusMock = jest.fn();
            const prevCell = document.querySelector('[data-row-index="0"][data-col-name="col2"]');
            prevCell.focus = focusMock;

            onKeyDown(e, {
                editable: true,
                rowIndex: 0,
                col: { name: 'col4' },
                columns,
            });

            expect(e.preventDefault).toHaveBeenCalled();
            expect(focusMock).toHaveBeenCalled();
        });
    });

    it('does nothing for other keys', () => {
        const e = createEvent('Escape');
        onKeyDown(e, {
            editable: true,
            rowIndex: 0,
            col: { name: 'col1' },
        });
        expect(e.preventDefault).not.toHaveBeenCalled();
    });

    it('does not set nextSelector if no next column with name exists (ArrowRight)', () => {
        const e = {
            key: 'ArrowRight',
            preventDefault: jest.fn(),
        };

        const columns = [
            { name: 'col1', displayIndex: 0 },
            { name: 'col2', displayIndex: 1, hidden: true }, // hidden
            { name: 'col3', displayIndex: 2, hidden: true }, // hidden
        ];

        const props = {
            editable: true,
            rowIndex: 0,
            col: { name: 'col1' },
            columns,
        };

        onKeyDown(e, props);
        expect(e.preventDefault).toHaveBeenCalled();
    });

    it('does not set nextSelector if no previous column with name exists (ArrowLeft)', () => {
        const e = {
            key: 'ArrowLeft',
            preventDefault: jest.fn(),
        };
        const columns = [
            { name: 'col1', displayIndex: 0 },
            { name: 'col2', displayIndex: 1, hidden: true },
            { name: 'col3', displayIndex: 2 },
        ];

        const props = {
            editable: true,
            rowIndex: 0,
            col: { name: 'col1' },
            columns,
        };

        onKeyDown(e, props);
        expect(e.preventDefault).toHaveBeenCalled();
    });
});