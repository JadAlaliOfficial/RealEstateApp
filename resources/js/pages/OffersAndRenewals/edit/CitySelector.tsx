import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import React, { useMemo, useState } from 'react';

interface City {
  id: number;
  name: string;
}

interface CitySelectorProps {
  cities: City[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  validationError?: string;
  cityRef?: React.RefObject<HTMLButtonElement | null>;
}

export default function CitySelector({ 
  cities, 
  value, 
  onChange, 
  error, 
  validationError, 
  cityRef 
}: CitySelectorProps) {
  const [open, setOpen] = useState(false);
  const selectedLabel = useMemo(() => {
    const found = cities.find((c) => c.id.toString() === value);
    return found ? found.name : '';
  }, [cities, value]);
  return (
    <div className="rounded-lg border-l-4 border-l-indigo-500 p-4">
      <div className="mb-2">
        <Label htmlFor="city" className="text-base font-semibold">
          City *
        </Label>
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={cityRef}
            role="combobox"
            aria-expanded={open}
            variant="outline"
            className="w-full justify-between text-left font-normal"
          >
            {selectedLabel || 'Select city'}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search city..." />
            <CommandList>
              <CommandEmpty>No city found.</CommandEmpty>
              <CommandGroup>
                {cities.map((city) => {
                  const idStr = city.id.toString();
                  const isSelected = value === idStr;
                  return (
                    <CommandItem
                      key={city.id}
                      value={city.name}
                      onSelect={() => {
                        onChange(idStr);
                        setOpen(false);
                      }}
                    >
                      <Check className={cn('mr-2 h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')} />
                      {city.name}
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
