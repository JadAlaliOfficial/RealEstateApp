interface DebugInfoProps {
    unitId: string;
    selectedCity: string;
    selectedProperty: string;
    selectedUnit: string;
}

export function DebugInfo({ unitId, selectedCity, selectedProperty, selectedUnit }: DebugInfoProps) {
    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    return (
        <div className="mt-4 p-2 bg-gray-100 rounded text-sm">
            <p>Selected Unit ID: {unitId}</p>
            <p>City: {selectedCity}</p>
            <p>Property: {selectedProperty}</p>
            <p>Unit: {selectedUnit}</p>
        </div>
    );
}
