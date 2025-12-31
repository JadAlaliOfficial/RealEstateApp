import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ReversedPaymentsFieldProps {
    reversedPayments: string;
    onReversedPaymentsChange: (value: string) => void;
    error?: string;
}

export function ReversedPaymentsField({ 
    reversedPayments, 
    onReversedPaymentsChange, 
    error 
}: ReversedPaymentsFieldProps) {
    return (
        <div className="rounded-lg border-l-4 border-l-indigo-500 p-4">
            <div className="mb-2">
                <Label htmlFor="reversed_payments" className="text-base font-semibold">
                    Reversed Payments?
                </Label>
            </div>
            <Input
                id="reversed_payments"
                value={reversedPayments}
                onChange={(e) => onReversedPaymentsChange(e.target.value)}
                placeholder="Enter reversed payments information"
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
