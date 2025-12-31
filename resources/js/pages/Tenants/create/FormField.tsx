import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { forwardRef } from 'react';

interface FormFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    borderColor: string;
    type?: string;
    step?: string;
    error?: string;
    validationError?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
    ({ id, label, value, onChange, placeholder, borderColor, type = 'text', step, error, validationError }, ref) => {
        return (
            <div className={`rounded-lg border-l-4 border-l-${borderColor}-500 p-4`}>
                <div className="mb-2">
                    <Label htmlFor={id} className="text-base font-semibold">
                        {label}
                    </Label>
                </div>
                <Input
                    id={id}
                    ref={ref}
                    type={type}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                />
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                {validationError && <p className="mt-1 text-sm text-red-600">{validationError}</p>}
            </div>
        );
    }
);

FormField.displayName = 'FormField';
