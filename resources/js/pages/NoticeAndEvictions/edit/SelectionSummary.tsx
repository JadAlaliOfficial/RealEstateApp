import { Label } from '@/components/ui/label';
import { City, PropertyInfoWithoutInsurance, Tenant } from '@/types/NoticeAndEviction';

interface Unit {
    id: number;
    property_id: number;
    unit_name: string;
    property_name: string;
    city_name: string;
}

interface ExtendedTenant extends Tenant {
    unit_id: number;
    full_name: string;
    unit_name: string;
    property_name: string;
    city_name: string;
}

interface ExtendedProperty extends PropertyInfoWithoutInsurance {
    city_id: number;
    city_name: string;
}

interface Props {
    cities: City[];
    filteredProperties: ExtendedProperty[];
    filteredUnits: Unit[];
    filteredTenants: ExtendedTenant[];
    selectedCityId: number | null;
    selectedPropertyId: number | null;
    selectedUnitId: number | null;
    tenantId: number | null;
}

export function SelectionSummary({
    cities,
    filteredProperties,
    filteredUnits,
    filteredTenants,
    selectedCityId,
    selectedPropertyId,
    selectedUnitId,
    tenantId,
}: Props) {
    const getSelectedCityName = () => {
        const city = cities.find((c) => c.id === selectedCityId);
        return city?.city || '';
    };

    const getSelectedPropertyName = () => {
        const property = filteredProperties.find((p) => p.id === selectedPropertyId);
        return property?.property_name || '';
    };

    const getSelectedUnitName = () => {
        const unit = filteredUnits.find((u) => u.id === selectedUnitId);
        return unit?.unit_name || '';
    };

    const getSelectedTenantName = () => {
        const tenant = filteredTenants.find((t) => t.id === tenantId);
        return tenant ? `${tenant.first_name} ${tenant.last_name}` : '';
    };

    if (!selectedCityId && !selectedPropertyId && !selectedUnitId && !tenantId) {
        return null;
    }

    return (
        <div className="rounded-lg border-l-4 border-l-gray-500 bg-gray-50 p-4">
            <Label className="text-base font-semibold text-gray-700">Current Selection</Label>
            <div className="mt-2 space-y-1 text-sm text-gray-600">
                {selectedCityId && (
                    <p>
                        <strong>City:</strong> {getSelectedCityName()}
                    </p>
                )}
                {selectedPropertyId && (
                    <p>
                        <strong>Property:</strong> {getSelectedPropertyName()}
                    </p>
                )}
                {selectedUnitId && (
                    <p>
                        <strong>Unit:</strong> {getSelectedUnitName()}
                    </p>
                )}
                {tenantId && (
                    <p>
                        <strong>Tenant:</strong> {getSelectedTenantName()}
                    </p>
                )}
            </div>
        </div>
    );
}
