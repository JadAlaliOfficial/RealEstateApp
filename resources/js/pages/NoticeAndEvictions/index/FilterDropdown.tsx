import { Input } from '@/components/ui/input';
import { ChevronDown } from 'lucide-react';
import React, { useRef, useEffect } from 'react';

interface FilterDropdownProps<T> {
    value: string;
    placeholder: string;
    items: T[];
    displayKey: keyof T;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onItemSelect: (item: T) => void;
    showDropdown: boolean;
    setShowDropdown: (show: boolean) => void;
}

export function FilterDropdown<T extends { id: number }>({
    value,
    placeholder,
    items,
    displayKey,
    onInputChange,
    onItemSelect,
    showDropdown,
    setShowDropdown,
}: FilterDropdownProps<T>) {
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

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
    }, [setShowDropdown]);

    return (
        <div className="relative">
            <Input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onInputChange}
                onFocus={() => setShowDropdown(true)}
                className="text-input-foreground bg-input pr-8"
            />
            <ChevronDown className="absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            {showDropdown && items.length > 0 && (
                <div
                    ref={dropdownRef}
                    className="absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border border-input bg-popover shadow-lg"
                >
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="cursor-pointer px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                            onClick={() => onItemSelect(item)}
                        >
                            {String(item[displayKey])}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
