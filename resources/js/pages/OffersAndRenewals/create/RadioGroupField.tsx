import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radioGroup';

interface RadioGroupFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    error?: string;
    borderColor: string;
    name: string;
}

export default function RadioGroupField({
    label,
    value,
    onChange,
    options,
    error,
    borderColor,
    name,
}: RadioGroupFieldProps) {
    return (
        <div className={`rounded-lg border-l-4 ${borderColor} p-4`}>
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
