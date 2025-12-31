import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radioGroup';

interface PermanentFieldProps {
    permanent: string;
    onPermanentChange: (value: string) => void;
    error?: string;
}

export function PermanentField({ permanent, onPermanentChange, error }: PermanentFieldProps) {
    return (
        <div className="rounded-lg border-l-4 border-l-teal-500 p-4">
            <div className="mb-2">
                <Label htmlFor="permanent" className="text-base font-semibold">
                    Permanent *
                </Label>
            </div>
            <RadioGroup
                value={permanent}
                onValueChange={onPermanentChange}
                name="permanent"
                options={[
                    { value: 'Yes', label: 'Yes' },
                    { value: 'No', label: 'No' },
                ]}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
