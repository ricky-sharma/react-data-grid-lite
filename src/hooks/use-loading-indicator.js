import { useEffect, useState } from 'react';
import { getLoading, subscribe } from '../utils/loading-utils';

const useLoadingIndicator = () => {
    const [loading, setLoading] = useState(getLoading());
    useEffect(() => {
        const unsubscribe = subscribe(setLoading);
        return () => unsubscribe();
    }, []);
    return loading;
};

export default useLoadingIndicator;
