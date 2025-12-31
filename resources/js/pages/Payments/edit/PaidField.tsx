import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';


interface PaidFieldProps {
    data: any;
    setData: (data: any) => void;
    errors: any;
}


export default function PaidField({ data, setData, errors }: PaidFieldProps) {
    return (
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
                value={data.paid}
                onChange={(e) => setData((prev: any) => ({ ...prev, paid: e.target.value }))}
                placeholder="Enter amount paid"
            />
            {errors.paid && <p className="mt-1 text-sm text-red-600">{errors.paid}</p>}
        </div>
    );
}
