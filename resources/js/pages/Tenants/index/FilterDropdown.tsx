import React from 'react';
import { Input } from '@/components/ui/input';

interface FilterOption {
    id: number;
    label: string;
}

interface FilterDropdownProps {
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus: () => void;
    showDropdown: boolean;
    setShowDropdown: (show: boolean) => void;
    options: FilterOption[];
    onSelect: (option: FilterOption) => void;
    dropdownRef: React.RefObject<HTMLDivElement>;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
    placeholder,
    value,
    onChange,
    onFocus,
    showDropdown,
    options,
    onSelect,
    dropdownRef,
}) => {
    return (
        <div className="relative" ref={dropdownRef}>
            <Input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                className="text-input-foreground bg-input"
            />
            {showDropdown && options.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 mb-1 max-h-60 overflow-auto rounded-md border border-input bg-popover shadow-lg">
                    {options.map((option) => (
                        <div
                            key={option.id}
                            className="cursor-pointer px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                            onClick={() => onSelect(option)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
