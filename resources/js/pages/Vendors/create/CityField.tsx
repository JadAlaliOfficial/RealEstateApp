import { forwardRef, useMemo, useState } from 'react';
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

interface CityFieldProps {
    cities: Array<{ id: number; city: string }>;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    validationError?: string;
}

const CityField = forwardRef<HTMLButtonElement, CityFieldProps>(
  ({ cities, value, onChange, error, validationError }, ref) => {
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
              ref={ref}
              id="city_id"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {selectedLabel || 'Select a city'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Search city..." />
              <CommandList>
                <CommandEmpty>No city found.</CommandEmpty>
                <CommandGroup>
                  {(cities || []).map((city) => (
                    <CommandItem
                      key={city.id}
                      value={city.city}
                      onSelect={() => {
                        onChange(city.id.toString());
                        setOpen(false);
                      }}
                    >
                      {city.city}
                    </CommandItem>
                  ))}
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

CityField.displayName = 'CityField';

export default CityField;
