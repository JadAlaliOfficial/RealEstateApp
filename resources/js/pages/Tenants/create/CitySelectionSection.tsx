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
import { Check, ChevronsUpDown } from 'lucide-react';
import { City } from '@/types/City';
import { useState, useMemo } from 'react';

interface CitySelectionSectionProps {
  cities: City[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function CitySelectionSection({ cities, value, onChange, error }: CitySelectionSectionProps) {
  const [open, setOpen] = useState(false);

  const selectedLabel = useMemo(() => {
    const found = cities?.find((c) => c.id.toString() === value);
    return found ? found.city : '';
  }, [cities, value]);

  return (
    <div className="rounded-lg border-l-4 border-l-blue-500 p-4">
      <div className="mb-2">
        <Label htmlFor="city_id" className="text-base font-semibold">
          City *
        </Label>
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
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
                {cities?.map((city) => {
                  const isSelected = value === city.id.toString();
                  return (
                    <CommandItem
                      key={city.id}
                      onSelect={() => {
                        onChange(city.id.toString());
                        setOpen(false);
                      }}
                      value={city.city}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${isSelected ? 'opacity-100' : 'opacity-0'}`}
                      />
                      {city.city}
                    </CommandItem>
                  );
                }) || []}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
