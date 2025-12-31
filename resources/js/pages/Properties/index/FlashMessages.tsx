import { Card, CardContent } from '@/components/ui/card';

interface FlashMessagesProps {
    success?: string;
    error?: string;
}

export default function FlashMessages({ success, error }: FlashMessagesProps) {
    if (!success && !error) return null;

    return (
        <>
            {success && (
                <Card className="mb-4 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
                    <CardContent className="p-4">
                        <div className="text-green-700 dark:text-green-300">{success}</div>
                    </CardContent>
                </Card>
            )}
            {error && (
                <Card className="mb-4 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
                    <CardContent className="p-4">
                        <div className="text-red-700 dark:text-red-300">{error}</div>
                    </CardContent>
                </Card>
            )}
        </>
    );
}
