import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UnitFieldProps {
    selectedUnit: string;
    availableUnits: string[];
    onUnitChange: (unit: string) => void;
    disabled: boolean;
    validationError?: string;
}

export function UnitField({
    selectedUnit,
    availableUnits,
    onUnitChange,
    disabled,
    validationError,
}: UnitFieldProps) {
    const [openUnit, setOpenUnit] = useState(false);

    return (
        <div className="rounded-lg border-l-4 border-l-purple-500 p-4">
            <div className="mb-2">
                <Label htmlFor="unit_name" className="text-base font-semibold">
                    Unit Name *
                </Label>
            </div>
            <Popover open={openUnit} onOpenChange={setOpenUnit}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openUnit}
                        className="w-full justify-between"
                        disabled={disabled}
                    >
                        {selectedUnit || (!disabled ? 'Select unit...' : 'Select city first')}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder="Search unit..." />
                        <CommandEmpty>No unit found.</CommandEmpty>
                        <CommandList>
                            <CommandGroup>
                                {(availableUnits || []).map((unit) => (
                                    <CommandItem
                                        key={unit}
                                        value={unit}
                                        onSelect={() => {
                                            onUnitChange(unit);
                                            setOpenUnit(false);
                                        }}
                                    >
                                        <Check className={cn('mr-2 h-4 w-4', selectedUnit === unit ? 'opacity-100' : 'opacity-0')} />
                                        {unit}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {validationError && <p className="mt-1 text-sm text-red-600">{validationError}</p>}
        </div>
    );
}
