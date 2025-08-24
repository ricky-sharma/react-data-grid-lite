import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import Menu from '../../../../src/components/custom-fields/menu';

describe('Menu component', () => {
    const mockAction = jest.fn();
    const subAction = jest.fn();

    const items = [
        {
            name: 'Action 1',
            tooltip: 'Action 1 Tooltip',
            icon: <span>A1</span>,
            action: mockAction,
            args: ['arg1']
        },
        {
            name: 'Has SubMenu',
            tooltip: 'Has submenu',
            icon: <span>SM</span>,
            subItems: [
                {
                    name: 'Sub Action',
                    icon: <span>SA</span>,
                    action: subAction,
                    args: ['subArg1']
                }
            ]
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('renders menu button', () => {
        render(<Menu items={items} />);
        expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument();
    });

    it('opens menu on button click', () => {
        render(<Menu items={items} />);
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByText('Action 1')).toBeInTheDocument();
        expect(screen.getByText('Has SubMenu')).toBeInTheDocument();
    });

    it('calls item action with args and event', () => {
        render(<Menu items={items} />);
        fireEvent.click(screen.getByRole('button'));

        fireEvent.click(screen.getByText('Action 1'));

        expect(mockAction).toHaveBeenCalledWith('arg1', expect.any(Object));
    });

    it('opens submenu on hover and triggers sub item action', () => {
        render(<Menu items={items} />);
        fireEvent.click(screen.getByRole('button'));

        const parentItem = screen.getByText('Has SubMenu');
        fireEvent.mouseEnter(parentItem);

        const subItem = screen.getByText('Sub Action');
        expect(subItem).toBeInTheDocument();

        fireEvent.click(subItem);

        expect(subAction).toHaveBeenCalledWith('subArg1', expect.any(Object));
    });

    it('closes menu on outside click', () => {
        render(
            <div>
                <Menu items={items} />
                <div data-testid="outside">Outside</div>
            </div>
        );
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByText('Action 1')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('outside'));

        expect(screen.queryByText('Action 1')).not.toBeInTheDocument();
    });

    it('keyboard navigation: ArrowDown and Enter', () => {
        const mockAction = jest.fn();

        const items = [
            {
                name: 'Action 1',
                tooltip: 'Tooltip',
                icon: <span>A1</span>,
                action: mockAction,
                args: ['arg1'],
            },
            {
                name: 'Action 2',
                tooltip: 'Tooltip2',
                icon: <span>A2</span>,
                action: mockAction,
                args: ['arg1'],
            },
        ];

        render(<Menu items={items} />);
        const button = screen.getByRole('button');
        fireEvent.keyDown(button, { key: 'Enter' });
        fireEvent.keyDown(document, { key: 'ArrowDown' });
        fireEvent.keyDown(document, { key: 'Enter' });
        expect(mockAction).toHaveBeenCalledWith('arg1', expect.any(Object));
    });

    it('keyboard navigation: ArrowRight opens submenu and Enter selects subitem', () => {
        const subAction = jest.fn();

        const items = [
            {
                name: 'Main Item',
                tooltip: 'Has submenu',
                icon: <span>▶</span>,
                subItems: [
                    {
                        name: 'Sub Item 1',
                        action: subAction,
                        icon: <span>★</span>,
                        args: ['arg1'],
                    }
                ],
            }
        ];

        render(<Menu items={items} />);

        const button = screen.getByRole('button');
        fireEvent.click(button);
        fireEvent.keyDown(document, { key: 'ArrowDown' });
        fireEvent.keyDown(document, { key: 'ArrowRight' });
        fireEvent.keyDown(document, { key: 'Enter' });
        expect(subAction).toHaveBeenCalledWith('arg1', expect.any(Object));
    });

    it('closes menu on Escape', () => {
        render(<Menu items={items} />);
        const button = screen.getByRole('button');
        fireEvent.keyDown(button, { key: 'Enter' });
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(screen.queryByText('Action 1')).not.toBeInTheDocument();

        fireEvent.keyDown(button, { key: 'Enter' });
        fireEvent.keyDown(document, { key: 'Tab' });
        expect(screen.queryByText('Action 1')).not.toBeInTheDocument();

        fireEvent.keyDown(button, { key: 'a' });
        expect(screen.queryByText('Action 1')).not.toBeInTheDocument();

        fireEvent.keyDown(button, { key: ' ' });
        fireEvent.keyDown(document, { key: 'b' });
        expect(screen.queryByText('Action 1')).toBeInTheDocument();
    });

    it('does not render hidden items', () => {
        const hiddenItems = [
            { name: 'Visible Item', action: jest.fn() },
            { name: 'Hidden Item', hidden: true, action: jest.fn() }
        ];
        render(<Menu items={hiddenItems} />);
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByText('Visible Item')).toBeInTheDocument();
        expect(screen.queryByText('Hidden Item')).not.toBeInTheDocument();
    });

    it('ArrowUp navigates inside submenu', () => {
        const subAction1 = jest.fn();
        const subAction2 = jest.fn();

        const items = [
            {
                name: 'Parent Item',
                subItems: [
                    { name: 'Sub 1', action: subAction1, icon: <span>S1</span> },
                    { name: 'Sub 2', action: subAction2, icon: <span>S2</span> },
                ],
                icon: <span>P</span>,
            },
        ];

        render(<Menu items={items} />);

        const button = screen.getByRole('button');
        fireEvent.click(button);
        fireEvent.keyDown(document, { key: 'ArrowDown' });
        fireEvent.keyDown(document, { key: 'ArrowRight' });
        fireEvent.keyDown(document, { key: 'ArrowDown' });
        fireEvent.keyDown(document, { key: 'ArrowUp' });
        fireEvent.keyDown(document, { key: 'Enter' });

        expect(subAction1).toHaveBeenCalled();
    });
});

describe('Menu component more tests', () => {
    it('renders menu using ReactDOM.createPortal when usePortal is true', () => {
        const mockAction = jest.fn();

        const items = [
            {
                name: 'Export',
                tooltip: 'Export tooltip',
                icon: <span>📁</span>,
                action: mockAction,
            },
        ];

        const container = document.createElement('div');
        container.className = 'react-data-grid-lite';
        document.body.appendChild(container);

        const { container: renderedContainer } = render(
            <div className="grid-container">
                <Menu items={items} usePortal={true} />
            </div>,
            { container }
        );

        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(screen.getByText('Export')).toBeInTheDocument();
    });
});

describe('Menu component more tests', () => {
    const mockAction1 = jest.fn();
    const mockAction2 = jest.fn();

    const items = [
        { name: 'Item 1', action: mockAction1 },
        { name: 'Item 2', action: mockAction2 },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('ArrowUp navigates through top-level menu items and Enter triggers action', async () => {
        render(<Menu items={items} />);
        const button = screen.getByRole('button', { name: /open menu/i });
        fireEvent.click(button);
        const menu = await screen.findByRole('menu');
        expect(menu).toBeInTheDocument();

        const item1 = screen.getByText('Item 1').closest('[role="menuitem"]');
        const item2 = screen.getByText('Item 2').closest('[role="menuitem"]');

        item1.focus();
        expect(document.activeElement).toBe(item1);

        fireEvent.keyDown(menu, { key: 'ArrowDown', code: 'ArrowDown' });

        expect(document.activeElement).toBe(item2);
        fireEvent.keyDown(menu, { key: 'ArrowUp', code: 'ArrowUp' });
        expect(document.activeElement).toBe(item1);
        fireEvent.keyDown(menu, { key: 'Enter', code: 'Enter' });
        expect(mockAction1).toHaveBeenCalledTimes(1);
    });
});

describe('Menu component ArrowLeft key behavior', () => {
    const mockAction = jest.fn();

    const items = [
        {
            name: 'Item 1',
            action: mockAction,
            subItems: [
                { name: 'SubItem 1-1', action: mockAction },
                { name: 'SubItem 1-2', action: mockAction }
            ]
        },
        {
            name: 'Item 2',
            action: mockAction,
        }
    ];

    beforeEach(() => {
        mockAction.mockClear();
    });

    it('ArrowLeft closes open submenu', () => {
        render(<Menu items={items} />);
        const button = screen.getByRole('button', { name: /open menu/i });
        fireEvent.click(button);
        const firstMenuItem = screen.getByText('Item 1').closest('[role="menuitem"]');
        fireEvent.mouseEnter(firstMenuItem);
        fireEvent.keyDown(firstMenuItem, { key: 'ArrowRight' });
        const subMenuItem = screen.getByText('SubItem 1-1').closest('[role="menuitem"]');
        expect(subMenuItem).toBeInTheDocument();
        subMenuItem.focus();
        fireEvent.keyDown(subMenuItem, { key: 'ArrowLeft' });
        expect(screen.queryByText('SubItem 1-1')).not.toBeInTheDocument();
    });
});

describe('Menu component event handling', () => {
    const mockAction1 = jest.fn();
    const mockAction2 = jest.fn();

    const items = [
        { label: 'Item 1', action: mockAction1 },
        { label: 'Item 2', action: mockAction2 },
    ];

    it('does not close menu if event.detail.sourceId === menuId', async () => {
        render(<Menu items={items} menuId="test-menu" />);
        const button = screen.getByRole('button', { name: /open menu/i });
        fireEvent.click(button);
        const menu = await screen.findByRole('menu');
        expect(menu).toBeInTheDocument();
        const customEvent = new CustomEvent('someEvent', {
            bubbles: true,
            detail: { sourceId: 'test-menu' },
        });
        fireEvent(document, customEvent);
        expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('does not close menu if event.detail is missing', async () => {
        render(<Menu items={items} />);

        const button = screen.getByRole('button', { name: /open menu/i });
        fireEvent.click(button);
        const menu = await screen.findByRole('menu');
        expect(menu).toBeInTheDocument();
        const customEvent = new Event('someEvent', { bubbles: true });
        fireEvent(document, customEvent);
        expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('else branch calls setOpenSubMenuIndex(null) to close submenu', () => {
        const setOpenSubMenuIndex = jest.fn();
        render(<Menu items={items} />);

        const button = screen.getByRole('button', { name: /open menu/i });
        fireEvent.click(button);
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(screen.queryByRole('menuitem', { name: /submenu item/i })).not.toBeInTheDocument();
    });
});