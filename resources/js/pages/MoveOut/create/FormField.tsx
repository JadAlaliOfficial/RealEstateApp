import React from 'react';
import { Label } from '@/components/ui/label';

interface Props {
    label: string;
    borderColor: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
}

export default function FormField({ label, borderColor, error, required, children }: Props) {
    return (
        <div className={`rounded-lg border-l-4 border-l-${borderColor}-500 p-4`}>
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
