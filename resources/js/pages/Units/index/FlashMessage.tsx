import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface FlashMessageProps {
    type: 'success' | 'error';
    message: string;
}

const FlashMessage: React.FC<FlashMessageProps> = ({ type, message }) => {
    const getStyles = () => {
        if (type === 'success') {
            return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950 text-green-700 dark:text-green-300';
        }
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 text-red-700 dark:text-red-300';
    };

    return (
        <Card className={`mb-4 ${getStyles()}`}>
            <CardContent className="p-4">
                <div>{message}</div>
            </CardContent>
        </Card>
    );
};

export default FlashMessage;
