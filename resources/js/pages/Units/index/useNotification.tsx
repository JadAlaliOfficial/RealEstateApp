import { useCallback, useState } from 'react';

export const useNotification = () => {
    const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

    const showNotification = useCallback((type: 'success' | 'error' | 'info', message: string) => {
        setNotification({ type, message });
    }, []);

    const hideNotification = useCallback(() => {
        setNotification(null);
    }, []);

    return { notification, showNotification, hideNotification };
};
