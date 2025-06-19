import { render } from '@testing-library/react';
import React from 'react';
import ColumnSortIcon from './../../../src/components/column-sort-icon';

describe('ColumnSortIcon Component', () => {
    it('renders with default inactive sort icon when no sortOrder is provided', () => {
        const columns = [{ name: 'Name' }];
        const header = { name: 'Name' };
        const { container } = render(<ColumnSortIcon columns={columns} header={header} />);
        const icon = container.querySelector('.updown-icon');
        expect(icon).toHaveClass('inactive', 'icon-sort');
    });

    it('renders ascending sort icon when sortOrder is "asc"', () => {
        const columns = [{ name: 'Age', sortOrder: 'asc' }];
        const header = { name: 'Age' };
        const { container } = render(<ColumnSortIcon columns={columns} header={header} />);
        const icon = container.querySelector('.updown-icon');
        expect(icon).toHaveClass('icon-sort-up');
    });

    it('renders descending sort icon when sortOrder is "desc"', () => {
        const columns = [{ name: 'Age', sortOrder: 'desc' }];
        const header = { name: 'Age' };
        const { container } = render(<ColumnSortIcon columns={columns} header={header} />);
        const icon = container.querySelector('.updown-icon');
        expect(icon).toHaveClass('icon-sort-down');
    });

    it('renders inactive sort icon when column not found', () => {
        const columns = [{ name: 'Age', sortOrder: 'asc' }];
        const header = { name: 'Name' };
        const { container } = render(<ColumnSortIcon columns={columns} header={header} />);
        const icon = container.querySelector('.updown-icon');
        expect(icon).toHaveClass('inactive', 'icon-sort');
    });

    it('handles empty columns array safely', () => {
        const { container } = render(<ColumnSortIcon columns={[]} header={{ name: 'Test' }} />);
        const icon = container.querySelector('.updown-icon');
        expect(icon).toHaveClass('inactive', 'icon-sort');
    });

    it('handles missing columns prop gracefully', () => {
        const { container } = render(<ColumnSortIcon header={{ name: 'Test' }} />);
        const icon = container.querySelector('.updown-icon');
        expect(icon).toHaveClass('inactive', 'icon-sort');
    });
});
