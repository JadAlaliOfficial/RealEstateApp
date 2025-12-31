import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radioGroup';
import { DatePickerField } from './DatePickerField';

interface InsuranceInformationFieldsProps {
    submittedInsurance: 'Yes' | 'No' | '';
    dateOfInsuranceExpiration: string;
    onSubmittedInsuranceChange: (value: 'Yes' | 'No' | '') => void;
    onDateOfInsuranceExpirationChange: (value: string) => void;
    errors: any;
}

export function InsuranceInformationFields({
    submittedInsurance,
    dateOfInsuranceExpiration,
    onSubmittedInsuranceChange,
    onDateOfInsuranceExpirationChange,
    errors,
}: InsuranceInformationFieldsProps) {
    return (
        <>
            <div className="rounded-lg border-l-4 border-l-cyan-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="submitted_insurance" className="text-base font-semibold">
                        Submitted Insurance
                    </Label>
                </div>
                <RadioGroup
                    value={submittedInsurance}
                    onValueChange={(value) => onSubmittedInsuranceChange(value as 'Yes' | 'No' | '')}
                    name="submitted_insurance"
                    options={[
                        { value: 'No', label: 'No' },
                        { value: 'Yes', label: 'Yes' },
                    ]}
                />
                {errors.submitted_insurance && <p className="mt-1 text-sm text-red-600">{errors.submitted_insurance}</p>}
            </div>
            {submittedInsurance === 'Yes' && (
                <DatePickerField
                    label="Date of Insurance Expiration"
                    value={dateOfInsuranceExpiration}
                    onChange={onDateOfInsuranceExpirationChange}
                    error={errors.date_of_insurance_expiration}
                    borderColor="border-l-violet-500"
                />
            )}
        </>
    );
}
