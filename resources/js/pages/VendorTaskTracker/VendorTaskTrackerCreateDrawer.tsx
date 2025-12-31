import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerFooter } from '@/components/ui/drawer';
import { VendorTaskTrackerFormData } from '@/types/vendor-task-tracker';
import { useForm } from '@inertiajs/react';
import React, { useState, useRef } from 'react';
import CitySection from './create/CitySection';
import PropertySection from './create/PropertySection';
import UnitSection from './create/UnitSection';
import VendorSection from './create/VendorSection';
import TaskSubmissionDateSection from './create/TaskSubmissionDateSection';
import ScheduledVisitsSection from './create/ScheduledVisitsSection';
import TaskEndingDateSection from './create/TaskEndingDateSection';
import AssignedTasksSection from './create/AssignedTasksSection';
import NotesSection from './create/NotesSection';
import StatusSection from './create/StatusSection';
import UrgencySection from './create/UrgencySection';

interface CityOption {
    id: number;
    city: string;
}

interface PropertyOption {
    id: number;
    property_name: string;
    city?: string;
}

interface UnitOption {
    id: number;
    unit_name: string;
    property_name?: string;
    city?: string;
}

interface VendorOption {
    id: number;
    vendor_name: string;
    city?: string;
}

interface Props {
    cities: CityOption[];
    properties: PropertyOption[];
    units: UnitOption[];
    vendors: VendorOption[];
    unitsByCity: Record<string, UnitOption[]>;
    propertiesByCity: Record<string, PropertyOption[]>;
    unitsByProperty: Record<string, Record<string, UnitOption[]>>;
    vendorsByCity: Record<string, VendorOption[]>;
    filters: {
        search?: string;
        city?: string;
        property?: string;
        unit_name?: string;
        vendor_name?: string;
        status?: string;
        per_page?: string;
        page?: number;
    };
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export default function VendorTaskTrackerCreateDrawer({ 
    cities,
    vendors,
    propertiesByCity,
    unitsByProperty,
    filters,
    open, 
    onOpenChange, 
    onSuccess 
}: Props) {
    const cityRef = useRef<HTMLButtonElement>(null!);
    const unitRef = useRef<HTMLButtonElement>(null!);
    const vendorRef = useRef<HTMLButtonElement>(null!);
    const taskSubmissionDateRef = useRef<HTMLButtonElement>(null!);
    const assignedTasksRef = useRef<HTMLTextAreaElement>(null!);
    
    const [validationError, setValidationError] = useState<string>('');
    const [unitValidationError, setUnitValidationError] = useState<string>('');
    const [vendorValidationError, setVendorValidationError] = useState<string>('');
    const [taskSubmissionDateValidationError, setTaskSubmissionDateValidationError] = useState<string>('');
    const [assignedTasksValidationError, setAssignedTasksValidationError] = useState<string>('');
    const [availableUnits, setAvailableUnits] = useState<UnitOption[]>([]);
    const [availableProperties, setAvailableProperties] = useState<PropertyOption[]>([]);
    const [availableVendors, setAvailableVendors] = useState<VendorOption[]>([]);
    
    const [calendarStates, setCalendarStates] = useState({
        task_submission_date: false,
        any_scheduled_visits: false,
        task_ending_date: false,
    });

    const setCalendarOpen = (field: keyof typeof calendarStates, open: boolean) => {
        setCalendarStates((prev) => ({ ...prev, [field]: open }));
    };

    const { data, setData, post, processing, errors, reset, transform } = useForm<VendorTaskTrackerFormData>({
        vendor_id: '',
        unit_id: '',
        task_submission_date: '',
        assigned_tasks: '',
        any_scheduled_visits: '',
        notes: '',
        task_ending_date: '',
        status: '',
        urgent: 'No',
    });

    const [selectedCity, setSelectedCity] = useState<string>('');
    const [selectedProperty, setSelectedProperty] = useState<string>('');
    const [, setSelectedUnit] = useState<string>('');
    const [, setSelectedVendor] = useState<string>('');

    const handleCityChange = (cityName: string) => {
        setSelectedCity(cityName);
        setSelectedProperty('');
        setSelectedUnit('');
        setSelectedVendor('');
        setData('unit_id', '');
        setData('vendor_id', '');
        setValidationError('');
        setUnitValidationError('');
        setVendorValidationError('');

        if (cityName) {
            if (propertiesByCity[cityName]) {
                setAvailableProperties(propertiesByCity[cityName]);
            } else {
                setAvailableProperties([]);
            }

            // Set all vendors available regardless of city
            setAvailableVendors(vendors);
        } else {
            setAvailableProperties([]);
            setAvailableVendors([]);
        }

        setAvailableUnits([]);
    };

    const handlePropertyChange = (propertyName: string) => {
        setSelectedProperty(propertyName);
        setSelectedUnit('');
        setData('unit_id', '');
        setUnitValidationError('');

        if (selectedCity && propertyName && unitsByProperty[selectedCity] && unitsByProperty[selectedCity][propertyName]) {
            setAvailableUnits(unitsByProperty[selectedCity][propertyName]);
        } else {
            setAvailableUnits([]);
        }
    };

    const handleUnitChange = (unitId: string) => {
        const selectedUnitOption = availableUnits.find(unit => unit.id.toString() === unitId);
        if (selectedUnitOption) {
            setSelectedUnit(selectedUnitOption.unit_name);
            setData('unit_id', unitId);
            setUnitValidationError('');
        }
    };

    const handleVendorChange = (vendorId: string) => {
        const selectedVendorOption = availableVendors.find(vendor => vendor.id.toString() === vendorId);
        if (selectedVendorOption) {
            setSelectedVendor(selectedVendorOption.vendor_name);
            setData('vendor_id', vendorId);
            setVendorValidationError('');
        }
    };

    const handleAssignedTasksChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setData('assigned_tasks', e.target.value);
        setAssignedTasksValidationError('');
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        setValidationError('');
        setUnitValidationError('');
        setVendorValidationError('');
        setTaskSubmissionDateValidationError('');
        setAssignedTasksValidationError('');
        
        let hasValidationErrors = false;
        
        if (!selectedCity || selectedCity.trim() === '') {
            setValidationError('Please select a city before submitting the form.');
            if (cityRef.current) {
                cityRef.current.focus();
                cityRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            hasValidationErrors = true;
        }
        
        if (!data.unit_id || data.unit_id.trim() === '') {
            setUnitValidationError('Please select a unit before submitting the form.');
            if (unitRef.current) {
                unitRef.current.focus();
                unitRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            hasValidationErrors = true;
        }
        
        if (!data.vendor_id || data.vendor_id.trim() === '') {
            setVendorValidationError('Please select a vendor before submitting the form.');
            if (vendorRef.current) {
                vendorRef.current.focus();
                vendorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            hasValidationErrors = true;
        }
        
        if (!data.task_submission_date || data.task_submission_date.trim() === '') {
            setTaskSubmissionDateValidationError('Please select a task submission date before submitting the form.');
            if (taskSubmissionDateRef.current) {
                taskSubmissionDateRef.current.focus();
                taskSubmissionDateRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            hasValidationErrors = true;
        }
        
        if (!data.assigned_tasks || data.assigned_tasks.trim() === '') {
            setAssignedTasksValidationError('Please enter assigned tasks before submitting the form.');
            if (assignedTasksRef.current) {
                assignedTasksRef.current.focus();
                assignedTasksRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            hasValidationErrors = true;
        }
        
        if (hasValidationErrors) {
            return;
        }
        
        transform((current) => ({
            ...current,
            redirect_filters: {
                ...filters,
            },
        }));

        post(route('vendor-task-tracker.store'), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setSelectedCity('');
                setSelectedProperty('');
                setSelectedUnit('');
                setSelectedVendor('');
                setValidationError('');
                setUnitValidationError('');
                setVendorValidationError('');
                setTaskSubmissionDateValidationError('');
                setAssignedTasksValidationError('');
                setAvailableUnits([]);
                setAvailableProperties([]);
                setAvailableVendors([]);
                setCalendarStates({
                    task_submission_date: false,
                    any_scheduled_visits: false,
                    task_ending_date: false,
                });
                onOpenChange(false);
                onSuccess?.();
            },
        });
    };

    const handleCancel = () => {
        reset();
        setSelectedCity('');
        setSelectedProperty('');
        setSelectedUnit('');
        setSelectedVendor('');
        setValidationError('');
        setUnitValidationError('');
        setVendorValidationError('');
        setTaskSubmissionDateValidationError('');
        setAssignedTasksValidationError('');
        setAvailableUnits([]);
        setAvailableProperties([]);
        setAvailableVendors([]);
        setCalendarStates({
            task_submission_date: false,
            any_scheduled_visits: false,
            task_ending_date: false,
        });
        onOpenChange(false);
    };

    return (
        <Drawer open={open} onOpenChange={onOpenChange} modal={false}>
            <DrawerContent size="half" title="Create New Vendor Task">
                <div className="flex h-full flex-col">
                    <div className="flex-1 overflow-auto p-6">
                        <form onSubmit={submit} className="space-y-4">
                            <CitySection
                                cities={cities}
                                selectedCity={selectedCity}
                                onCityChange={handleCityChange}
                                cityRef={cityRef}
                                errors={errors}
                                validationError={validationError}
                            />

                            <PropertySection
                                availableProperties={availableProperties}
                                selectedProperty={selectedProperty}
                                selectedCity={selectedCity}
                                onPropertyChange={handlePropertyChange}
                            />

                            <UnitSection
                                availableUnits={availableUnits}
                                selectedProperty={selectedProperty}
                                unitId={data.unit_id}
                                onUnitChange={handleUnitChange}
                                unitRef={unitRef}
                                errors={errors}
                                validationError={unitValidationError}
                            />

                            <VendorSection
                                availableVendors={availableVendors}
                                selectedCity={selectedCity}
                                vendorId={data.vendor_id}
                                onVendorChange={handleVendorChange}
                                vendorRef={vendorRef}
                                errors={errors}
                                validationError={vendorValidationError}
                            />

                            <TaskSubmissionDateSection
                                taskSubmissionDate={data.task_submission_date}
                                calendarOpen={calendarStates.task_submission_date}
                                onCalendarOpenChange={(open) => setCalendarOpen('task_submission_date', open)}
                                onDateChange={(date) => {
                                    setData('task_submission_date', date);
                                    setTaskSubmissionDateValidationError('');
                                }}
                                taskSubmissionDateRef={taskSubmissionDateRef}
                                errors={errors}
                                validationError={taskSubmissionDateValidationError}
                            />

                            <ScheduledVisitsSection
                                scheduledVisits={data.any_scheduled_visits}
                                calendarOpen={calendarStates.any_scheduled_visits}
                                onCalendarOpenChange={(open) => setCalendarOpen('any_scheduled_visits', open)}
                                onDateChange={(date) => setData('any_scheduled_visits', date)}
                                errors={errors}
                            />

                            <TaskEndingDateSection
                                taskEndingDate={data.task_ending_date}
                                calendarOpen={calendarStates.task_ending_date}
                                onCalendarOpenChange={(open) => setCalendarOpen('task_ending_date', open)}
                                onDateChange={(date) => setData('task_ending_date', date)}
                                errors={errors}
                            />

                            <AssignedTasksSection
                                assignedTasks={data.assigned_tasks}
                                onAssignedTasksChange={handleAssignedTasksChange}
                                assignedTasksRef={assignedTasksRef}
                                errors={errors}
                                validationError={assignedTasksValidationError}
                            />

                            <NotesSection
                                notes={data.notes}
                                onNotesChange={(e) => setData('notes', e.target.value)}
                                errors={errors}
                            />

                            <StatusSection
                                status={data.status}
                                onStatusChange={(value) => setData('status', value)}
                                errors={errors}
                            />

                            <UrgencySection
                                urgent={data.urgent}
                                onUrgentChange={(value) => setData('urgent', value as "Yes" | "No")}
                                errors={errors}
                            />
                        </form>
                    </div>

                    <DrawerFooter>
                        <div className="flex gap-2">
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
                                {processing ? 'Creating...' : 'Create Task'}
                            </Button>
                        </div>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
