import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FormSection from './FormSection';

interface UtilitiesFieldsProps {
    utilityStatus: string;
    onUtilityStatusChange: (value: string) => void;
    utilityStatusError?: string;
    accountNumber: string;
    onAccountNumberChange: (value: string) => void;
    accountNumberError?: string;
}

export default function UtilitiesFields({
    utilityStatus,
    onUtilityStatusChange,
    utilityStatusError,
    accountNumber,
    onAccountNumberChange,
    accountNumberError,
}: UtilitiesFieldsProps) {
    return (
        <>
            {/* Utility Status */}
            <FormSection borderColor="border-l-cyan-500">
                <div className="mb-2">
                    <Label htmlFor="utility_status" className="text-base font-semibold">
                        Utility Status
                    </Label>
                </div>
                <Input
                    id="utility_status"
                    value={utilityStatus}
                    onChange={(e) => onUtilityStatusChange(e.target.value)}
                    placeholder="e.g., Included, Tenant Responsible"
                />
                {utilityStatusError && <p className="mt-1 text-sm text-red-600">{utilityStatusError}</p>}
            </FormSection>

            {/* Account Number */}
            <FormSection borderColor="border-l-gray-500">
                <div className="mb-2">
                    <Label htmlFor="account_number" className="text-base font-semibold">
                        Account Number
                    </Label>
                </div>
                <Input
                    id="account_number"
                    value={accountNumber}
                    onChange={(e) => onAccountNumberChange(e.target.value)}
                    placeholder="Account or reference number"
                />
                {accountNumberError && <p className="mt-1 text-sm text-red-600">{accountNumberError}</p>}
            </FormSection>
        </>
    );
}
