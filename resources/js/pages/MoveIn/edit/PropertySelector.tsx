import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PropertyInfoWithoutInsurance } from '@/types/PropertyInfoWithoutInsurance';
import FormSection from './FormSection';

interface PropertySelectorProps {
    properties: PropertyInfoWithoutInsurance[];
    selectedPropertyId: string;
    onPropertyChange: (propertyId: string) => void;
    propertyRef: React.RefObject<HTMLButtonElement>;
    disabled: boolean;
    selectedCityId: string;
    error?: string;
}

export default function PropertySelector({ 
    properties, 
    selectedPropertyId, 
    onPropertyChange, 
    propertyRef,
    disabled,
    selectedCityId,
    error 
}: PropertySelectorProps) {
    const [open, setOpen] = useState(false);
    const selectedProperty = properties.find((p) => p.id.toString() === selectedPropertyId);
    return (
        <FormSection 
            label="Property" 
            borderColor="border-l-gray-500" 
            error={error}
            required
        >
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        ref={propertyRef}
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                        disabled={disabled}
                    >
                        {selectedProperty?.property_name || (selectedCityId ? 'Select property' : 'Select city first')}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Search property..." />
                        <CommandEmpty>No property found.</CommandEmpty>
                        <CommandList>
                            <CommandGroup>
                                {properties.map((property) => (
                                    <CommandItem
                                        key={property.id}
                                        value={property.property_name}
                                        onSelect={() => {
                                            onPropertyChange(property.id.toString());
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                selectedPropertyId === property.id.toString() ? 'opacity-100' : 'opacity-0'
                                            )}
                                        />
                                        {property.property_name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </FormSection>
    );
}
