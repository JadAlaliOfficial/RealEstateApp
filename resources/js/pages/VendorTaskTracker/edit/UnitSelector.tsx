import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import React, { useMemo, useState } from 'react';
import FormSection from './FormSection';

interface UnitOption {
    id: number;
    unit_name: string;
    property_name?: string;
    city?: string;
}

interface UnitSelectorProps {
    units: UnitOption[];
    selectedUnitId: string;
    onUnitChange: (unitId: string) => void;
    unitRef: React.RefObject<HTMLButtonElement>;
    disabled: boolean;
    error?: string;
    validationError?: string;
}

export default function UnitSelector({
    units,
    selectedUnitId,
    onUnitChange,
    unitRef,
    disabled,
    error,
    validationError,
}: UnitSelectorProps) {
    const [open, setOpen] = useState(false);
    const selectedUnit = useMemo(
        () => units?.find((u) => u.id.toString() === selectedUnitId),
        [units, selectedUnitId]
    );

    return (
        <FormSection
            label="Unit Name"
            required
            borderColor="border-l-green-500"
            error={error}
            validationError={validationError}
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
                        {selectedUnit?.unit_name || 'Select unit'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder="Search unit..." />
                        <CommandEmpty>No unit found.</CommandEmpty>
                        <CommandList>
                            <CommandGroup>
                                {units?.map((unit) => (
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
                                                selectedUnitId === unit.id.toString() ? 'opacity-100' : 'opacity-0'
                                            )}
                                        />
                                        {unit.unit_name}
                                    </CommandItem>
                                )) || []}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </FormSection>
    );
}
