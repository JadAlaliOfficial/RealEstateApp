import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface Props {
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder: string;
    minHeight?: string;
}

export default function TextAreaField({ id, value, onChange, placeholder, minHeight = '80px' }: Props) {
    return (
        <Textarea
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`min-h-[${minHeight}]`}
        />
    );
}
