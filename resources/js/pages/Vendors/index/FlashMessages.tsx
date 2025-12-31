interface FlashMessagesProps {
    flash: any;
}

export default function FlashMessages({ flash }: FlashMessagesProps) {
    if (!flash?.success && !flash?.error) return null;

    return (
        <>
            {flash?.success && (
                <div className="mb-4 rounded border border-chart-1 bg-chart-1/20 px-4 py-3 text-chart-1">
                    {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="mb-4 rounded border border-destructive bg-destructive/20 px-4 py-3 text-destructive">
                    {flash.error}
                </div>
            )}
        </>
    );
}
