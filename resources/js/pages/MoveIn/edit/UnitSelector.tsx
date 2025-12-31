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
import FormSection from './FormSection';

interface UnitSelectorProps {
    units: Array<{id: number, unit_name: string}>;
    selectedUnitId: number | '';
    onUnitChange: (unitId: string) => void;
    unitRef: React.RefObject<HTMLButtonElement>;
    disabled: boolean;
    selectedPropertyId: string;
    validationError?: string;
    error?: string;
}

export default function UnitSelector({ 
    units, 
    selectedUnitId, 
    onUnitChange, 
    unitRef,
    disabled,
    selectedPropertyId,
    validationError,
    error 
}: UnitSelectorProps) {
    const [open, setOpen] = useState(false);
    const selectedUnit = typeof selectedUnitId === 'number' ? units.find((u) => u.id === selectedUnitId) : undefined;
    return (
        <FormSection 
            label="Unit Name" 
            borderColor="border-l-blue-500" 
            error={validationError || error}
            required
        >
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        ref={unitRef}
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                        disabled={disabled}
                    >
                        {selectedUnit?.unit_name || (selectedPropertyId ? 'Select unit' : 'Select property first')}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Search unit..." />
                        <CommandEmpty>No unit found.</CommandEmpty>
                        <CommandList>
                            <CommandGroup>
                                {units.map((unit) => (
                                    <CommandItem
                                        key={unit.id}
                                        value={unit.unit_name}
                                        onSelect={() => {
                                            onUnitChange(unit.id.toString());
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                selectedUnitId && selectedUnitId === unit.id ? 'opacity-100' : 'opacity-0'
                                            )}
                                        />
                                        {unit.unit_name}
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
