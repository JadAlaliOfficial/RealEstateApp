import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radioGroup';

interface Props {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export function IfLeftSection({ value, onChange, error }: Props) {
    return (
        <div className="rounded-lg border-l-4 border-l-violet-500 p-4">
            <div className="mb-2">
                <Label htmlFor="if_left" className="text-base font-semibold">
                    If Left?
                </Label>
            </div>
            <RadioGroup value={value} onValueChange={onChange} name="if_left" />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
