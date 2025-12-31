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
import { PropertyInfoWithoutInsurance } from '@/types/PropertyInfoWithoutInsurance';
import { forwardRef, useMemo, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

interface PropertySelectionSectionProps {
    properties: PropertyInfoWithoutInsurance[];
    value: string;
    onChange: (value: string) => void;
    disabled: boolean;
    validationError?: string;
}

export const PropertySelectionSection = forwardRef<HTMLButtonElement, PropertySelectionSectionProps>(
  ({ properties, value, onChange, disabled, validationError }, ref) => {
    const [open, setOpen] = useState(false);

    const selectedLabel = useMemo(() => {
      const found = properties?.find((p) => p.property_name === value);
      return found ? found.property_name : '';
    }, [properties, value]);

    return (
      <div className="rounded-lg border-l-4 border-l-green-500 p-4">
        <div className="mb-2">
          <Label htmlFor="property_name" className="text-base font-semibold">
            Property Name *
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
              {selectedLabel || 'Select property'}
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search property..." />
              <CommandList>
                <CommandEmpty>No property found.</CommandEmpty>
                <CommandGroup>
                  {properties?.map((property) => {
                    const isSelected = value === property.property_name;
                    return (
                      <CommandItem
                        key={property.id}
                        onSelect={() => {
                          onChange(property.property_name);
                          setOpen(false);
                        }}
                        value={property.property_name}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${isSelected ? 'opacity-100' : 'opacity-0'}`}
                        />
                        {property.property_name}
                      </CommandItem>
                    );
                  }) || []}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {validationError && <p className="mt-1 text-sm text-red-600">{validationError}</p>}
      </div>
    );
  }
);

PropertySelectionSection.displayName = 'PropertySelectionSection';
