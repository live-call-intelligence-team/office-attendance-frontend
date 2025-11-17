// src/hooks/useFetch.js

import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for data fetching with loading and error states
 */
export const useFetch = (fetchFunction, dependencies = [], immediate = true) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(async (...args) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetchFunction(...args);
            setData(response.data || response);
            return response;
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'An error occurred');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchFunction]);

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, dependencies);

    const refetch = useCallback(() => {
        return execute();
    }, [execute]);

    return {
        data,
        loading,
        error,
        execute,
        refetch,
        setData,
    };
};

export default useFetch;