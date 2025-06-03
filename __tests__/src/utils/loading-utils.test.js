import trackPromise, { getLoading, subscribe } from './../../../src/utils/loading-utils';

describe('trackPromise module', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('getLoading returns false initially', () => {
        expect(getLoading()).toBe(false);
    });

    it('getLoading returns true while promise is pending', async () => {
        let resolveFn;
        const promise = new Promise((resolve) => {
            resolveFn = resolve;
        });

        const tracked = trackPromise(promise);
        expect(getLoading()).toBe(true);
        resolveFn();
        await tracked;
        expect(getLoading()).toBe(false);
    });

    it('subscribe notifies on state changes', async () => {
        const mockCallback = jest.fn();

        const unsubscribe = subscribe(mockCallback);

        let resolveFn;
        const promise = new Promise((resolve) => {
            resolveFn = resolve;
        });

        const tracked = trackPromise(promise);
        resolveFn();
        await tracked;

        expect(mockCallback).toHaveBeenCalledWith(true);
        expect(mockCallback).toHaveBeenCalledWith(false);

        unsubscribe();
    });

    it('unsubscribe prevents further notifications', async () => {
        const mockCallback = jest.fn();

        const unsubscribe = subscribe(mockCallback);
        unsubscribe();

        await trackPromise(Promise.resolve());
        expect(mockCallback).not.toHaveBeenCalled();
    });

    it('handles multiple overlapping promises', async () => {
        const mockCallback = jest.fn();
        subscribe(mockCallback);

        let resolveA, resolveB;
        const promiseA = new Promise((res) => (resolveA = res));
        const promiseB = new Promise((res) => (resolveB = res));
        const trackedA = trackPromise(promiseA);
        const trackedB = trackPromise(promiseB);
        expect(getLoading()).toBe(true);

        resolveA();
        await trackedA;
        expect(getLoading()).toBe(true);

        resolveB();
        await trackedB;
        expect(getLoading()).toBe(false);
    });

    it('trackPromise does not throw when promise fails', async () => {
        const failingPromise = Promise.reject(new Error('fail'));
        const wrapped = trackPromise(failingPromise).catch(() => { });
        await expect(wrapped).resolves.toBeUndefined();
        expect(getLoading()).toBe(false);
    });
});
