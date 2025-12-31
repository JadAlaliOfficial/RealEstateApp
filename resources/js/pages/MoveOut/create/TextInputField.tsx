import React from 'react';
import { Input } from '@/components/ui/input';

interface Props {
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
}

export default function TextInputField({ id, value, onChange, placeholder }: Props) {
    return (
        <Input
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        />
    );
}
