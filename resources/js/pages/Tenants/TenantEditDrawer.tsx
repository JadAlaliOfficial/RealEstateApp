import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerFooter } from '@/components/ui/drawer';
import { Tenant } from '@/types/tenant';
import { City } from '@/types/City';
import { PropertyInfoWithoutInsurance } from '@/types/PropertyInfoWithoutInsurance';
import { useForm } from '@inertiajs/react';
import React, { useState, useRef, useEffect } from 'react';
import LocationSection from './edit/LocationSection';
import PersonalInfoSection from './edit/PersonalInfoSection';
import ContactInfoSection from './edit/ContactInfoSection';
import PreferencesSection from './edit/PreferencesSection';
import AssistanceSection from './edit/AssistanceSection';

interface Props {
    tenant: Tenant;
    cities: City[];
    properties: PropertyInfoWithoutInsurance[];
    unitsByProperty: Record<string, Array<{id: number; unit_name: string}>>;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
    // Preserve state: current filters and pagination from Tenants/Index
    currentFilters?: { city: string; property: string; unitName: string; search: string };
    page?: number;
    perPage?: number | 'all';
}

export default function TenantEditDrawer({ 
    tenant,
    cities, 
    properties, 
    unitsByProperty, 
    open, 
    onOpenChange, 
    onSuccess,
    currentFilters,
    page,
    perPage,
}: Props) {
    const propertyNameRef = useRef<HTMLButtonElement>(null!);
    const unitNumberRef = useRef<HTMLButtonElement>(null!);
    const [validationError, setValidationError] = useState<string>('');
    const [unitValidationError, setUnitValidationError] = useState<string>('');
    const [availableUnits, setAvailableUnits] = useState<Array<{id: number; unit_name: string}>>([]);
    const [availableProperties, setAvailableProperties] = useState<PropertyInfoWithoutInsurance[]>([]);
    const [selectedPropertyName, setSelectedPropertyName] = useState<string>('');

    const { data, setData, put, processing, errors, transform } = useForm({
        unit_id: tenant.unit_id?.toString() ?? '',
        first_name: tenant.first_name ?? '',
        last_name: tenant.last_name ?? '',
        street_address_line: tenant.street_address_line ?? '',
        login_email: tenant.login_email ?? '',
        alternate_email: tenant.alternate_email ?? '',
        mobile: tenant.mobile ?? '',
        emergency_phone: tenant.emergency_phone ?? '',
        cash_or_check: tenant.cash_or_check ?? '',
        has_insurance: tenant.has_insurance ?? '',
        sensitive_communication: tenant.sensitive_communication ?? '',
        has_assistance: tenant.has_assistance ?? '',
        assistance_amount: tenant.assistance_amount?.toString() ?? '',
        assistance_company: tenant.assistance_company ?? '',
    });

    // Find the city ID for the tenant's property
    const getCurrentCityId = () => {
        if (!tenant.property_name) return '';
        const property = properties.find(p => p.property_name === tenant.property_name);
        return property?.city_id?.toString() ?? '';
    };

    const [selectedCityId, setSelectedCityId] = useState<string>(getCurrentCityId());

    // Initialize available properties and units based on tenant data
    useEffect(() => {
        if (selectedCityId) {
            const filteredProperties = properties.filter(
                property => property.city_id?.toString() === selectedCityId
            );
            setAvailableProperties(filteredProperties);
        }

        if (tenant.property_name) {
            setSelectedPropertyName(tenant.property_name);
            if (unitsByProperty[tenant.property_name]) {
                setAvailableUnits(unitsByProperty[tenant.property_name]);
            }
        }
    }, [selectedCityId, tenant.property_name, properties, unitsByProperty]);

    // Filter properties based on selected city
    const handleCityChange = (cityId: string) => {
        setSelectedCityId(cityId);
        setSelectedPropertyName('');
        setData('unit_id', '');
        setValidationError('');
        setUnitValidationError('');

        if (cityId) {
            const filteredProperties = properties.filter(
                property => property.city_id?.toString() === cityId
            );
            setAvailableProperties(filteredProperties);
        } else {
            setAvailableProperties([]);
        }
        setAvailableUnits([]);
    };

    const handlePropertyChange = (propertyName: string) => {
        setSelectedPropertyName(propertyName);
        setData('unit_id', '');
        setValidationError('');
        setUnitValidationError('');

        if (propertyName && unitsByProperty && unitsByProperty[propertyName]) {
            setAvailableUnits(unitsByProperty[propertyName]);
        } else {
            setAvailableUnits([]);
        }
    };

    const handleUnitChange = (unitId: string) => {
        setData('unit_id', unitId);
        setUnitValidationError('');
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Clear any previous validation errors
        setValidationError('');
        setUnitValidationError('');
        
        let hasValidationErrors = false;
        
        // Validate property is selected
        if (!selectedPropertyName || selectedPropertyName.trim() === '') {
            setValidationError('Please select a property before submitting the form.');
            if (propertyNameRef.current) {
                propertyNameRef.current.focus();
                propertyNameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            hasValidationErrors = true;
        }
        
        // Validate unit_id is not empty
        if (!data.unit_id || data.unit_id.trim() === '') {
            setUnitValidationError('Please select a unit before submitting the form.');
            if (unitNumberRef.current) {
                unitNumberRef.current.focus();
                unitNumberRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            hasValidationErrors = true;
        }
        
        if (hasValidationErrors) {
            return;
        }
        
        // Include filters & pagination in the payload via transform
        transform((payload) => ({
            ...payload,
            search: currentFilters?.search ?? '',
            city: currentFilters?.city ?? '',
            property: currentFilters?.property ?? '',
            unit_name: currentFilters?.unitName ?? '',
            perPage: perPage ?? 15,
            page: page ?? 1,
        }));

        put(route('tenants.update', tenant.id), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setValidationError('');
                setUnitValidationError('');
                onOpenChange(false);
                onSuccess?.();
            },
        });
    };

    const handleCancel = () => {
        // Reset form to original tenant data
        setData({
            unit_id: tenant.unit_id?.toString() ?? '',
            first_name: tenant.first_name ?? '',
            last_name: tenant.last_name ?? '',
            street_address_line: tenant.street_address_line ?? '',
            login_email: tenant.login_email ?? '',
            alternate_email: tenant.alternate_email ?? '',
            mobile: tenant.mobile ?? '',
            emergency_phone: tenant.emergency_phone ?? '',
            cash_or_check: tenant.cash_or_check ?? '',
            has_insurance: tenant.has_insurance ?? '',
            sensitive_communication: tenant.sensitive_communication ?? '',
            has_assistance: tenant.has_assistance ?? '',
            assistance_amount: tenant.assistance_amount?.toString() ?? '',
            assistance_company: tenant.assistance_company ?? '',
        });
        setValidationError('');
        setUnitValidationError('');
        setSelectedCityId(getCurrentCityId());
        setSelectedPropertyName(tenant.property_name ?? '');
        onOpenChange(false);
    };

    return (
        <Drawer open={open} onOpenChange={onOpenChange} modal={false}>
            <DrawerContent size="half" title={`Edit ${tenant.first_name} ${tenant.last_name}`}>
                <div className="flex h-full flex-col">
                    <div className="flex-1 overflow-auto p-6">
                        <form onSubmit={submit} className="space-y-4">
                            <LocationSection
                                cities={cities}
                                selectedCityId={selectedCityId}
                                onCityChange={handleCityChange}
                                availableProperties={availableProperties}
                                selectedPropertyName={selectedPropertyName}
                                onPropertyChange={handlePropertyChange}
                                propertyNameRef={propertyNameRef}
                                validationError={validationError}
                                availableUnits={availableUnits}
                                unitId={data.unit_id}
                                onUnitChange={handleUnitChange}
                                unitNumberRef={unitNumberRef}
                                unitValidationError={unitValidationError}
                                errors={errors}
                            />

                            <PersonalInfoSection
                                firstName={data.first_name}
                                lastName={data.last_name}
                                streetAddress={data.street_address_line}
                                onFirstNameChange={(value) => setData('first_name', value)}
                                onLastNameChange={(value) => setData('last_name', value)}
                                onStreetAddressChange={(value) => setData('street_address_line', value)}
                                errors={errors}
                            />

                            <ContactInfoSection
                                loginEmail={data.login_email}
                                alternateEmail={data.alternate_email}
                                mobile={data.mobile}
                                emergencyPhone={data.emergency_phone}
                                onLoginEmailChange={(value) => setData('login_email', value)}
                                onAlternateEmailChange={(value) => setData('alternate_email', value)}
                                onMobileChange={(value) => setData('mobile', value)}
                                onEmergencyPhoneChange={(value) => setData('emergency_phone', value)}
                                errors={errors}
                            />

                            <PreferencesSection
                                cashOrCheck={data.cash_or_check}
                                hasInsurance={data.has_insurance}
                                sensitiveCommunication={data.sensitive_communication}
                                hasAssistance={data.has_assistance}
                                onCashOrCheckChange={(value) => setData('cash_or_check', value)}
                                onHasInsuranceChange={(value) => setData('has_insurance', value)}
                                onSensitiveCommunicationChange={(value) => setData('sensitive_communication', value)}
                                onHasAssistanceChange={(value) => setData('has_assistance', value)}
                                errors={errors}
                            />

                            {data.has_assistance === 'Yes' && (
                                <AssistanceSection
                                    assistanceAmount={data.assistance_amount}
                                    assistanceCompany={data.assistance_company}
                                    onAssistanceAmountChange={(value) => setData('assistance_amount', value)}
                                    onAssistanceCompanyChange={(value) => setData('assistance_company', value)}
                                    errors={errors}
                                />
                            )}
                        </form>
                    </div>

                    <DrawerFooter>
                        <div className="flex gap-2">
                            <Button 
                                onClick={submit} 
                                disabled={processing}
                                className="flex-1"
                            >
                                {processing ? 'Updating...' : 'Update Tenant'}
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={handleCancel}
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                        </div>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
