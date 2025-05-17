import { useState } from 'react';

const useLoadingIndicator = () => {
    const [loading, setLoading] = useState(false);

    const trackPromise = (promise) => {
        setLoading(true);

        promise
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
    };

    return {
        loading,
        trackPromise,
    };
};

export default useLoadingIndicator;
