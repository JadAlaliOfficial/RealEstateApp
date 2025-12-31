import React from 'react';
import { Label } from '@/components/ui/label';

interface FormSectionProps {
    label: string;
    children: React.ReactNode;
    borderColor: string;
    error?: string;
    required?: boolean;
}

export default function FormSection({ label, children, borderColor, error, required = false }: FormSectionProps) {
    return (
        <div className={`rounded-lg border-l-4 ${borderColor} p-4`}>
            <div className="mb-2">
                <Label className="text-base font-semibold">
                    {label} {required && '*'}
                </Label>
            </div>
            {children}
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
