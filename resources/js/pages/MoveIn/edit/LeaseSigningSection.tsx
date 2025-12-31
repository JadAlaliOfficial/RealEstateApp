import FormSection from './FormSection';
import RadioGroupField from './RadioGroupField';
import DatePickerField from './DatePickerField';

interface LeaseSigningSectionProps {
    signedLease: 'Yes' | 'No' | '';
    onSignedLeaseChange: (value: 'Yes' | 'No' | '') => void;
    leaseSigningDate: string;
    onLeaseSigningDateChange: (date: string) => void;
    isCalendarOpen: boolean;
    onCalendarOpenChange: (open: boolean) => void;
    signedLeaseError?: string;
    dateError?: string;
}

export default function LeaseSigningSection({
    signedLease,
    onSignedLeaseChange,
    leaseSigningDate,
    onLeaseSigningDateChange,
    isCalendarOpen,
    onCalendarOpenChange,
    signedLeaseError,
    dateError
}: LeaseSigningSectionProps) {
    return (
        <>
            <FormSection 
                label="Signed Lease" 
                borderColor="border-l-green-500" 
                error={signedLeaseError}
                required
            >
                <RadioGroupField
                    value={signedLease}
                    onChange={onSignedLeaseChange}
                    name="signed_lease"
                />
            </FormSection>

            <FormSection 
                label="Lease Signing Date" 
                borderColor="border-l-purple-500" 
                error={dateError}
            >
                <DatePickerField
                    value={leaseSigningDate}
                    onChange={onLeaseSigningDateChange}
                    isOpen={isCalendarOpen}
                    onOpenChange={onCalendarOpenChange}
                />
            </FormSection>
        </>
    );
}
