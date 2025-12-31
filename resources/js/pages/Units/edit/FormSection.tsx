import React from 'react';

interface FormSectionProps {
    children: React.ReactNode;
    borderColor: string;
}

export default function FormSection({ children, borderColor }: FormSectionProps) {
    return (
        <div className={`rounded-lg border-l-4 ${borderColor} p-4`}>
            {children}
        </div>
    );
}
