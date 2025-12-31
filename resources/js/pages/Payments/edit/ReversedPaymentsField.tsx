import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ReversedPaymentsFieldProps {
    data: any;
    setData: (data: any) => void;
    errors: any;
}

export default function ReversedPaymentsField({ data, setData, errors }: ReversedPaymentsFieldProps) {
    return (
        <div className="rounded-lg border-l-4 border-l-indigo-500 p-4">
            <div className="mb-2">
                <Label htmlFor="reversed_payments" className="text-base font-semibold">
                    Reversed Payments?
                </Label>
            </div>
            <Input
                id="reversed_payments"
                value={data.reversed_payments}
                onChange={(e) => setData((prev: any) => ({ ...prev, reversed_payments: e.target.value }))}
                placeholder="Enter reversed payments information"
            />
            {errors.reversed_payments && <p className="mt-1 text-sm text-red-600">{errors.reversed_payments}</p>}
        </div>
    );
}
