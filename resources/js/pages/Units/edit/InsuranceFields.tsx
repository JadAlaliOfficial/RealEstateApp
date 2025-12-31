import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radioGroup';
import DatePickerField from './DatePickerField';
import FormSection from './FormSection';

interface InsuranceFieldsProps {
    insurance: string;
    onInsuranceChange: (value: string) => void;
    insuranceError?: string;
    insuranceExpirationDate: string;
    onInsuranceExpirationDateChange: (value: string) => void;
    insuranceExpirationOpen: boolean;
    onInsuranceExpirationOpenChange: (open: boolean) => void;
    insuranceExpirationDateError?: string;
}

export default function InsuranceFields({
    insurance,
    onInsuranceChange,
    insuranceError,
    insuranceExpirationDate,
    onInsuranceExpirationDateChange,
    insuranceExpirationOpen,
    onInsuranceExpirationOpenChange,
    insuranceExpirationDateError,
}: InsuranceFieldsProps) {
    return (
        <>
            {/* Insurance */}
            <FormSection borderColor="border-l-violet-500">
                <div className="mb-2">
                    <Label htmlFor="insurance" className="text-base font-semibold">
                        Insurance
                    </Label>
                </div>
                <RadioGroup
                    value={insurance}
                    onValueChange={onInsuranceChange}
                    name="insurance"
                    options={[
                        { value: 'Yes', label: 'Yes' },
                        { value: 'No', label: 'No' }
                    ]}
                />
                {insuranceError && <p className="mt-1 text-sm text-red-600">{insuranceError}</p>}
            </FormSection>

            {/* Insurance Expiration Date */}
            {insurance === 'Yes' && (
                <DatePickerField
                    label="Insurance Expiration Date"
                    value={insuranceExpirationDate}
                    onChange={onInsuranceExpirationDateChange}
                    isOpen={insuranceExpirationOpen}
                    onOpenChange={onInsuranceExpirationOpenChange}
                    error={insuranceExpirationDateError}
                    borderColor="border-l-rose-500"
                />
            )}
        </>
    );
}
