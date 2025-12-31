// resources/js/pages/Properties/edit/PropertySelectField.tsx
import React, { forwardRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Building2, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PropertyWithoutInsurance } from '@/types/property';

interface PropertySelectFieldProps {
    value: number;
    availableProperties: PropertyWithoutInsurance[];
    error?: string;
    validationError?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void; // for backward compatibility
    onValueChange?: (value: string) => void; // preferred for combobox
}

/**
 * Property selection field
 * This is the ONLY required field for updates
 */
const PropertySelectField = forwardRef<HTMLButtonElement, PropertySelectFieldProps>(
    ({ value, onChange, onValueChange, availableProperties, error, validationError }, ref) => {
        const [open, setOpen] = useState(false);
        const selectedLabel = availableProperties.find((p) => p.id === value)?.property_name || '';

        const handleSelect = (val: string) => {
            // Call preferred handler
            onValueChange?.(val);
            // Backward-compatible synthetic event for onChange
            if (onChange) {
                const syntheticEvent = {
                    target: { value: val },
                } as unknown as React.ChangeEvent<HTMLSelectElement>;
                onChange(syntheticEvent);
            }
            setOpen(false);
        };

        return (
            <div className="rounded-lg border-l-4 border-l-blue-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="property_id" className="text-base font-semibold">
                        <Building2 className="h-4 w-4 inline mr-1" />
                        Property *
                    </Label>
                </div>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            ref={ref}
                            id="property_id"
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                        >
                            {selectedLabel || 'Select a property...'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                        <Command>
                            <CommandInput placeholder="Search property..." />
                            <CommandEmpty>No property found.</CommandEmpty>
                            <CommandList>
                                <CommandGroup>
                                    {availableProperties.map((availableProperty) => {
                                        const val = availableProperty.id.toString();
                                        const isSelected = value && val === value.toString();
                                        return (
                                            <CommandItem
                                                key={availableProperty.id}
                                                value={val}
                                                onSelect={handleSelect}
                                            >
                                                <Check
                                                    className={cn(
                                                        'mr-2 h-4 w-4',
                                                        isSelected ? 'opacity-100' : 'opacity-0'
                                                    )}
                                                />
                                                {availableProperty.property_name}
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                {/* Show backend validation errors if any */}
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                {/* Show frontend validation error if user tries to submit without selecting */}
                {validationError && <p className="mt-1 text-sm text-red-600">{validationError}</p>}
            </div>
        );
    }
);

PropertySelectField.displayName = 'PropertySelectField';

export default PropertySelectField;
