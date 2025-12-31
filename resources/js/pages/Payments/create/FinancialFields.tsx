import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


interface FinancialFieldsProps {
    owes: string;
    paid: string;
    onOwesChange: (value: string) => void;
    onPaidChange: (value: string) => void;
    owesError?: string;
    paidError?: string;
    owesValidationError?: string;
}


export function FinancialFields({ 
    owes, 
    paid, 
    onOwesChange, 
    onPaidChange, 
    owesError, 
    paidError, 
    owesValidationError 
}: FinancialFieldsProps) {
    return (
        <>
            <div className="rounded-lg border-l-4 border-l-orange-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="owes" className="text-base font-semibold">
                        Owes *
                    </Label>
                </div>
                <Input
                    id="owes"
                    type="number"
                    step="0.01"
                    min="0"
                    value={owes}
                    onChange={(e) => onOwesChange(e.target.value)}
                    placeholder="Enter amount owed"
                />
                {owesError && <p className="mt-1 text-sm text-red-600">{owesError}</p>}
                {owesValidationError && <p className="mt-1 text-sm text-red-600">{owesValidationError}</p>}
            </div>

            <div className="rounded-lg border-l-4 border-l-emerald-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="paid" className="text-base font-semibold">
                        Paid
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">Can exceed amount owed (overpayment)</p>
                </div>
                <Input
                    id="paid"
                    type="number"
                    step="0.01"
                    min="0"
                    value={paid}
                    onChange={(e) => onPaidChange(e.target.value)}
                    placeholder="Enter amount paid"
                />
                {paidError && <p className="mt-1 text-sm text-red-600">{paidError}</p>}
            </div>
        </>
    );
}
