import { useState, useEffect } from 'react';
import { City } from '@/types/City';
import { PropertyInfoWithoutInsurance } from '@/types/PropertyInfoWithoutInsurance';

interface TenantData {
    id: number;
    full_name: string;
    tenant_id: number;
}

interface PaymentPlan {
    tenant: string;
    unit: string;
    property: string;
    city_name: string | null;
}

interface Props {
    cities: City[];
    properties: PropertyInfoWithoutInsurance[];
    propertiesByCityId: Record<number, PropertyInfoWithoutInsurance[]>;
    unitsByPropertyId: Record<number, Array<{ id: number; unit_name: string }>>;
    tenantsByUnitId: Record<number, Array<{ id: number; full_name: string; tenant_id: number }>>;
    allUnits: Array<{ id: number; unit_name: string; city_name: string; property_name: string }>;
    tenantsData: TenantData[];
    paymentPlan: PaymentPlan;
    setData: (key: string, value: any) => void;
}

export function useCascadingDropdowns({
    cities,
    properties,
    propertiesByCityId,
    unitsByPropertyId,
    tenantsByUnitId,
    allUnits,
    tenantsData,
    paymentPlan,
    setData
}: Props) {
    // State for cascading dropdowns
    const [selectedCity, setSelectedCity] = useState<number | null>(null);
    const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
    const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
    const [selectedTenant, setSelectedTenant] = useState<number | null>(null);
    
    // Available options based on selections
    const [availableProperties, setAvailableProperties] = useState<PropertyInfoWithoutInsurance[]>([]);
    const [availableUnits, setAvailableUnits] = useState<Array<{ id: number; unit_name: string }>>([]);
    const [availableTenants, setAvailableTenants] = useState<Array<{ id: number; full_name: string; tenant_id: number }>>([]);
    
    // Validation errors
    const [validationErrors, setValidationErrors] = useState({
        city: '',
        property: '',
        unit: '',
        tenant: ''
    });

    // Initialize form data based on existing paymentPlan data
    useEffect(() => {
        if (paymentPlan && allUnits) {
            // Find the unit info from allUnits using unit name
            const unitInfo = allUnits.find(unit => unit.unit_name === paymentPlan.unit);
            
            if (unitInfo) {
                // Find the corresponding city and property by their names
                const selectedCityObj = cities.find(c => c.city === paymentPlan.city_name);
                const selectedPropertyObj = properties.find(p => p.property_name === paymentPlan.property);
                
                // Set UI state with IDs
                if (selectedCityObj) {
                    setSelectedCity(selectedCityObj.id);
                    // Set available properties for the city
                    if (propertiesByCityId[selectedCityObj.id]) {
                        setAvailableProperties(propertiesByCityId[selectedCityObj.id]);
                    }
                }
                
                if (selectedPropertyObj) {
                    setSelectedProperty(selectedPropertyObj.id);
                    // Set available units for the property
                    if (unitsByPropertyId[selectedPropertyObj.id]) {
                        setAvailableUnits(unitsByPropertyId[selectedPropertyObj.id]);
                    }
                }
                
                setSelectedUnit(unitInfo.id);
                // Set available tenants for the unit
                if (tenantsByUnitId[unitInfo.id]) {
                    setAvailableTenants(tenantsByUnitId[unitInfo.id]);
                }
                
                // Find tenant by name and set ID
                const tenantObj = tenantsData.find(t => t.full_name === paymentPlan.tenant);
                if (tenantObj) {
                    setSelectedTenant(tenantObj.id);
                    setData('tenant_id', tenantObj.id);
                }
            }
        }
    }, [paymentPlan, allUnits, cities, properties, propertiesByCityId, unitsByPropertyId, tenantsByUnitId, tenantsData]);

    // Handle city selection
    const handleCityChange = (cityId: string) => {
        const cityIdNum = parseInt(cityId);
        setSelectedCity(cityIdNum);
        setSelectedProperty(null);
        setSelectedUnit(null);
        setSelectedTenant(null);
        setData('tenant_id', null);
        
        setValidationErrors(prev => ({ ...prev, city: '', property: '', unit: '', tenant: '' }));

        if (cityIdNum && propertiesByCityId[cityIdNum]) {
            setAvailableProperties(propertiesByCityId[cityIdNum]);
        } else {
            setAvailableProperties([]);
        }
        setAvailableUnits([]);
        setAvailableTenants([]);
    };

    // Handle property selection
    const handlePropertyChange = (propertyId: string) => {
        const propertyIdNum = parseInt(propertyId);
        setSelectedProperty(propertyIdNum);
        setSelectedUnit(null);
        setSelectedTenant(null);
        setData('tenant_id', null);
        
        setValidationErrors(prev => ({ ...prev, property: '', unit: '', tenant: '' }));

        if (propertyIdNum && unitsByPropertyId[propertyIdNum]) {
            setAvailableUnits(unitsByPropertyId[propertyIdNum]);
        } else {
            setAvailableUnits([]);
        }
        setAvailableTenants([]);
    };

    // Handle unit selection
    const handleUnitChange = (unitId: string) => {
        const unitIdNum = parseInt(unitId);
        setSelectedUnit(unitIdNum);
        setSelectedTenant(null);
        setData('tenant_id', null);
        
        setValidationErrors(prev => ({ ...prev, unit: '', tenant: '' }));

        if (unitIdNum && tenantsByUnitId[unitIdNum]) {
            setAvailableTenants(tenantsByUnitId[unitIdNum]);
        } else {
            setAvailableTenants([]);
        }
    };

    // Handle tenant selection
    const handleTenantChange = (tenantId: string) => {
        const tenantIdNum = parseInt(tenantId);
        const tenant = availableTenants.find(t => t.id === tenantIdNum);
        if (tenant) {
            setSelectedTenant(tenantIdNum);
            setData('tenant_id', tenant.id);
            setValidationErrors(prev => ({ ...prev, tenant: '' }));
        }
    };

    const resetSelections = () => {
        setSelectedCity(null);
        setSelectedProperty(null);
        setSelectedUnit(null);
        setSelectedTenant(null);
        setAvailableProperties([]);
        setAvailableUnits([]);
        setAvailableTenants([]);
        setValidationErrors({
            city: '',
            property: '',
            unit: '',
            tenant: ''
        });
    };

    return {
        selectedCity,
        selectedProperty,
        selectedUnit,
        selectedTenant,
        availableProperties,
        availableUnits,
        availableTenants,
        validationErrors,
        handleCityChange,
        handlePropertyChange,
        handleUnitChange,
        handleTenantChange,
        resetSelections,
        setValidationErrors
    };
}
