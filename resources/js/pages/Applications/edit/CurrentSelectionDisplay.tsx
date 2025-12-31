interface Props {
    city?: string;
    property?: string;
    unitName?: string;
}

export function CurrentSelectionDisplay({ city, property, unitName }: Props) {
    return (
        <div className="rounded-lg bg-muted/50 p-4">
            <div className="text-sm text-muted-foreground">
                <p>
                    <strong>Current Selection:</strong>
                </p>
                <p>City: {city || 'N/A'}</p>
                <p>Property: {property || 'N/A'}</p>
                <p>Unit: {unitName || 'N/A'}</p>
            </div>
        </div>
    );
}
