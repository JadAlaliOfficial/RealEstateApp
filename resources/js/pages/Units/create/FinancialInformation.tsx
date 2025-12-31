import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
    monthlyRent: string;
    recurringTransaction: string;
    onMonthlyRentChange: (value: string) => void;
    onRecurringTransactionChange: (value: string) => void;
    errors: {
        monthly_rent?: string;
        recurring_transaction?: string;
    };
}

export default function FinancialInformation({
    monthlyRent,
    recurringTransaction,
    onMonthlyRentChange,
    onRecurringTransactionChange,
    errors
}: Props) {
    return (
        <>
            <div className="rounded-lg border-l-4 border-l-red-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="monthly_rent" className="text-base font-semibold">
                        Monthly Rent
                    </Label>
                </div>
                <Input
                    id="monthly_rent"
                    type="number"
                    step="0.01"
                    min="0"
                    value={monthlyRent}
                    onChange={(e) => onMonthlyRentChange(e.target.value)}
                    placeholder="Enter monthly rent amount"
                />
                {errors.monthly_rent && <p className="mt-1 text-sm text-red-600">{errors.monthly_rent}</p>}
            </div>

            <div className="rounded-lg border-l-4 border-l-yellow-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="recurring_transaction" className="text-base font-semibold">
                        Recurring Transaction
                    </Label>
                </div>
                <Input
                    id="recurring_transaction"
                    value={recurringTransaction}
                    onChange={(e) => onRecurringTransactionChange(e.target.value)}
                    placeholder="Enter recurring transaction details"
                />
                {errors.recurring_transaction && <p className="mt-1 text-sm text-red-600">{errors.recurring_transaction}</p>}
            </div>
        </>
    );
}
