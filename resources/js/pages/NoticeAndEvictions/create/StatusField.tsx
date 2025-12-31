import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radioGroup';

interface Props {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export default function StatusField({ value, onChange, error }: Props) {
    return (
        <div className="rounded-lg border-l-4 border-l-purple-500 p-4">
            <div className="mb-2">
                <Label htmlFor="status" className="text-base font-semibold">
                    Status
                </Label>
            </div>
            <RadioGroup
                value={value}
                onValueChange={onChange}
                name="status"
                options={[
                    { value: 'Posted', label: 'Posted' },
                    { value: 'Sent to representative', label: 'Sent to representative' },
                ]}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
