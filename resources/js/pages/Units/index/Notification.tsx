import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, X, XCircle } from 'lucide-react';

interface NotificationProps {
    type: 'success' | 'error' | 'info';
    message: string;
    onClose: () => void;
    duration?: number;
}

const Notification: React.FC<NotificationProps> = ({ type, message, onClose, duration = 4000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'error':
                return <XCircle className="h-5 w-5 text-red-500" />;
            case 'info':
                return <AlertCircle className="h-5 w-5 text-blue-500" />;
            default:
                return <AlertCircle className="h-5 w-5 text-blue-500" />;
        }
    };

    const getBgColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800';
            case 'error':
                return 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800';
            case 'info':
                return 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800';
            default:
                return 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800';
        }
    };

    return (
        <div
            className={`fixed top-4 right-4 z-50 max-w-md min-w-80 transform rounded-lg border p-4 shadow-lg transition-all duration-300 ease-in-out ${getBgColor()}`}
        >
            <div className="flex items-start gap-3">
                {getIcon()}
                <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{message}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default Notification;
