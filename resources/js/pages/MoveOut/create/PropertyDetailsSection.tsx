import { MoveOutFormData } from '@/types/move-out';
import FormField from './FormField';
import RadioGroupField from './RadioGroupField';
import TextAreaField from './TextAreaField';
import TextInputField from './TextInputField';
import DatePickerField from './DatePickerField';
import { format } from 'date-fns';
import { useState } from 'react';

interface Props {
    data: MoveOutFormData;
    errors: Partial<Record<keyof MoveOutFormData, string>>;
    onDataChange: (field: keyof MoveOutFormData, value: any) => void;
}

export default function PropertyDetailsSection({ data, errors, onDataChange }: Props) {
    const [isDateUtilityOpen, setIsDateUtilityOpen] = useState(false);
    return (
        <>
            <FormField label="Lease Status" borderColor="yellow" error={errors.lease_status}>
                <TextInputField
                    id="lease_status"
                    value={data.lease_status}
                    onChange={(e) => onDataChange('lease_status', e.target.value)}
                    placeholder="Enter lease status"
                />
            </FormField>

            <FormField label="Keys Location" borderColor="cyan" error={errors.keys_location}>
                <TextInputField
                    id="keys_location"
                    value={data.keys_location}
                    onChange={(e) => onDataChange('keys_location', e.target.value)}
                    placeholder="Enter keys location"
                />
            </FormField>

            <FormField label="Utilities Under Our Name" borderColor="indigo" error={errors.utilities_under_our_name}>
                <RadioGroupField
                    value={data.utilities_under_our_name}
                    onValueChange={(value) => onDataChange('utilities_under_our_name', value as '' | 'Yes' | 'No')}
                    name="utilities_under_our_name"
                    options={[
                        { value: 'Yes', label: 'Yes' },
                        { value: 'No', label: 'No' },
                    ]}
                />
            </FormField>

            <FormField label="Date Utility Put Under Our Name" borderColor="pink" error={errors.date_utility_put_under_our_name}>
                <DatePickerField
                    value={data.date_utility_put_under_our_name}
                    isOpen={isDateUtilityOpen}
                    onOpenChange={() => setIsDateUtilityOpen(!isDateUtilityOpen)}
                    onDateSelect={(date) => {
                        if (date) {
                            onDataChange('date_utility_put_under_our_name', format(date, 'yyyy-MM-dd'));
                            setIsDateUtilityOpen(false);
                        }
                    }}
                    onClear={() => {
                        onDataChange('date_utility_put_under_our_name', '');
                    }}
                />
            </FormField>

            <FormField label="Utility Type" borderColor="purple" error={errors.utility_type}>
                <TextAreaField
                    id="utility_type"
                    value={data.utility_type}
                    onChange={(e) => onDataChange('utility_type', e.target.value)}
                    placeholder="Enter utility type details"
                    minHeight="80px"
                />
            </FormField>

            <FormField label="Walkthrough" borderColor="emerald" error={errors.walkthrough}>
                <RadioGroupField
                    value={data.walkthrough}
                    onValueChange={(value) => onDataChange('walkthrough', value as '' | 'Yes' | 'No')}
                    name="walkthrough"
                    options={[
                        { value: 'Yes', label: 'Yes' },
                        { value: 'No', label: 'No' },
                    ]}
                />
            </FormField>

            <FormField label="All The Devices Are Off" borderColor="emerald" error={errors.all_the_devices_are_off}>
                <RadioGroupField
                    value={data.all_the_devices_are_off}
                    onValueChange={(value) => onDataChange('all_the_devices_are_off', value as '' | 'Yes' | 'No')}
                    name="all_the_devices_are_off"
                    options={[
                        { value: 'Yes', label: 'Yes' },
                        { value: 'No', label: 'No' },
                    ]}
                />
            </FormField>

            <FormField label="Repairs" borderColor="lime" error={errors.repairs}>
                <TextAreaField
                    id="repairs"
                    value={data.repairs}
                    onChange={(e) => onDataChange('repairs', e.target.value)}
                    placeholder="Enter repair details"
                    minHeight="80px"
                />
            </FormField>

            <FormField label="Send Back Security Deposit" borderColor="amber" error={errors.send_back_security_deposit}>
                <TextInputField
                    id="send_back_security_deposit"
                    value={data.send_back_security_deposit}
                    onChange={(e) => onDataChange('send_back_security_deposit', e.target.value)}
                    placeholder="Enter security deposit details"
                />
            </FormField>

            <FormField label="Notes" borderColor="slate" error={errors.notes}>
                <TextAreaField
                    id="notes"
                    value={data.notes}
                    onChange={(e) => onDataChange('notes', e.target.value)}
                    placeholder="Enter additional notes"
                    minHeight="100px"
                />
            </FormField>
        </>
    );
}
