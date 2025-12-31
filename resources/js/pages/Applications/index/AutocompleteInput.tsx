// resources/js/Pages/Applications/components/AutocompleteInput.tsx
import { Input } from '@/components/ui/input';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface AutocompleteOption {
    id: number;
    name: string;
}

interface AutocompleteInputProps {
    value: string;
    placeholder: string;
    options: AutocompleteOption[];
    onSelect: (option: AutocompleteOption) => void;
    onChange: (value: string) => void;
}

export default function AutocompleteInput({
    value,
    placeholder,
    options,
    onSelect,
    onChange,
}: AutocompleteInputProps) {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(newValue);
        setShowDropdown(newValue.length > 0);
    };

    const handleSelect = (option: AutocompleteOption) => {
        onSelect(option);
        setShowDropdown(false);
    };

    return (
        <div className="relative">
            <Input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={handleInputChange}
                onFocus={() => setShowDropdown(value.length > 0)}
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
                            onClick={() => handleSelect(option)}
                        >
                            {option.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
