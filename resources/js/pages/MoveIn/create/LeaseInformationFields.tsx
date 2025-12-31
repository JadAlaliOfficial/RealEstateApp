import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radioGroup';
import { DatePickerField } from './DatePickerField';

interface LeaseInformationFieldsProps {
    signedLease: 'Yes' | 'No' | '';
    leaseSigningDate: string;
    moveInDate: string;
    onSignedLeaseChange: (value: 'Yes' | 'No' | '') => void;
    onLeaseSigningDateChange: (value: string) => void;
    onMoveInDateChange: (value: string) => void;
    errors: any;
}

export function LeaseInformationFields({
    signedLease,
    leaseSigningDate,
    moveInDate,
    onSignedLeaseChange,
    onLeaseSigningDateChange,
    onMoveInDateChange,
    errors,
}: LeaseInformationFieldsProps) {
    return (
        <>
            <div className="rounded-lg border-l-4 border-l-green-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="signed_lease" className="text-base font-semibold">
                        Signed Lease *
                    </Label>
                </div>
                <RadioGroup
                    value={signedLease}
                    onValueChange={(value) => onSignedLeaseChange(value as 'Yes' | 'No' | '')}
                    name="signed_lease"
                    options={[
                        { value: 'No', label: 'No' },
                        { value: 'Yes', label: 'Yes' },
                    ]}
                />
                {errors.signed_lease && <p className="mt-1 text-sm text-red-600">{errors.signed_lease}</p>}
            </div>

            <DatePickerField
                label="Lease Signing Date"
                value={leaseSigningDate}
                onChange={onLeaseSigningDateChange}
                error={errors.lease_signing_date}
                borderColor="border-l-purple-500"
            />

            <DatePickerField
                label="Move-In Date"
                value={moveInDate}
                onChange={onMoveInDateChange}
                error={errors.move_in_date}
                borderColor="border-l-orange-500"
            />
        </>
    );
}
