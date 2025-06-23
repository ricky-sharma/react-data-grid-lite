/* eslint-disable no-undef */
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import React, { useRef, useState } from 'react';
import GridHeader from './../../../src/components/grid-header';

describe('GridHeader Component', () => {
    const columnWidths = [null, null];
    const columnWidth = ['100px'];

    afterEach(() => {
        cleanup();
    });

    beforeEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it('renders column headers correctly', () => {
        const columns = [{ name: 'Name' }, { name: 'Age' }];
        const TableComponent = () => {
            const [state] = useState({
                columns: columns,
                columnWidths: columnWidths
            });
            return (<table>
                <GridHeader
                    state={state}
                />
            </table>);
        }
        render(<TableComponent />);
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Age')).toBeInTheDocument();
    });

    it('returns null when columns are null', () => {
        const TableComponent = () => {
            const [state] = useState({
                columns: null
            });
            return (<table>
                <GridHeader
                    state={state}
                />
            </table>);
        }
        const { container } = render(<TableComponent />);
        expect(container.querySelector('thead')).toBeNull();
    });

    it('toggles search row visibility based on enableColumnSearch', () => {
        let columns = [{ name: 'Name', alias: 'Full Name', enableSearch: true, resizable: true, fixed: true }];
        const TableComponent = () => {
            const [state] = useState({
                columns: columns,
                columnWidths: columnWidth,
                enableColumnSearch: true
            });
            return (<table>
                <GridHeader
                    state={state}
                />
            </table>);
        }
        render(<TableComponent />);
        expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
        cleanup();
        columns = [{ name: 'Name', enableSearch: false }, { name: 'Id', hidden: true }];
        const TableComponent2 = () => {
            const [state] = useState({
                columns: columns,
                columnWidths: columnWidths,
                enableColumnSearch: false
            });
            return (<table>
                <GridHeader
                    state={state}
                    onHeaderClicked={null}
                />
            </table>);
        }
        render(<TableComponent2 />);
        expect(screen.queryAllByPlaceholderText('Search')).toHaveLength(0);
    });

    it('calls onSearchClicked when search input changes', () => {
        const onSearchClicked = jest.fn();
        const columns = [{ name: 'Name', enableSearch: true }];
        const TableComponent = () => {
            const ref = useRef(null);
            const [state, setState] = useState({
                columns: columns,
                columnWidths: columnWidth
            });
            return (<table>
                <GridHeader
                    state={state}
                    setState={setState}
                    computedColumnWidthsRef={ref}
                    onSearchClicked={onSearchClicked}
                />
            </table>);
        }
        render(<TableComponent />);
        const input = screen.getByPlaceholderText('Search');
        fireEvent.change(input, { target: { value: 'John' } });
        expect(onSearchClicked).toHaveBeenCalled();
    });

    it('renders action column when editButtonEnabled or deleteButtonEnabled is true', () => {
        cleanup();
        const columns = [{ name: 'Name' }];
        const TableComponent = () => {
            const [state] = useState({
                columns: columns,
                columnWidths: columnWidth,
                editButtonEnabled: true
            });
            return (<table>
                <GridHeader
                    state={state}
                />
            </table>);
        }
        render(<TableComponent />);
        expect(screen.queryByTitle('Actions')).toBeInTheDocument();
        cleanup();
        const TableComponent2 = () => {
            const [state] = useState({
                columns: columns,
                columnWidths: columnWidth,
                deleteButtonEnabled: true
            });
            return (<table>
                <GridHeader
                    state={state}
                />
            </table>);
        }
        render(<TableComponent2 />);
        expect(screen.queryByTitle('Actions')).toBeInTheDocument();
    });

    it('does not render action column when both editButtonEnabled and deleteButtonEnabled are false', () => {
        function TableComponent() {
            const columns = [{ name: 'Name' }];
            const [state] = useState({
                columns: columns,
                columnWidths: columnWidth,
                editButtonEnabled: false,
                deleteButtonEnabled: false
            });
            return (<table>
                <GridHeader
                    state={state}
                />
            </table>);
        }
        render(<TableComponent />);
        expect(screen.queryByTitle('Actions')).not.toBeInTheDocument();
    });

    it('adjusts column widths based on isMobile screen size', () => {
        global.innerWidth = 600;
        global.dispatchEvent(new Event('resize'));
        function TableComponent() {
            const columns = [{ name: 'Name' }];
            const [state] = useState({
                columns: columns,
                columnWidths: columnWidth
            });
            return (<table>
                <GridHeader
                    state={state}
                />
            </table>);
        }
        render(<TableComponent />);
        const headerCell = screen.getByText('Name').closest('th');
        expect(headerCell).toHaveStyle('width: 530px');
    });

    it('calls onHeaderClicked when a header is clicked', () => {
        const onHeaderClicked = jest.fn();
        function TableComponent() {
            const columns = [{ name: 'Name' }];
            const [state] = useState({
                columns: columns,
                columnWidths: columnWidth
            });
            return (<table>
                <GridHeader
                    state={state}
                    onHeaderClicked={onHeaderClicked}
                />
            </table>);
        }
        render(<TableComponent />);
        const header = screen.getByText('Name');
        fireEvent.click(header);
        expect(onHeaderClicked).toHaveBeenCalledWith(expect.any(Object), ['Name'], 'Name');
    });

    it('should not render column CSS classes to header cells', () => {
        function TableComponent() {
            const columns = [{ name: 'Name', class: 'name-column' }];
            const [state] = useState({
                columns: columns,
                columnWidths: columnWidth
            });
            return (<table>
                <GridHeader
                    state={state}
                />
            </table>);
        }

        render(<TableComponent />);
        const header = screen.getByText('Name');
        expect(header.parentElement).not.toHaveClass('name-column');
    });

    it('renders grouped columns based on concatColumns', () => {
        function TableComponent() {
            const columns = [{ name: 'First Name' }, { name: 'Last Name', hidden: true }];
            const concatColumns = [{ cols: ['First Name', 'Last Name'] }];
            const [state] = useState({
                columns: columns,
                concatColumns: concatColumns,
                hiddenColIndex: [null, 1],
                columnWidths: columnWidths,
            });
            return (<table>
                <GridHeader
                    state={state}
                />
            </table>);
        }

        render(<TableComponent />);
        expect(screen.getByText('First Name')).toBeInTheDocument();
        expect(screen.queryByText('Last Name')).not.toBeInTheDocument();
    });
});