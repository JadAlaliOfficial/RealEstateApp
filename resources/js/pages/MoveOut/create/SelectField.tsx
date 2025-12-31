import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SelectOption {
    value: string;
    label: string;
}

interface Props {
    placeholder: string;
    value: string;
    onValueChange: (value: string) => void;
    disabled?: boolean;
    options: SelectOption[];
}

const SelectField = React.forwardRef<HTMLButtonElement, Props>(
    ({ placeholder, value, onValueChange, disabled, options }, ref) => {
        return (
            <Select onValueChange={onValueChange} value={value} disabled={disabled}>
                <SelectTrigger ref={ref}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    }
);

SelectField.displayName = 'SelectField';

export default SelectField;
