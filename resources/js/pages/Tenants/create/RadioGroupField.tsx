import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radioGroup';

interface RadioGroupFieldProps {
    name: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string; label: string }>;
    borderColor: string;
    error?: string;
}

export function RadioGroupField({
    name,
    label,
    value,
    onChange,
    options,
    borderColor,
    error,
}: RadioGroupFieldProps) {
    return (
        <div className={`rounded-lg border-l-4 border-l-${borderColor}-500 p-4`}>
            <div className="mb-2">
                <Label htmlFor={name} className="text-base font-semibold">
                    {label}
                </Label>
            </div>
            <RadioGroup
                value={value}
                onValueChange={onChange}
                name={name}
                options={options}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
