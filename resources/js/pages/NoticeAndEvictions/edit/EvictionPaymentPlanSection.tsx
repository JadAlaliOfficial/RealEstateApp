import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radioGroup';

interface Props {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export function EvictionPaymentPlanSection({ value, onChange, error }: Props) {
    return (
        <div className="rounded-lg border-l-4 border-l-cyan-500 p-4">
            <div className="mb-2">
                <Label htmlFor="evected_or_payment_plan" className="text-base font-semibold">
                    Evected Or Payment Plan
                </Label>
            </div>
            <RadioGroup
                value={value}
                onValueChange={onChange}
                name="evected_or_payment_plan"
                options={[
                    { value: 'Evected', label: 'Evected' },
                    { value: 'Payment Plan', label: 'Payment Plan' },
                ]}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
