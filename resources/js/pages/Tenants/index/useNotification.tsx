import { useCallback, useState } from 'react';

export type NotificationType = 'success' | 'error' | 'info';

interface NotificationState {
    type: NotificationType;
    message: string;
}

export const useNotification = () => {
    const [notification, setNotification] = useState<NotificationState | null>(null);

    const showNotification = useCallback((type: NotificationType, message: string) => {
        setNotification({ type, message });
    }, []);

    const hideNotification = useCallback(() => {
        setNotification(null);
    }, []);

    return { notification, showNotification, hideNotification };
};
