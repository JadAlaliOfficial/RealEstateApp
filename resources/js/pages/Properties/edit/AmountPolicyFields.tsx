// resources/js/pages/Properties/edit/AmountPolicyFields.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, FileText } from 'lucide-react';

interface AmountPolicyFieldsProps {
    amountValue: string;
    policyNumberValue: string;
    onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPolicyNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    amountError?: string;
    policyNumberError?: string;
}

/**
 * Amount and policy number fields
 * Both fields are OPTIONAL - no validation needed, user can leave blank
 */
export default function AmountPolicyFields({
    amountValue,
    policyNumberValue,
    onAmountChange,
    onPolicyNumberChange,
    amountError,
    policyNumberError
}: AmountPolicyFieldsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Amount field - optional */}
            <div className="rounded-lg border-l-4 border-l-emerald-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="amount" className="text-base font-semibold">
                        <DollarSign className="h-4 w-4 inline mr-1" />
                        Amount (Optional)
                    </Label>
                </div>
                <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={amountValue}
                    onChange={onAmountChange}
                    placeholder="0.00"
                />
                {/* Only show backend validation errors if any */}
                {amountError && <p className="mt-1 text-sm text-red-600">{amountError}</p>}
            </div>

            {/* Policy number field - optional */}
            <div className="rounded-lg border-l-4 border-l-pink-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="policy_number" className="text-base font-semibold">
                        <FileText className="h-4 w-4 inline mr-1" />
                        Policy Number (Optional)
                    </Label>
                </div>
                <Input
                    id="policy_number"
                    value={policyNumberValue}
                    onChange={onPolicyNumberChange}
                    placeholder="Enter policy number"
                />
                {/* Only show backend validation errors if any */}
                {policyNumberError && (
                    <p className="mt-1 text-sm text-red-600">{policyNumberError}</p>
                )}
            </div>
        </div>
    );
}
