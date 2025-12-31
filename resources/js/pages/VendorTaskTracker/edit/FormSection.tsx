import { Label } from '@/components/ui/label';
import React from 'react';

interface FormSectionProps {
    label: string;
    required?: boolean;
    borderColor: string;
    error?: string;
    validationError?: string;
    children: React.ReactNode;
}

export default function FormSection({
    label,
    required = false,
    borderColor,
    error,
    validationError,
    children,
}: FormSectionProps) {
    return (
        <div className={`rounded-lg border-l-4 ${borderColor} p-4`}>
            <div className="mb-2">
                <Label htmlFor={label?.toLowerCase().replace(/\s+/g, '_') || ''} className="text-base font-semibold">
                    {label} {required && '*'}
                </Label>
            </div>
            {children}
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            {validationError && <p className="mt-1 text-sm text-red-600">{validationError}</p>}
        </div>
    );
}
