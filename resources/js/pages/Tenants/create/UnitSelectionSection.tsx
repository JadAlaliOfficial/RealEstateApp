import { Label } from '@/components/ui/label';
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
import { forwardRef, useMemo, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

interface UnitSelectionSectionProps {
    units: Array<{id: number; unit_name: string}>;
    value: string;
    onChange: (value: string) => void;
    disabled: boolean;
    error?: string;
    validationError?: string;
}

export const UnitSelectionSection = forwardRef<HTMLButtonElement, UnitSelectionSectionProps>(
  ({ units, value, onChange, disabled, error, validationError }, ref) => {
    const [open, setOpen] = useState(false);

    const selectedLabel = useMemo(() => {
      const found = units?.find((u) => u.id.toString() === value);
      return found ? found.unit_name : '';
    }, [units, value]);

    return (
      <div className="rounded-lg border-l-4 border-l-purple-500 p-4">
        <div className="mb-2">
          <Label htmlFor="unit_id" className="text-base font-semibold">
            Unit *
          </Label>
        </div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              role="combobox"
              aria-expanded={open}
              variant="outline"
              className="w-full justify-between text-left font-normal"
              disabled={disabled}
            >
              {selectedLabel || 'Select unit'}
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search unit..." />
              <CommandList>
                <CommandEmpty>No unit found.</CommandEmpty>
                <CommandGroup>
                  {units?.map((unit) => {
                    const idStr = unit.id.toString();
                    const isSelected = value === idStr;
                    return (
                      <CommandItem
                        key={unit.id}
                        onSelect={() => {
                          onChange(idStr);
                          setOpen(false);
                        }}
                        value={unit.unit_name}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${isSelected ? 'opacity-100' : 'opacity-0'}`}
                        />
                        {unit.unit_name}
                      </CommandItem>
                    );
                  }) || []}
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
);

UnitSelectionSection.displayName = 'UnitSelectionSection';
