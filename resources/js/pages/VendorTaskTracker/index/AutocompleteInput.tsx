import { Input } from '@/components/ui/input';
import { ChevronDown } from 'lucide-react';
import React, { forwardRef } from 'react';

interface Option {
    id: number;
    label: string;
    sublabel?: string;
}

interface AutocompleteInputProps {
    value: string;
    placeholder: string;
    options: Option[];
    showDropdown: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus: () => void;
    onSelect: (option: Option) => void;
    dropdownRef: React.RefObject<HTMLDivElement>;
}

const AutocompleteInput = forwardRef<HTMLInputElement, AutocompleteInputProps>(
    ({ value, placeholder, options, showDropdown, onChange, onFocus, onSelect, dropdownRef }, ref) => {
        return (
            <div className="relative">
                <Input
                    ref={ref}
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onFocus={onFocus}
                    className="text-input-foreground bg-input pr-8"
                />
                <ChevronDown className="absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                {showDropdown && options.length > 0 && (
                    <div
                        ref={dropdownRef}
                        className="absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border border-input bg-popover shadow-lg"
                    >
                        {options.map((option) => (
                            <div
                                key={option.id}
                                className="cursor-pointer px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                                onClick={() => onSelect(option)}
                            >
                                {option.label}
                                {option.sublabel && (
                                    <span className="ml-2 text-xs text-muted-foreground">
                                        ({option.sublabel})
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
);

AutocompleteInput.displayName = 'AutocompleteInput';

export default AutocompleteInput;
