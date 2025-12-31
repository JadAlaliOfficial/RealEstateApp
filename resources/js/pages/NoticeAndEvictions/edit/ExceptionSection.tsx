import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radioGroup';

interface Props {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export function ExceptionSection({ value, onChange, error }: Props) {
    return (
        <div className="rounded-lg border-l-4 border-l-teal-500 p-4">
            <div className="mb-2">
                <Label htmlFor="have_an_exception" className="text-base font-semibold">
                    Have An Exception?
                </Label>
            </div>
            <RadioGroup value={value} onValueChange={onChange} name="have_an_exception" />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
