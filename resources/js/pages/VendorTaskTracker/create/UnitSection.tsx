import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import React, { useMemo, useState } from 'react';

interface UnitOption {
    id: number;
    unit_name: string;
    property_name?: string;
    city?: string;
}

interface UnitSectionProps {
    availableUnits: UnitOption[];
    selectedProperty: string;
    unitId: string;
    onUnitChange: (unitId: string) => void;
    unitRef: React.RefObject<HTMLButtonElement>;
   errors: Partial<Record<string, string>>; // Changed from Record<string, string>

    validationError: string;
}

export default function UnitSection({
    availableUnits,
    selectedProperty,
    unitId,
    onUnitChange,
    unitRef,
    errors,
    validationError
}: UnitSectionProps) {
    const [open, setOpen] = useState(false);
    const selectedUnit = useMemo(
        () => availableUnits?.find((u) => u.id.toString() === unitId),
        [availableUnits, unitId]
    );

    return (
        <div className="rounded-lg border-l-4 border-l-green-500 p-4">
            <div className="mb-2">
                <Label htmlFor="unit_name" className="text-base font-semibold">
                    Unit Name *
                </Label>
            </div>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        ref={unitRef}
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                        disabled={!selectedProperty}
                    >
                        {selectedUnit?.unit_name || (selectedProperty ? 'Select unit' : 'Select property first')}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder="Search unit..." />
                        <CommandEmpty>No unit found.</CommandEmpty>
                        <CommandList>
                            <CommandGroup>
                                {availableUnits?.map((unit) => (
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
                                                unitId === unit.id.toString() ? 'opacity-100' : 'opacity-0'
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
            {errors.unit_id && <p className="mt-1 text-sm text-red-600">{errors.unit_id}</p>}
            {validationError && <p className="mt-1 text-sm text-red-600">{validationError}</p>}
        </div>
    );
}
