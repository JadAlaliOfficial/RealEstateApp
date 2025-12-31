import { Label } from '@/components/ui/label';
import { SelectionField } from '../edit/SelectionField';
import { City } from '@/types/City';
import { PropertyInfoWithoutInsurance } from '@/types/PropertyInfoWithoutInsurance';
import React from 'react';

interface LocationTenantSelectionProps {
    cities: City[];
    availableProperties: PropertyInfoWithoutInsurance[];
    availableUnits: Array<{ id: number; unit_name: string }>;
    availableTenants: Array<{ id: number; full_name: string; tenant_id: number }>;
    selectedCity: number | null;
    selectedProperty: number | null;
    selectedUnit: number | null;
    selectedTenant: number | null;
    validationErrors: {
        city: string;
        property: string;
        unit: string;
        tenant: string;
    };
    errors: {
        tenant_id?: string;
    };
    onCityChange: (cityId: string) => void;
    onPropertyChange: (propertyId: string) => void;
    onUnitChange: (unitId: string) => void;
    onTenantChange: (tenantId: string) => void;
    cityRef: React.RefObject<HTMLButtonElement>;
    propertyRef: React.RefObject<HTMLButtonElement>;
    unitRef: React.RefObject<HTMLButtonElement>;
    tenantRef: React.RefObject<HTMLButtonElement>;
}

export default function LocationTenantSelection({
    cities,
    availableProperties,
    availableUnits,
    availableTenants,
    selectedCity,
    selectedProperty,
    selectedUnit,
    selectedTenant,
    validationErrors,
    errors,
    onCityChange,
    onPropertyChange,
    onUnitChange,
    onTenantChange,
    cityRef,
    propertyRef,
    unitRef,
    tenantRef,
}: LocationTenantSelectionProps) {
    return (
        <div className="rounded-lg border-l-4 border-l-purple-500 p-4">
            <div className="mb-4 flex items-center gap-2">
                <Label className="text-base font-semibold">
                    Location & Tenant Selection *
                </Label>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
                <CitySelect
                    cities={cities}
                    selectedCity={selectedCity}
                    validationError={validationErrors.city}
                    onCityChange={onCityChange}
                    cityRef={cityRef}
                />

                <PropertySelect
                    availableProperties={availableProperties}
                    selectedProperty={selectedProperty}
                    selectedCity={selectedCity}
                    validationError={validationErrors.property}
                    onPropertyChange={onPropertyChange}
                    propertyRef={propertyRef}
                />

                <UnitSelect
                    availableUnits={availableUnits}
                    selectedUnit={selectedUnit}
                    selectedProperty={selectedProperty}
                    validationError={validationErrors.unit}
                    onUnitChange={onUnitChange}
                    unitRef={unitRef}
                />

                <TenantSelect
                    availableTenants={availableTenants}
                    selectedTenant={selectedTenant}
                    selectedUnit={selectedUnit}
                    validationError={validationErrors.tenant}
                    error={errors.tenant_id}
                    onTenantChange={onTenantChange}
                    tenantRef={tenantRef}
                />
            </div>
        </div>
    );
}

interface CitySelectProps {
    cities: City[];
    selectedCity: number | null;
    validationError: string;
    onCityChange: (cityId: string) => void;
    cityRef: React.RefObject<HTMLButtonElement>;
}

function CitySelect({ cities, selectedCity, validationError, onCityChange, cityRef }: CitySelectProps) {
    return (
        <SelectionField
            id="city"
            label="City"
            placeholder="Select city"
            value={selectedCity?.toString() || ''}
            options={cities.map((city) => ({ value: city.id.toString(), label: city.city }))}
            onChange={onCityChange}
            error={validationError}
            borderColor="blue"
            ref={cityRef}
        />
    );
}

interface PropertySelectProps {
    availableProperties: PropertyInfoWithoutInsurance[];
    selectedProperty: number | null;
    selectedCity: number | null;
    validationError: string;
    onPropertyChange: (propertyId: string) => void;
    propertyRef: React.RefObject<HTMLButtonElement>;
}

function PropertySelect({ 
    availableProperties, 
    selectedProperty, 
    selectedCity, 
    validationError, 
    onPropertyChange, 
    propertyRef 
}: PropertySelectProps) {
    return (
        <SelectionField
            id="property"
            label="Property"
            placeholder="Select property"
            value={selectedProperty?.toString() || ''}
            options={availableProperties.map((property) => ({ value: property.id.toString(), label: property.property_name }))}
            onChange={onPropertyChange}
            error={validationError}
            borderColor="green"
            disabled={!selectedCity}
            ref={propertyRef}
        />
    );
}

interface UnitSelectProps {
    availableUnits: Array<{ id: number; unit_name: string }>;
    selectedUnit: number | null;
    selectedProperty: number | null;
    validationError: string;
    onUnitChange: (unitId: string) => void;
    unitRef: React.RefObject<HTMLButtonElement>;
}

function UnitSelect({ 
    availableUnits, 
    selectedUnit, 
    selectedProperty, 
    validationError, 
    onUnitChange, 
    unitRef 
}: UnitSelectProps) {
    return (
        <SelectionField
            id="unit"
            label="Unit"
            placeholder="Select unit"
            value={selectedUnit?.toString() || ''}
            options={availableUnits.map((unit) => ({ value: unit.id.toString(), label: unit.unit_name }))}
            onChange={onUnitChange}
            error={validationError}
            borderColor="purple"
            disabled={!selectedProperty}
            ref={unitRef}
        />
    );
}

interface TenantSelectProps {
    availableTenants: Array<{ id: number; full_name: string; tenant_id: number }>;
    selectedTenant: number | null;
    selectedUnit: number | null;
    validationError: string;
    error?: string;
    onTenantChange: (tenantId: string) => void;
    tenantRef: React.RefObject<HTMLButtonElement>;
}

function TenantSelect({ 
    availableTenants, 
    selectedTenant, 
    selectedUnit, 
    validationError, 
    error,
    onTenantChange, 
    tenantRef 
}: TenantSelectProps) {
    return (
        <SelectionField
            id="tenant"
            label="Tenant"
            placeholder="Select tenant"
            value={selectedTenant?.toString() || ''}
            options={availableTenants.map((tenant) => ({ value: tenant.id.toString(), label: tenant.full_name }))}
            onChange={onTenantChange}
            error={error || validationError}
            borderColor="orange"
            disabled={!selectedUnit}
            ref={tenantRef}
        />
    );
}
