// resources/js/Pages/Applications/components/FlashMessages.tsx
interface FlashMessagesProps {
    success?: string;
    error?: string;
}

export default function FlashMessages({ success, error }: FlashMessagesProps) {
    if (!success && !error) return null;

    return (
        <>
            {success && (
                <div className="mb-4 rounded border border-chart-1 bg-chart-1/20 px-4 py-3 text-chart-1">{success}</div>
            )}
            {error && (
                <div className="mb-4 rounded border border-destructive bg-destructive/20 px-4 py-3 text-destructive">
                    {error}
                </div>
            )}
        </>
    );
}
