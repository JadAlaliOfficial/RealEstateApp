import FormSection from './FormSection';
import RadioGroupField from './RadioGroupField';
import DatePickerField from './DatePickerField';

interface InsuranceSectionProps {
    submittedInsurance: 'Yes' | 'No' | '';
    onSubmittedInsuranceChange: (value: 'Yes' | 'No' | '') => void;
    dateOfInsuranceExpiration: string;
    onDateOfInsuranceExpirationChange: (date: string) => void;
    isCalendarOpen: boolean;
    onCalendarOpenChange: (open: boolean) => void;
    submittedError?: string;
    dateError?: string;
}

export default function InsuranceSection({
    submittedInsurance,
    onSubmittedInsuranceChange,
    dateOfInsuranceExpiration,
    onDateOfInsuranceExpirationChange,
    isCalendarOpen,
    onCalendarOpenChange,
    submittedError,
    dateError
}: InsuranceSectionProps) {
    return (
        <>
            <FormSection 
                label="Submitted Insurance" 
                borderColor="border-l-cyan-500" 
                error={submittedError}
            >
                <RadioGroupField
                    value={submittedInsurance}
                    onChange={onSubmittedInsuranceChange}
                    name="submitted_insurance"
                />
            </FormSection>
            {submittedInsurance === 'Yes' && (
                <FormSection 
                    label="Date of Insurance Expiration" 
                    borderColor="border-l-violet-500" 
                    error={dateError}
                >
                    <DatePickerField
                        value={dateOfInsuranceExpiration}
                        onChange={onDateOfInsuranceExpirationChange}
                        isOpen={isCalendarOpen}
                        onOpenChange={onCalendarOpenChange}
                    />
                </FormSection>
            )}
        </>
    );
}
