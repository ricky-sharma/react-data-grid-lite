jest.mock('./../../../../src/helpers/sort', () => ({
    dynamicSort: jest.fn(() => (_a, _b) => 0)
}));

import { eventGridHeaderClicked } from './../../../../src/components/events/event-grid-header-clicked';
import { dynamicSort } from './../../../../src/helpers/sort';

describe('eventGridHeaderClicked', () => {
    let setStateMock;
    let state;
    let theadMock;
    let iconMock;

    beforeEach(() => {
        setStateMock = jest.fn();
        state = {
            gridID: '123',
            rowsData: [{ name: 'B' }, { name: 'A' }]
        };
        dynamicSort.mockImplementation(() => (a, b) => a.name.localeCompare(b.name));
        iconMock = document.createElement('i');
        iconMock.classList.add('icon-sort');

        theadMock = document.createElement('tr');
        theadMock.id = 'thead-row-123';
        theadMock.appendChild(iconMock);
        document.body.appendChild(theadMock);

        jest.spyOn(document, 'getElementById').mockImplementation(id => {
            return id === 'thead-row-123' ? theadMock : null;
        });
    });

    afterEach(() => {
        document.getElementById.mockRestore?.();
        jest.restoreAllMocks();
        document.body.innerHTML = '';
        jest.clearAllMocks();
    });

    it('should return early if event or name is invalid', () => {
        const result = eventGridHeaderClicked(null, null, state, setStateMock);
        expect(result).toBeUndefined();
        expect(setStateMock).not.toHaveBeenCalled();
    });

    it('handles click on <DIV> and sorts descending by default', () => {
        const icon = document.createElement('i');
        icon.classList.add('icon-sort');

        const div = document.createElement('div');
        div.appendChild(icon);

        const event = {
            target: div,
            currentTarget: div
        };

        eventGridHeaderClicked(event, ['name'], state, setStateMock);
        expect(dynamicSort).toHaveBeenCalledWith('-name');
        expect(setStateMock).toHaveBeenCalledWith(expect.any(Function));
        const updateFn = setStateMock.mock.calls[0][0];
        const newState = updateFn({ toggleState: false });
        expect(newState.sortType).toBe('desc');
        expect(newState.toggleState).toBe(true);
        expect(newState.rowsData[0].name).toBe('A');
    });

    it('clicking when icon is sort-up switches to descending', () => {
        const icon = document.createElement('i');
        icon.classList.add('icon-sort-up');

        const div = document.createElement('div');
        div.appendChild(icon);

        const event = {
            target: div,
            currentTarget: div
        };
        eventGridHeaderClicked(event, ['name'], state, setStateMock);

        expect(dynamicSort).toHaveBeenCalledWith('-name');
        expect(setStateMock).toHaveBeenCalled();
    });

    it('clicking when icon is sort-down switches to ascending', () => {
        const icon = document.createElement('i');
        icon.classList.add('icon-sort-down');

        const div = document.createElement('div');
        div.appendChild(icon);

        const event = {
            target: div,
            currentTarget: div
        };

        eventGridHeaderClicked(event, ['name'], state, setStateMock);
        expect(dynamicSort).toHaveBeenCalledWith('name');
        expect(setStateMock).toHaveBeenCalled();
        const newState = setStateMock.mock.calls[0][0]({ toggleState: false });
        expect(newState.sortType).toBe('asc');
    });

    it('handles <I> click and replaces icon', () => {
        const i = document.createElement('i');
        i.classList.add('icon-sort');
        const div = document.createElement('div');
        div.appendChild(i);

        const event = {
            target: i,
            currentTarget: div
        };
        eventGridHeaderClicked(event, ['name'], state, setStateMock);
        expect(setStateMock).toHaveBeenCalled();
    });

    it('handles <H4> click and replaces icon inside parent', () => {
        const i = document.createElement('i');
        i.classList.add('icon-sort');
        const innerDiv = document.createElement('div');
        innerDiv.appendChild(i);

        const h4 = document.createElement('h4');
        const parent = document.createElement('div');
        parent.appendChild(h4);
        parent.appendChild(innerDiv);

        const event = {
            target: h4,
            currentTarget: parent
        };
        eventGridHeaderClicked(event, ['name'], state, setStateMock);
        expect(setStateMock).toHaveBeenCalled();
    });

    it('does nothing if target nodeName is not DIV, I, or H4', () => {
        const span = document.createElement('span');
        const event = {
            target: span
        };

        const result = eventGridHeaderClicked(event, ['name'], state, setStateMock);
        expect(result).toBeUndefined();
        expect(setStateMock).not.toHaveBeenCalled();
    });
});
