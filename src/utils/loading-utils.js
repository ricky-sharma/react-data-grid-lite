import { Container_Identifier, Loader_Identifier } from "../constants";

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

export function showLoader(parentId, message) {
    const parent = document.getElementById(parentId);

    if (!parent) {
        return;
    }
    const container = parent.querySelector(Container_Identifier);
    if (!container) {
        return;
    }
    if (getComputedStyle(container).position === 'static') {
        container.style.position = 'relative';
    }
    if (container.querySelector(`.${Loader_Identifier}`)) return;

    const overlay = document.createElement('div');
    overlay.className = Loader_Identifier;
    overlay.style.position = 'absolute';
    overlay.style.top = '50%';
    overlay.style.left = '50%';
    overlay.style.transform = 'translate(-50%, -50%)';
    overlay.style.zIndex = '999';
    overlay.style.backgroundColor = 'rgba(255,255,255,0.6)';
    overlay.style.textAlign = 'center';

    if (message) {
        const msg = document.createElement('div');
        msg.textContent = message;
        msg.style.fontSize = '14px';
        msg.style.color = '#333';
        overlay.appendChild(msg);
    } else {
        const dots = document.createElement('div');
        dots.className = 'dot-loader';
        dots.innerHTML = '<span></span><span></span><span></span>';
        overlay.appendChild(dots);
    }
    container.appendChild(overlay);
}

export function hideLoader(parentId) {
    const parent = document.getElementById(parentId);
    if (!parent) return;

    const container = parent.querySelector(Container_Identifier);
    const overlay = container?.querySelector(`.${Loader_Identifier}`);
    if (overlay) overlay.remove();
}