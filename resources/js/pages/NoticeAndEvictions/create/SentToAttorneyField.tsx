import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radioGroup';

interface Props {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export default function SentToAttorneyField({ value, onChange, error }: Props) {
    return (
        <div className="rounded-lg border-l-4 border-l-red-500 p-4">
            <div className="mb-2">
                <Label htmlFor="sent_to_atorney" className="text-base font-semibold">
                    Sent to Attorney
                </Label>
            </div>
            <RadioGroup value={value} onValueChange={onChange} name="sent_to_atorney" />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
