import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radioGroup';

interface Props {
    isNewLease: string;
    onIsNewLeaseChange: (value: string) => void;
    error?: string;
}

export default function NewLease({ isNewLease, onIsNewLeaseChange, error }: Props) {
    return (
        <div className="rounded-lg border-l-4 border-l-pink-500 p-4">
            <div className="mb-2">
                <Label htmlFor="is_new_lease" className="text-base font-semibold">
                    New Lease
                </Label>
            </div>
            <RadioGroup
                value={isNewLease}
                onValueChange={onIsNewLeaseChange}
                name="is_new_lease"
                options={[
                    { value: 'Yes', label: 'Yes' },
                    { value: 'No', label: 'No' }
                ]}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}