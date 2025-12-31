import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FormSection from './FormSection';

interface FinancialFieldsProps {
    monthlyRent: string;
    onMonthlyRentChange: (value: string) => void;
    monthlyRentError?: string;
    recurringTransaction: string;
    onRecurringTransactionChange: (value: string) => void;
    recurringTransactionError?: string;
}

export default function FinancialFields({
    monthlyRent,
    onMonthlyRentChange,
    monthlyRentError,
    recurringTransaction,
    onRecurringTransactionChange,
    recurringTransactionError,
}: FinancialFieldsProps) {
    return (
        <>
            {/* Monthly Rent */}
            <FormSection borderColor="border-l-red-500">
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
                    placeholder="0.00"
                />
                {monthlyRentError && <p className="mt-1 text-sm text-red-600">{monthlyRentError}</p>}
            </FormSection>

            {/* Recurring Transaction */}
            <FormSection borderColor="border-l-yellow-500">
                <div className="mb-2">
                    <Label htmlFor="recurring_transaction" className="text-base font-semibold">
                        Recurring Transaction
                    </Label>
                </div>
                <Input
                    id="recurring_transaction"
                    value={recurringTransaction}
                    onChange={(e) => onRecurringTransactionChange(e.target.value)}
                    placeholder="Transaction details"
                />
                {recurringTransactionError && <p className="mt-1 text-sm text-red-600">{recurringTransactionError}</p>}
            </FormSection>
        </>
    );
}
