import React from 'react';
import { City } from '@/types/City';
import { PropertyInfoWithoutInsurance } from '@/types/PropertyInfoWithoutInsurance';
import { SelectionField } from './SelectionField';

interface Props {
    cities: City[];
    selectedCity: number | null;
    selectedProperty: number | null;
    selectedUnit: number | null;
    selectedTenant: number | null;
    availableProperties: PropertyInfoWithoutInsurance[];
    availableUnits: Array<{ id: number; unit_name: string }>;
    availableTenants: Array<{ id: number; full_name: string; tenant_id: number }>;
    validationErrors: {
        city: string;
        property: string;
        unit: string;
        tenant: string;
    };
    formErrors: any;
    onCityChange: (value: string) => void;
    onPropertyChange: (value: string) => void;
    onUnitChange: (value: string) => void;
    onTenantChange: (value: string) => void;
    cityRef: React.RefObject<HTMLButtonElement>;
    propertyRef: React.RefObject<HTMLButtonElement>;
    unitRef: React.RefObject<HTMLButtonElement>;
    tenantRef: React.RefObject<HTMLButtonElement>;
}

export function CascadingSelectionFields({
    cities,
    selectedCity,
    selectedProperty,
    selectedUnit,
    selectedTenant,
    availableProperties,
    availableUnits,
    availableTenants,
    validationErrors,
    formErrors,
    onCityChange,
    onPropertyChange,
    onUnitChange,
    onTenantChange,
    cityRef,
    propertyRef,
    unitRef,
    tenantRef
}: Props) {
    return (
        <>
            <SelectionField
                id="city"
                label="City"
                placeholder="Select city"
                value={selectedCity?.toString() || ''}
                options={cities.map(city => ({
                    value: city.id.toString(),
                    label: city.city
                }))}
                onChange={onCityChange}
                error={validationErrors.city}
                borderColor="blue"
                ref={cityRef}
            />

            <SelectionField
                id="property"
                label="Property"
                placeholder="Select property"
                value={selectedProperty?.toString() || ''}
                options={availableProperties.map(property => ({
                    value: property.id.toString(),
                    label: property.property_name
                }))}
                onChange={onPropertyChange}
                error={validationErrors.property}
                borderColor="green"
                disabled={!selectedCity}
                ref={propertyRef}
            />

            <SelectionField
                id="unit"
                label="Unit"
                placeholder="Select unit"
                value={selectedUnit?.toString() || ''}
                options={availableUnits.map(unit => ({
                    value: unit.id.toString(),
                    label: unit.unit_name
                }))}
                onChange={onUnitChange}
                error={validationErrors.unit}
                borderColor="purple"
                disabled={!selectedProperty}
                ref={unitRef}
            />

            <SelectionField
                id="tenant"
                label="Tenant"
                placeholder="Select tenant"
                value={selectedTenant?.toString() || ''}
                options={availableTenants.map(tenant => ({
                    value: tenant.id.toString(),
                    label: tenant.full_name
                }))}
                onChange={onTenantChange}
                error={validationErrors.tenant || formErrors.tenant_id}
                borderColor="orange"
                disabled={!selectedUnit}
                ref={tenantRef}
            />
        </>
    );
}
