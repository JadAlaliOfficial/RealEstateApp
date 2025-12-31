import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radioGroup';
import { DatePickerField } from './DatePickerField';

interface PaymentInformationFieldsProps {
    paidSecurityDeposit: 'Yes' | 'No' | '';
    scheduledPaidTime: string;
    onPaidSecurityDepositChange: (value: 'Yes' | 'No' | '') => void;
    onScheduledPaidTimeChange: (value: string) => void;
    errors: any;
}

export function PaymentInformationFields({
    paidSecurityDeposit,
    scheduledPaidTime,
    onPaidSecurityDepositChange,
    onScheduledPaidTimeChange,
    errors,
}: PaymentInformationFieldsProps) {
    return (
        <>
            <div className="rounded-lg border-l-4 border-l-emerald-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="paid_security_deposit_first_month_rent" className="text-base font-semibold">
                        Paid Security Deposit & First Month Rent
                    </Label>
                </div>
                <RadioGroup
                    value={paidSecurityDeposit}
                    onValueChange={(value) => onPaidSecurityDepositChange(value as 'Yes' | 'No' | '')}
                    name="paid_security_deposit_first_month_rent"
                    options={[
                        { value: 'No', label: 'No' },
                        { value: 'Yes', label: 'Yes' },
                    ]}
                />
                {errors.paid_security_deposit_first_month_rent && (
                    <p className="mt-1 text-sm text-red-600">{errors.paid_security_deposit_first_month_rent}</p>
                )}
            </div>

            <DatePickerField
                label="Scheduled Paid Time"
                value={scheduledPaidTime}
                onChange={onScheduledPaidTimeChange}
                error={errors.scheduled_paid_time}
                borderColor="border-l-teal-500"
            />
        </>
    );
}
