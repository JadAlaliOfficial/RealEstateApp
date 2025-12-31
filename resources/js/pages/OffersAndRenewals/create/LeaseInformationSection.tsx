import DatePickerField from './DatePickerField';
import RadioGroupField from './RadioGroupField';

interface LeaseInformationSectionProps {
    leaseSent: string;
    dateSentLease: string | null;
    leaseSigned: string;
    dateSigned: string | null;
    onLeaseSentChange: (value: string) => void;
    onDateSentLeaseChange: (date: string | null) => void;
    onLeaseSignedChange: (value: string) => void;
    onDateSignedChange: (date: string | null) => void;
    errors: {
        lease_sent?: string;
        date_sent_lease?: string;
        lease_signed?: string;
        date_signed?: string;
    };
    calendarStates: {
        date_sent_lease: boolean;
        date_signed: boolean;
    };
    onCalendarOpenChange: (field: 'date_sent_lease' | 'date_signed', open: boolean) => void;
}

export default function LeaseInformationSection({
    leaseSent,
    dateSentLease,
    leaseSigned,
    dateSigned,
    onLeaseSentChange,
    onDateSentLeaseChange,
    onLeaseSignedChange,
    onDateSignedChange,
    errors,
    calendarStates,
    onCalendarOpenChange,
}: LeaseInformationSectionProps) {
    return (
        <>
            <RadioGroupField
                label="Lease Sent?"
                value={leaseSent}
                onChange={onLeaseSentChange}
                options={[
                    { value: 'Yes', label: 'Yes' },
                    { value: 'No', label: 'No' }
                ]}
                error={errors.lease_sent}
                borderColor="border-l-red-500"
                name="lease_sent"
            />

            <DatePickerField
                label="Date Sent Lease"
                value={dateSentLease}
                onChange={onDateSentLeaseChange}
                error={errors.date_sent_lease}
                isOpen={calendarStates.date_sent_lease}
                onOpenChange={(open) => onCalendarOpenChange('date_sent_lease', open)}
                borderColor="border-l-yellow-500"
            />

            <RadioGroupField
                label="Lease Signed?"
                value={leaseSigned}
                onChange={onLeaseSignedChange}
                options={[
                    { value: 'Signed', label: 'Signed' },
                    { value: 'Unsigned', label: 'Unsigned' }
                ]}
                error={errors.lease_signed}
                borderColor="border-l-cyan-500"
                name="lease_signed"
            />

            <DatePickerField
                label="Date Signed"
                value={dateSigned}
                onChange={onDateSignedChange}
                error={errors.date_signed}
                isOpen={calendarStates.date_signed}
                onOpenChange={(open) => onCalendarOpenChange('date_signed', open)}
                borderColor="border-l-violet-500"
            />
        </>
    );
}
