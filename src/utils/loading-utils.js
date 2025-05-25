let loadingCount = 0;
let subscribers = [];

export const getLoading = () => loadingCount > 0;

export const subscribe = (callback) => {
    subscribers.push(callback);
    return () => {
        subscribers = subscribers.filter(fn => fn !== callback);
    };
};

const notify = () => {
    const loading = getLoading();
    subscribers.forEach(fn => fn(loading));
};

 const trackPromise = async (promise) => {
    loadingCount += 1;
    notify();

    try {
        await promise;
    } finally {
        loadingCount -= 1;
        notify();
    }
};

export default trackPromise;