import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerFooter } from '@/components/ui/drawer';
import { PropertyInfoWithoutInsurance } from '@/types/PropertyInfoWithoutInsurance';
import { useForm } from '@inertiajs/react';
import React, { useState, useRef, useEffect } from 'react';
import { UnitFilters } from '@/types/unit';
import CitySelection from './create/CitySelection';
import PropertySelection from './create/PropertySelection';
import UnitDetails from './create/UnitDetails';
import TenantDetails from './create/TenantDetails';
import LeaseDates from './create/LeaseDates';
import UnitSpecifications from './create/UnitSpecifications';
import LeaseStatus from './create/LeaseStatus';
import FinancialInformation from './create/FinancialInformation';
import UtilityInformation from './create/UtilityInformation';
import InsuranceInformation from './create/InsuranceInformation';
import NewLease from './create/NewLease';

interface Props {
    cities: Array<{ id: number; city: string }>;
    properties: PropertyInfoWithoutInsurance[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
    redirectState: {
        filters: UnitFilters;
        per_page: string;
        page: number;
    };
}

export default function UnitCreateDrawer({ cities, properties, open, onOpenChange, onSuccess, redirectState }: Props) {
    const propertyRef = useRef<HTMLButtonElement>(null);
    const unitNameRef = useRef<HTMLInputElement>(null);
    const [validationError, setValidationError] = useState<string>('');
    const [propertyValidationError, setPropertyValidationError] = useState<string>('');
    const [unitNameValidationError, setUnitNameValidationError] = useState<string>('');
    const [availableProperties, setAvailableProperties] = useState<PropertyInfoWithoutInsurance[]>([]);
    const [selectedCityId, setSelectedCityId] = useState<string>('');
    
    const [calendarStates, setCalendarStates] = useState({
        lease_start: false,
        lease_end: false,
        insurance_expiration_date: false,
    });

    const setCalendarOpen = (field: keyof typeof calendarStates, open: boolean) => {
        setCalendarStates((prev) => ({ ...prev, [field]: open }));
    };

    const { data, setData, post, processing, errors, reset, transform } = useForm({
        property_id: '',
        unit_name: '',
        tenants: '',
        lease_start: '',
        lease_end: '',
        count_beds: '',
        count_baths: '',
        lease_status: '',
        is_new_lease: '',
        monthly_rent: '',
        recurring_transaction: '',
        utility_status: '',
        account_number: '',
        insurance: '',
        insurance_expiration_date: '',
    });

    // Filter properties when city is selected
    useEffect(() => {
        if (selectedCityId && properties) {
            const filteredProperties = properties.filter(
                property => property.city_id?.toString() === selectedCityId
            );
            setAvailableProperties(filteredProperties);
            
            // Reset property selection if current property is not in the filtered list
            if (data.property_id && !filteredProperties.find(p => p.id.toString() === data.property_id)) {
                setData('property_id', '');
            }
        } else {
            setAvailableProperties([]);
            setData('property_id', '');
        }
    }, [selectedCityId, properties]);

    const handleCityChange = (cityId: string) => {
        setSelectedCityId(cityId);
        setValidationError('');
        setPropertyValidationError('');
    };

    const handlePropertyChange = (propertyId: string) => {
        setData('property_id', propertyId);
        setPropertyValidationError('');
    };

    const handleUnitNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData('unit_name', e.target.value);
        setUnitNameValidationError('');
    };

    // Auto-clear insurance expiration date when insurance is 'No'
    useEffect(() => {
        if (data.insurance === 'No') {
            setData('insurance_expiration_date', '');
            setCalendarOpen('insurance_expiration_date', false);
        }
    }, [data.insurance]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Clear any previous validation errors
        setValidationError('');
        setPropertyValidationError('');
        setUnitNameValidationError('');
        
        let hasValidationErrors = false;
        
        // Validate property_id is not empty
        if (!data.property_id || data.property_id.trim() === '') {
            setPropertyValidationError('Please select a property before submitting the form.');
            if (propertyRef.current) {
                propertyRef.current.focus();
                propertyRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            hasValidationErrors = true;
        }
        
        // Validate unit name is not empty
        if (!data.unit_name || data.unit_name.trim() === '') {
            setUnitNameValidationError('Please enter a unit name before submitting the form.');
            if (unitNameRef.current) {
                unitNameRef.current.focus();
                unitNameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            hasValidationErrors = true;
        }
        
        if (hasValidationErrors) {
            return;
        }

        // Ensure insurance expiration date is null when insurance is 'No'
        if (data.insurance === 'No' && data.insurance_expiration_date !== '') {
            setData('insurance_expiration_date', '');
        }

        // Add redirect state into payload via transform to avoid typing issues
        transform((payload: UnitFormData) => ({
            ...payload,
            redirect: {
                filters: redirectState.filters,
                per_page: redirectState.per_page,
                page: redirectState.page,
            },
        }) as any);

        post(route('units.store'), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setValidationError('');
                setPropertyValidationError('');
                setUnitNameValidationError('');
                setAvailableProperties([]);
                setSelectedCityId('');
                setCalendarStates({
                    lease_start: false,
                    lease_end: false,
                    insurance_expiration_date: false,
                });
                onOpenChange(false);
                onSuccess?.();
            },
        });
    };

    const handleCancel = () => {
        reset();
        setValidationError('');
        setPropertyValidationError('');
        setUnitNameValidationError('');
        setAvailableProperties([]);
        setSelectedCityId('');
        setCalendarStates({
            lease_start: false,
            lease_end: false,
            insurance_expiration_date: false,
        });
        onOpenChange(false);
    };

    return (
        <Drawer open={open} onOpenChange={onOpenChange} modal={false}>
            <DrawerContent size="half" title="Create New Unit">
                <div className="flex h-full flex-col">
                    <div className="flex-1 overflow-auto p-6">
                        <form onSubmit={submit} className="space-y-4">
                            <CitySelection
                                cities={cities}
                                selectedCityId={selectedCityId}
                                onCityChange={handleCityChange}
                                validationError={validationError}
                            />

                            <PropertySelection
                                ref={propertyRef}
                                availableProperties={availableProperties}
                                selectedCityId={selectedCityId}
                                propertyId={data.property_id}
                                onPropertyChange={handlePropertyChange}
                                error={errors.property_id}
                                validationError={propertyValidationError}
                            />

                            <UnitDetails
                                ref={unitNameRef}
                                unitName={data.unit_name}
                                onUnitNameChange={handleUnitNameChange}
                                error={errors.unit_name}
                                validationError={unitNameValidationError}
                            />

                            <TenantDetails
                                tenants={data.tenants}
                                onTenantsChange={(value) => setData('tenants', value)}
                                error={errors.tenants}
                            />

                            <LeaseDates
                                leaseStart={data.lease_start}
                                leaseEnd={data.lease_end}
                                calendarStates={calendarStates}
                                onLeaseStartChange={(value) => setData('lease_start', value)}
                                onLeaseEndChange={(value) => setData('lease_end', value)}
                                onCalendarOpenChange={setCalendarOpen}
                                errors={errors}
                            />

                            <UnitSpecifications
                                countBeds={data.count_beds}
                                countBaths={data.count_baths}
                                onCountBedsChange={(value) => setData('count_beds', value)}
                                onCountBathsChange={(value) => setData('count_baths', value)}
                                errors={errors}
                            />

                            <LeaseStatus
                                leaseStatus={data.lease_status}
                                onLeaseStatusChange={(value) => setData('lease_status', value)}
                                error={errors.lease_status}
                            />

                            <NewLease
                                isNewLease={data.is_new_lease}
                                onIsNewLeaseChange={(value) => setData('is_new_lease', value)}
                                error={errors.is_new_lease}
                            />

                            <FinancialInformation
                                monthlyRent={data.monthly_rent}
                                recurringTransaction={data.recurring_transaction}
                                onMonthlyRentChange={(value) => setData('monthly_rent', value)}
                                onRecurringTransactionChange={(value) => setData('recurring_transaction', value)}
                                errors={errors}
                            />

                            <UtilityInformation
                                utilityStatus={data.utility_status}
                                accountNumber={data.account_number}
                                onUtilityStatusChange={(value) => setData('utility_status', value)}
                                onAccountNumberChange={(value) => setData('account_number', value)}
                                errors={errors}
                            />

                            <InsuranceInformation
                                insurance={data.insurance}
                                insuranceExpirationDate={data.insurance_expiration_date}
                                calendarOpen={calendarStates.insurance_expiration_date}
                                onInsuranceChange={(value) => setData('insurance', value)}
                                onInsuranceExpirationDateChange={(value) => setData('insurance_expiration_date', value)}
                                onCalendarOpenChange={(open) => setCalendarOpen('insurance_expiration_date', open)}
                                errors={errors}
                            />
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
                                {processing ? 'Creating...' : 'Create Unit'}
                            </Button>
                        </div>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
interface UnitFormData {
    property_id: string;
    unit_name: string;
    tenants: string;
    lease_start: string;
    lease_end: string;
    count_beds: string;
    count_baths: string;
    lease_status: string;
    is_new_lease: string;
    monthly_rent: string;
    recurring_transaction: string;
    utility_status: string;
    account_number: string;
    insurance: string;
    insurance_expiration_date: string;
}
