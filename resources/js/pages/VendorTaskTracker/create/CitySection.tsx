import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';

interface CityOption {
    id: number;
    city: string;
}

interface CitySectionProps {
    cities: CityOption[];
    selectedCity: string;
    onCityChange: (city: string) => void;
    cityRef: React.RefObject<HTMLButtonElement>;
   errors: Partial<Record<string, string>>; // Changed from Record<string, string>

    validationError: string;
}

export default function CitySection({
    cities,
    selectedCity,
    onCityChange,
    cityRef,
    errors,
    validationError
}: CitySectionProps) {
    const [open, setOpen] = useState(false);
    return (
        <div className="rounded-lg border-l-4 border-l-blue-500 p-4">
            <div className="mb-2">
                <Label htmlFor="city" className="text-base font-semibold">
                    City *
                </Label>
            </div>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        ref={cityRef}
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {selectedCity || 'Select city'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder="Search city..." />
                        <CommandEmpty>No city found.</CommandEmpty>
                        <CommandList>
                            <CommandGroup>
                                {cities?.map((city) => (
                                    <CommandItem
                                        key={city.id}
                                        value={city.city}
                                        onSelect={() => {
                                            onCityChange(city.city);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                selectedCity === city.city ? 'opacity-100' : 'opacity-0'
                                            )}
                                        />
                                        {city.city}
                                    </CommandItem>
                                )) || []}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {errors.vendor_id && <p className="mt-1 text-sm text-red-600">{errors.vendor_id}</p>}
            {validationError && <p className="mt-1 text-sm text-red-600">{validationError}</p>}
        </div>
    );
}
