import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerFooter } from '@/components/ui/drawer';
import { City } from '@/types/City';
import { PropertyInfoWithoutInsurance } from '@/types/PropertyInfoWithoutInsurance';
import { useForm } from '@inertiajs/react';
import React, { useState, useRef } from 'react';
import { CitySelectionSection } from './create/CitySelectionSection';
import { PropertySelectionSection } from './create/PropertySelectionSection';
import { UnitSelectionSection } from './create/UnitSelectionSection';
import { PersonalInformationSection } from './create/PersonalInformationSection';
import { ContactInformationSection } from './create/ContactInformationSection';
import { PaymentAndPreferencesSection } from './create/PaymentAndPreferencesSection';
import { AssistanceSection } from './create/AssistanceSection';

interface Props {
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

export default function TenantCreateDrawer({ 
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
    const firstNameRef = useRef<HTMLInputElement>(null!);
    const lastNameRef = useRef<HTMLInputElement>(null!);
    const [validationError, setValidationError] = useState<string>('');
    const [unitValidationError, setUnitValidationError] = useState<string>('');
    const [firstNameValidationError, setFirstNameValidationError] = useState<string>('');
    const [lastNameValidationError, setLastNameValidationError] = useState<string>('');
    const [availableUnits, setAvailableUnits] = useState<Array<{id: number; unit_name: string}>>([]);
    const [availableProperties, setAvailableProperties] = useState<PropertyInfoWithoutInsurance[]>([]);
    const [selectedPropertyName, setSelectedPropertyName] = useState<string>('');

    const { data, setData, post, processing, errors, reset, transform } = useForm({
        unit_id: '',
        first_name: '',
        last_name: '',
        street_address_line: '',
        login_email: '',
        alternate_email: '',
        mobile: '',
        emergency_phone: '',
        cash_or_check: '',
        has_insurance: '',
        sensitive_communication: '',
        has_assistance: '',
        assistance_amount: '',
        assistance_company: '',
        city_id: '',
    });

    const resetFormState = () => {
        reset();
        setValidationError('');
        setUnitValidationError('');
        setFirstNameValidationError('');
        setLastNameValidationError('');
        setAvailableUnits([]);
        setAvailableProperties([]);
        setSelectedPropertyName('');
    };

    const handleCityChange = (cityId: string) => {
        setData('city_id', cityId);
        setData('unit_id', '');
        setSelectedPropertyName('');
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
        
        setValidationError('');
        setUnitValidationError('');
        setFirstNameValidationError('');
        setLastNameValidationError('');
        
        let hasValidationErrors = false;
        
        if (!selectedPropertyName || selectedPropertyName.trim() === '') {
            setValidationError('Please select a property before submitting the form.');
            if (propertyNameRef.current) {
                propertyNameRef.current.focus();
                propertyNameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            hasValidationErrors = true;
        }
        
        if (!data.unit_id || data.unit_id.trim() === '') {
            setUnitValidationError('Please select a unit before submitting the form.');
            if (unitNumberRef.current) {
                unitNumberRef.current.focus();
                unitNumberRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            hasValidationErrors = true;
        }
        
        if (!data.first_name || data.first_name.trim() === '') {
            setFirstNameValidationError('Please enter a first name before submitting the form.');
            if (firstNameRef.current) {
                firstNameRef.current.focus();
                firstNameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            hasValidationErrors = true;
        }
        
        if (!data.last_name || data.last_name.trim() === '') {
            setLastNameValidationError('Please enter a last name before submitting the form.');
            if (lastNameRef.current) {
                lastNameRef.current.focus();
                lastNameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

        post(route('tenants.store'), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                resetFormState();
                onOpenChange(false);
                onSuccess?.();
            },
        });
    };

    const handleCancel = () => {
        resetFormState();
        onOpenChange(false);
    };

    return (
        <Drawer open={open} onOpenChange={onOpenChange} modal={false}>
            <DrawerContent size="half" title="Create New Tenant">
                <div className="flex h-full flex-col">
                    <div className="flex-1 overflow-auto p-6">
                        <form onSubmit={submit} className="space-y-4">
                            <CitySelectionSection
                                cities={cities}
                                value={data.city_id}
                                onChange={handleCityChange}
                                error={errors.city_id}
                            />

                            <PropertySelectionSection
                                ref={propertyNameRef}
                                properties={availableProperties}
                                value={selectedPropertyName}
                                onChange={handlePropertyChange}
                                disabled={!data.city_id}
                                validationError={validationError}
                            />

                            <UnitSelectionSection
                                ref={unitNumberRef}
                                units={availableUnits}
                                value={data.unit_id}
                                onChange={handleUnitChange}
                                disabled={!selectedPropertyName}
                                error={errors.unit_id}
                                validationError={unitValidationError}
                            />

                            <PersonalInformationSection
                                firstNameRef={firstNameRef}
                                lastNameRef={lastNameRef}
                                firstName={data.first_name}
                                lastName={data.last_name}
                                streetAddress={data.street_address_line}
                                onFirstNameChange={(value) => setData('first_name', value)}
                                onLastNameChange={(value) => setData('last_name', value)}
                                onStreetAddressChange={(value) => setData('street_address_line', value)}
                                firstNameError={errors.first_name}
                                lastNameError={errors.last_name}
                                streetAddressError={errors.street_address_line}
                                firstNameValidationError={firstNameValidationError}
                                lastNameValidationError={lastNameValidationError}
                            />

                            <ContactInformationSection
                                loginEmail={data.login_email}
                                alternateEmail={data.alternate_email}
                                mobile={data.mobile}
                                emergencyPhone={data.emergency_phone}
                                onLoginEmailChange={(value) => setData('login_email', value)}
                                onAlternateEmailChange={(value) => setData('alternate_email', value)}
                                onMobileChange={(value) => setData('mobile', value)}
                                onEmergencyPhoneChange={(value) => setData('emergency_phone', value)}
                                loginEmailError={errors.login_email}
                                alternateEmailError={errors.alternate_email}
                                mobileError={errors.mobile}
                                emergencyPhoneError={errors.emergency_phone}
                            />

                            <PaymentAndPreferencesSection
                                cashOrCheck={data.cash_or_check}
                                hasInsurance={data.has_insurance}
                                sensitiveCommunication={data.sensitive_communication}
                                hasAssistance={data.has_assistance}
                                onCashOrCheckChange={(value) => setData('cash_or_check', value)}
                                onHasInsuranceChange={(value) => setData('has_insurance', value)}
                                onSensitiveCommunicationChange={(value) => setData('sensitive_communication', value)}
                                onHasAssistanceChange={(value) => setData('has_assistance', value)}
                                cashOrCheckError={errors.cash_or_check}
                                hasInsuranceError={errors.has_insurance}
                                sensitiveCommunicationError={errors.sensitive_communication}
                                hasAssistanceError={errors.has_assistance}
                            />

                            {data.has_assistance === 'Yes' && (
                                <AssistanceSection
                                    assistanceAmount={data.assistance_amount}
                                    assistanceCompany={data.assistance_company}
                                    onAssistanceAmountChange={(value) => setData('assistance_amount', value)}
                                    onAssistanceCompanyChange={(value) => setData('assistance_company', value)}
                                    assistanceAmountError={errors.assistance_amount}
                                    assistanceCompanyError={errors.assistance_company}
                                />
                            )}
                        </form>
                    </div>

                    <DrawerFooter>
                        <div className="flex gap-2 w-full">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                onClick={submit}
                                disabled={processing}
                                className="flex-1"
                            >
                                {processing ? 'Creating...' : 'Create Tenant'}
                            </Button>
                        </div>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
