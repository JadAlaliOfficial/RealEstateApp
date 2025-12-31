import React from 'react';
import FormSection from './FormSection';

interface TextAreaFieldProps {
    label: string;
    required?: boolean;
    borderColor: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    textAreaRef?: React.RefObject<HTMLTextAreaElement>;
    placeholder?: string;
    rows?: number;
    error?: string;
    validationError?: string;
}

export default function TextAreaField({
    label,
    required = false,
    borderColor,
    value,
    onChange,
    textAreaRef,
    placeholder,
    rows = 3,
    error,
    validationError,
}: TextAreaFieldProps) {
    return (
        <FormSection
            label={label}
            required={required}
            borderColor={borderColor}
            error={error}
            validationError={validationError}
        >
            <textarea
                ref={textAreaRef}
                id={label.toLowerCase().replace(/\s+/g, '_')}
                value={value}
                onChange={onChange}
                rows={rows}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </FormSection>
    );
}
