import { eventGridHeaderClicked } from './../../../../src/components/events/event-grid-header-clicked';
import { dynamicSort } from './../../../../src/helpers/sort';
import { isNull } from './../../../../src/helpers/common';

jest.mock('./../../../../src/helpers/sort', () => ({
    dynamicSort: jest.fn(),
}));

jest.mock('./../../../../src/helpers/common', () => ({
    isNull: jest.fn(),
}));

describe('eventGridHeaderClicked', () => {
    let mockSetState;
    let mockState;
    let mockEvent;

    beforeEach(() => {
        jest.clearAllMocks();
        mockSetState = jest.fn((updater) => {
            mockState = updater(mockState);
        });

        mockState = {
            gridID: 'test-grid',
            rowsData: [
                { name: 'Zebra', age: 10 },
                { name: 'Apple', age: 5 },
            ],
            toggleState: false,
        };
        const mockWrapper = {
            appendChild: jest.fn(),
            removeChild: jest.fn(),
        };
        mockEvent = {
            currentTarget: {
                querySelector: jest.fn().mockReturnValue({
                    querySelector: jest.fn().mockReturnValue({
                        classList: {
                            contains: jest.fn(),
                            add: jest.fn(),
                            remove: jest.fn(),
                        },
                        closest: jest.fn().mockReturnValue(mockWrapper),
                        parentNode: mockWrapper,
                    }),
                }),
            },
        };

        document.getElementById = jest.fn().mockReturnValue({
            getElementsByTagName: jest.fn().mockReturnValue([
                { classList: { remove: jest.fn(), add: jest.fn(), contains: jest.fn() } },
                { classList: { remove: jest.fn(), add: jest.fn(), contains: jest.fn() } },
            ]),
        });

        document.createElement = jest.fn().mockReturnValue({
            classList: {
                add: jest.fn(),
            },
        });

        isNull.mockReturnValue(false);
        dynamicSort.mockImplementation(() => (data) => {
            if (!data || !Array.isArray(data)) return data;
            return [...data].reverse();
        });
    });

    it('should return early if event is null', () => {
        eventGridHeaderClicked(null, ['name'], mockState, mockSetState);
        expect(mockSetState).not.toHaveBeenCalled();
    });

    it('should return early if name is not an array', () => {
        eventGridHeaderClicked(mockEvent, 'name', mockState, mockSetState);
        expect(mockSetState).not.toHaveBeenCalled();
    });

    it('should return early if iconElement is not found', () => {
        mockEvent.currentTarget.querySelector.mockReturnValue({
            querySelector: jest.fn().mockReturnValue(null),
        });
        eventGridHeaderClicked(mockEvent, ['name'], mockState, mockSetState);
        expect(mockSetState).not.toHaveBeenCalled();
    });

    it('should sort descending when icon is sort-up or sort', () => {
        mockEvent.currentTarget.querySelector().querySelector().classList.contains
            .mockReturnValueOnce(true)
            .mockReturnValueOnce(false);
        eventGridHeaderClicked(mockEvent, ['name'], mockState, mockSetState);

        expect(document.createElement).toHaveBeenCalledWith('i');
        expect(document.createElement().classList.add).toHaveBeenCalledWith('icon-sort-down');
        expect(dynamicSort).toHaveBeenCalledWith('-name');
        expect(mockSetState).toHaveBeenCalledWith(expect.any(Function));
        expect(mockState).toMatchObject({
            rowsData: expect.any(Array),
            sortType: 'desc',
            toggleState: true,
        });
    });

    it('should sort ascending when icon is sort-down', () => {
        mockEvent.currentTarget.querySelector().querySelector().classList.contains
            .mockReturnValueOnce(false)
            .mockReturnValueOnce(false);
        eventGridHeaderClicked(mockEvent, ['name'], mockState, mockSetState);

        expect(document.createElement).toHaveBeenCalledWith('i');
        expect(document.createElement().classList.add).toHaveBeenCalledWith('icon-sort-up');
        expect(dynamicSort).toHaveBeenCalledWith('name');
        expect(mockSetState).toHaveBeenCalledWith(expect.any(Function));
        expect(mockState).toMatchObject({
            rowsData: expect.any(Array),
            sortType: 'asc',
            toggleState: true,
        });
    });

    it('should reset other sort icons when theadRow exists', () => {
        const mockIcons = [
            { classList: { remove: jest.fn(), add: jest.fn(), contains: jest.fn().mockReturnValue(false) } },
            { classList: { remove: jest.fn(), add: jest.fn(), contains: jest.fn().mockReturnValue(false) } },
        ];
        document.getElementById.mockReturnValue({
            getElementsByTagName: jest.fn().mockReturnValue(mockIcons),
        });
        isNull.mockReturnValue(false);
        mockState.rowsData = null;

        eventGridHeaderClicked(mockEvent, ['name'], mockState, mockSetState);

        mockIcons.forEach((icon) => {
            expect(icon.classList.remove).not.toHaveBeenCalledWith('icon-sort-up', 'icon-sort-down');
            expect(icon.classList.add).not.toHaveBeenCalledWith('icon-sort', 'inactive');
        });
        expect(dynamicSort).not.toHaveBeenCalled();
    });

    it('should not reset sort icons when theadRow is null', () => {
        document.getElementById.mockReturnValue(null);
        isNull.mockReturnValue(true);

        eventGridHeaderClicked(mockEvent, ['name'], mockState, mockSetState);

        expect(document.getElementById).toHaveBeenCalledWith('thead-row-test-grid');
        expect(isNull).toHaveBeenCalledWith(null);
    });

    it('should replace icon in sort-icon-wrapper', () => {
        eventGridHeaderClicked(mockEvent, ['name'], mockState, mockSetState);

        expect(mockEvent.currentTarget.querySelector().querySelector().closest).toHaveBeenCalledWith('.sort-icon-wrapper');
        expect(mockEvent.currentTarget.querySelector().querySelector().parentNode.removeChild).toHaveBeenCalled();
        expect(mockEvent.currentTarget.querySelector().querySelector().parentNode.appendChild).toHaveBeenCalled();
    });

    it('should handle multiple sort columns', () => {
        mockEvent.currentTarget.querySelector().querySelector().classList.contains
            .mockReturnValueOnce(true) // icon-sort-up
            .mockReturnValueOnce(false); // icon-sort
        eventGridHeaderClicked(mockEvent, ['name', 'age'], mockState, mockSetState);

        expect(dynamicSort).toHaveBeenCalledWith('-name', '-age');
        expect(mockState.sortType).toBe('desc');
    });

    it('should not sort if rowsData is null', () => {
        mockState.rowsData = undefined;
        eventGridHeaderClicked(mockEvent, ['name'], mockState, mockSetState);

        expect(dynamicSort).not.toHaveBeenCalled();
        expect(mockSetState).toHaveBeenCalledWith(expect.any(Function));
        expect(mockState).toMatchObject({
            rowsData: undefined,
            sortType: expect.any(String),
            toggleState: true,
        });
    });
});