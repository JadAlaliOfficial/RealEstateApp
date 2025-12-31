import FormSection from './FormSection';
import RadioGroupField from './RadioGroupField';
import DatePickerField from './DatePickerField';

interface PaymentSectionProps {
    paidSecurityDeposit: 'Yes' | 'No' | '';
    onPaidSecurityDepositChange: (value: 'Yes' | 'No' | '') => void;
    scheduledPaidTime: string;
    onScheduledPaidTimeChange: (date: string) => void;
    isCalendarOpen: boolean;
    onCalendarOpenChange: (open: boolean) => void;
    paidError?: string;
    dateError?: string;
}

export default function PaymentSection({
    paidSecurityDeposit,
    onPaidSecurityDepositChange,
    scheduledPaidTime,
    onScheduledPaidTimeChange,
    isCalendarOpen,
    onCalendarOpenChange,
    paidError,
    dateError
}: PaymentSectionProps) {
    return (
        <>
            <FormSection 
                label="Paid Security Deposit & First Month Rent" 
                borderColor="border-l-emerald-500" 
                error={paidError}
            >
                <RadioGroupField
                    value={paidSecurityDeposit}
                    onChange={onPaidSecurityDepositChange}
                    name="paid_security_deposit_first_month_rent"
                />
            </FormSection>

            <FormSection 
                label="Scheduled Paid Time" 
                borderColor="border-l-teal-500" 
                error={dateError}
            >
                <DatePickerField
                    value={scheduledPaidTime}
                    onChange={onScheduledPaidTimeChange}
                    isOpen={isCalendarOpen}
                    onOpenChange={onCalendarOpenChange}
                />
            </FormSection>
        </>
    );
}
