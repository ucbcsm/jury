import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

/**
 * Custom React hook to manage a specific cookie.
 * @param {string} cookieName - The name of the cookie to manage.
 * @returns {{
 *   value: string | undefined,
 *   get: () => Promise<void>,
 *   set: (value: string) => Promise<void>,
 *   isSuccess: boolean,
 *   isPending: boolean,
 *   isError: boolean
 * }}
 */

export const useCookie = (cookieName: string) => {
    const [value, setValue] = useState<string | undefined>(undefined);
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);

    // Fetch the cookie value from the server
    const get = useCallback(async () => {
        setIsPending(true);
        setIsError(false);
        setIsSuccess(false);
        try {
            const response = await axios.get(`/api/cookies/${cookieName}`, {
                withCredentials: true,
            });
            setValue(response.data[cookieName]);
            setIsSuccess(true);
        } catch (error) {
            console.error('Error fetching cookie:', error);
            setIsError(true);
        } finally {
            setIsPending(false);
        }
    }, [cookieName]);

    // Set the cookie value on the server
    const set = useCallback(
        async (newValue: string) => {
            setIsPending(true);
            setIsError(false);
            setIsSuccess(false);
            try {
                await axios.post(
                    `/api/cookies/${cookieName}`,
                    { [cookieName]: newValue },
                    { withCredentials: true }
                );
                setValue(newValue);
                setIsSuccess(true);
            } catch (error) {
                console.error('Error setting cookie:', error);
                setIsError(true);
            } finally {
                setIsPending(false);
            }
        },
        [cookieName]
    );

    useEffect(() => {
        get();
    }, [get]);

    return { value, get, set, isSuccess, isPending, isError };
};
