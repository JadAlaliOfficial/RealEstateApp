import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import React, { useMemo, useState } from 'react';

interface Property {
  id: number;
  name: string;
  city_id: number;
}

interface PropertySelectorProps {
  properties: Property[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  validationError?: string;
  propertyRef?: React.RefObject<HTMLButtonElement | null>;
  citySelected: boolean;
}

export default function PropertySelector({ 
  properties, 
  value, 
  onChange, 
  disabled, 
  error, 
  validationError, 
  propertyRef,
  citySelected 
}: PropertySelectorProps) {
  const [open, setOpen] = useState(false);
  const selectedLabel = useMemo(() => {
    const found = properties.find((p) => p.id.toString() === value);
    return found ? found.name : '';
  }, [properties, value]);
  return (
    <div className="rounded-lg border-l-4 border-l-blue-500 p-4">
      <div className="mb-2">
        <Label htmlFor="property" className="text-base font-semibold">
          Property *
        </Label>
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={propertyRef}
            role="combobox"
            aria-expanded={open}
            variant="outline"
            className="w-full justify-between text-left font-normal"
            disabled={disabled || !citySelected || properties.length === 0}
          >
            {selectedLabel || (!citySelected ? 'Select city first' : properties.length === 0 ? 'No properties available' : 'Select property')}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search property..." />
            <CommandList>
              <CommandEmpty>No property found.</CommandEmpty>
              <CommandGroup>
                {properties.map((property) => {
                  const idStr = property.id.toString();
                  const isSelected = value === idStr;
                  return (
                    <CommandItem
                      key={property.id}
                      value={property.name}
                      onSelect={() => {
                        onChange(idStr);
                        setOpen(false);
                      }}
                    >
                      <Check className={cn('mr-2 h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')} />
                      {property.name}
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
