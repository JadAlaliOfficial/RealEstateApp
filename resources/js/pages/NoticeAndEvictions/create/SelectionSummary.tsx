import { Label } from '@/components/ui/label';

interface Props {
    selectedCityId: number | null;
    selectedPropertyId: number | null;
    selectedUnitId: number | null;
    selectedTenantId: number | null;
    selectedNames: {
        cityName: string;
        propertyName: string;
        unitName: string;
        tenantName: string;
    };
}

export default function SelectionSummary({ selectedCityId, selectedPropertyId, selectedUnitId, selectedTenantId, selectedNames }: Props) {
    if (!selectedCityId && !selectedPropertyId && !selectedUnitId && !selectedTenantId) {
        return null;
    }

    return (
        <div className="rounded-lg border-l-4 border-l-gray-500 bg-gray-50 p-4">
            <Label className="text-base font-semibold text-gray-700">Selection Summary</Label>
            <div className="mt-2 space-y-1 text-sm text-gray-600">
                {selectedCityId && (
                    <p>
                        <strong>City:</strong> {selectedNames.cityName}
                    </p>
                )}
                {selectedPropertyId && (
                    <p>
                        <strong>Property:</strong> {selectedNames.propertyName}
                    </p>
                )}
                {selectedUnitId && (
                    <p>
                        <strong>Unit:</strong> {selectedNames.unitName}
                    </p>
                )}
                {selectedTenantId && (
                    <p>
                        <strong>Tenant:</strong> {selectedNames.tenantName}
                    </p>
                )}
            </div>
        </div>
    );
}
