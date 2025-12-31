import React from 'react';

interface FlashMessagesProps {
    success?: string;
    error?: string;
}

export const FlashMessages: React.FC<FlashMessagesProps> = ({ success, error }) => {
    if (!success && !error) return null;

    return (
        <>
            {success && (
                <div className="mb-4 rounded border border-green-200 bg-green-50 px-4 py-3 text-green-800 dark:border-green-800 dark:bg-green-950/20 dark:text-green-200">
                    {success}
                </div>
            )}
            {error && (
                <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-800 dark:border-red-800 dark:bg-red-950/20 dark:text-red-200">
                    {error}
                </div>
            )}
        </>
    );
};
