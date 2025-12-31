import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import React, { useMemo, useState } from 'react';

interface Unit {
  id: number;
  name: string;
  property_id: number;
}

interface UnitSelectorProps {
  units: Unit[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  validationError?: string;
  unitRef?: React.RefObject<HTMLButtonElement | null>;
  propertySelected: boolean;
}

export default function UnitSelector({ 
  units, 
  value, 
  onChange, 
  disabled, 
  error, 
  validationError, 
  unitRef,
  propertySelected 
}: UnitSelectorProps) {
  const [open, setOpen] = useState(false);
  const selectedLabel = useMemo(() => {
    const found = units.find((u) => u.id.toString() === value);
    return found ? found.name : '';
  }, [units, value]);
  return (
    <div className="rounded-lg border-l-4 border-l-green-500 p-4">
      <div className="mb-2">
        <Label htmlFor="unit" className="text-base font-semibold">
          Unit *
        </Label>
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={unitRef}
            role="combobox"
            aria-expanded={open}
            variant="outline"
            className="w-full justify-between text-left font-normal"
            disabled={disabled || !propertySelected || units.length === 0}
          >
            {selectedLabel || (!propertySelected ? 'Select property first' : units.length === 0 ? 'No units available' : 'Select unit')}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search unit..." />
            <CommandList>
              <CommandEmpty>No unit found.</CommandEmpty>
              <CommandGroup>
                {units.map((unit) => {
                  const idStr = unit.id.toString();
                  const isSelected = value === idStr;
                  return (
                    <CommandItem
                      key={unit.id}
                      value={unit.name}
                      onSelect={() => {
                        onChange(idStr);
                        setOpen(false);
                      }}
                    >
                      <Check className={cn('mr-2 h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')} />
                      {unit.name}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {validationError && <p className="mt-1 text-sm text-red-600">{validationError}</p>}
    </div>
  );
}
