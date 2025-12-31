import { Drawer, DrawerContent, DrawerFooter } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { City } from '@/types/City';
import { PropertyInfoWithoutInsurance } from '@/types/PropertyInfoWithoutInsurance';
import { useForm } from '@inertiajs/react';
import React, { useState, useRef } from 'react';
import LocationTenantSelection from './create/LocationTenantSelection';
import PaymentPlanDetails from './create/PaymentPlanDetails';
import NotesSection from './create/NotesSection';

interface TenantData {
    id: number;
    full_name: string;
    tenant_id: number;
}

type PaymentPlanFormData = {
    tenant_id: number | null;
    amount: number;
    dates: string;
    paid: number;
    notes: string;
}

interface Props {
    cities: City[];
    properties: PropertyInfoWithoutInsurance[];
    propertiesByCityId: Record<number, PropertyInfoWithoutInsurance[]>;
    unitsByPropertyId: Record<number, Array<{ id: number; unit_name: string }>>;
    tenantsByUnitId: Record<number, Array<{ id: number; full_name: string; tenant_id: number }>>;
    tenantsData: TenantData[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
    // Context from Index page for preserving state after store/redirect
    search?: string | null;
    filters?: { city?: string | null; property?: string | null; unit?: string | null; tenant?: string | null };
    perPage?: number | string;
    currentPage?: number;
}

export default function PaymentPlanCreateDrawer({ 
    cities,
    propertiesByCityId,
    unitsByPropertyId,
    tenantsByUnitId,
    open, 
    onOpenChange, 
    onSuccess,
    search,
    filters,
    perPage,
    currentPage
}: Props) {
    const [selectedCity, setSelectedCity] = useState<number | null>(null);
    const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
    const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
    const [selectedTenant, setSelectedTenant] = useState<number | null>(null);
    
    const [availableProperties, setAvailableProperties] = useState<PropertyInfoWithoutInsurance[]>([]);
    const [availableUnits, setAvailableUnits] = useState<Array<{ id: number; unit_name: string }>>([]);
    const [availableTenants, setAvailableTenants] = useState<Array<{ id: number; full_name: string; tenant_id: number }>>([]);
    
    const [validationErrors, setValidationErrors] = useState({
        city: '',
        property: '',
        unit: '',
        tenant: ''
    });
    
    const cityRef = useRef<HTMLButtonElement>(null!);
    const propertyRef = useRef<HTMLButtonElement>(null!);
    const unitRef = useRef<HTMLButtonElement>(null!);
    const tenantRef = useRef<HTMLButtonElement>(null!);
    const dateRef = useRef<HTMLButtonElement>(null!);

    const { data, setData, post, processing, errors, reset, transform } = useForm<PaymentPlanFormData>({
        tenant_id: null,
        amount: 0,
        dates: '',
        paid: 0,
        notes: '',
    });

    const [dateError, setDateError] = useState<string>('');

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

    const handleTenantChange = (tenantId: string) => {
        const tenantIdNum = parseInt(tenantId);
        const tenant = availableTenants.find(t => t.id === tenantIdNum);
        if (tenant) {
            setSelectedTenant(tenantIdNum);
            setData('tenant_id', tenant.id);
            setValidationErrors(prev => ({ ...prev, tenant: '' }));
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        setValidationErrors({
            city: '',
            property: '',
            unit: '',
            tenant: ''
        });
        setDateError('');
        
        let hasValidationErrors = false;
        
        if (!selectedCity) {
            setValidationErrors(prev => ({ ...prev, city: 'Please select a city before submitting the form.' }));
            if (cityRef.current) {
                cityRef.current.focus();
                cityRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            hasValidationErrors = true;
        }
        
        if (!selectedProperty) {
            setValidationErrors(prev => ({ ...prev, property: 'Please select a property before submitting the form.' }));
            if (propertyRef.current) {
                propertyRef.current.focus();
                propertyRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            hasValidationErrors = true;
        }
        
        if (!selectedUnit) {
            setValidationErrors(prev => ({ ...prev, unit: 'Please select a unit before submitting the form.' }));
            if (unitRef.current) {
                unitRef.current.focus();
                unitRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            hasValidationErrors = true;
        }
        
        if (!selectedTenant || !data.tenant_id) {
            setValidationErrors(prev => ({ ...prev, tenant: 'Please select a tenant before submitting the form.' }));
            if (tenantRef.current) {
                tenantRef.current.focus();
                tenantRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            hasValidationErrors = true;
        }
        
        // Require payment date
        if (!data.dates || !String(data.dates).trim()) {
            setDateError('Please select a payment date.');
            if (dateRef.current) {
                dateRef.current.focus();
                dateRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            hasValidationErrors = true;
        }
        
        if (hasValidationErrors) {
            return;
        }

        // Inject filters/search/pagination into the outgoing payload
        transform((formData) => ({
            ...formData,
            search: search ?? null,
            city: filters?.city ?? null,
            property: filters?.property ?? null,
            unit: filters?.unit ?? null,
            tenant: filters?.tenant ?? null,
            per_page: perPage ?? null,
            page: currentPage ?? null,
        }));

        post(route('payment-plans.store'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                handleCancel();
                onSuccess?.();
            },
        });
    };

    const handleCancel = () => {
        reset();
        setSelectedCity(null);
        setSelectedProperty(null);
        setSelectedUnit(null);
        setSelectedTenant(null);
        setValidationErrors({
            city: '',
            property: '',
            unit: '',
            tenant: ''
        });
        setAvailableProperties([]);
        setAvailableUnits([]);
        setAvailableTenants([]);
        onOpenChange(false);
    };

    return (
        <Drawer open={open} onOpenChange={onOpenChange} modal={false}>
            <DrawerContent size="half" title="Create Payment Plan">
                <div className="flex h-full flex-col">
                    <div className="flex-1 overflow-auto p-6">
                        <form onSubmit={submit} className="space-y-4">
                            <LocationTenantSelection
                                cities={cities}
                                availableProperties={availableProperties}
                                availableUnits={availableUnits}
                                availableTenants={availableTenants}
                                selectedCity={selectedCity}
                                selectedProperty={selectedProperty}
                                selectedUnit={selectedUnit}
                                selectedTenant={selectedTenant}
                                validationErrors={validationErrors}
                                errors={errors}
                                onCityChange={handleCityChange}
                                onPropertyChange={handlePropertyChange}
                                onUnitChange={handleUnitChange}
                                onTenantChange={handleTenantChange}
                                cityRef={cityRef}
                                propertyRef={propertyRef}
                                unitRef={unitRef}
                                tenantRef={tenantRef}
                            />

                            <PaymentPlanDetails
                                dates={data.dates}
                                amount={data.amount}
                                paid={data.paid}
                                errors={dateError ? { ...errors, dates: dateError } : errors}
                                onDatesChange={(dates) => {
                                    setData('dates', dates);
                                    setDateError('');
                                }}
                                onAmountChange={(amount) => setData('amount', amount)}
                                onPaidChange={(paid) => setData('paid', paid)}
                                dateRef={dateRef}
                            />

                            <NotesSection
                                notes={data.notes}
                                errors={errors}
                                onNotesChange={(notes) => setData('notes', notes)}
                            />
                        </form>
                    </div>

                    <DrawerFooter>
                        <div className="flex justify-end gap-2 w-full">
                            <Button type="button" variant="outline" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button type="submit" onClick={submit} disabled={processing}>
                                {processing ? 'Creating...' : 'Create Payment Plan'}
                            </Button>
                        </div>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
