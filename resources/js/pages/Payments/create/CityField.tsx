import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CityFieldProps {
    cities: string[];
    selectedCity: string;
    onCityChange: (city: string) => void;
    validationError?: string;
    unitIdError?: string;
}

export function CityField({
    cities,
    selectedCity,
    onCityChange,
    validationError,
    unitIdError,
}: CityFieldProps) {
    const [openCity, setOpenCity] = useState(false);

    return (
        <div className="rounded-lg border-l-4 border-l-green-500 p-4">
            <div className="mb-2">
                <Label htmlFor="city" className="text-base font-semibold">
                    City *
                </Label>
            </div>
            <Popover open={openCity} onOpenChange={setOpenCity}>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={openCity} className="w-full justify-between">
                        {selectedCity || 'Select city...'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder="Search city..." />
                        <CommandEmpty>No city found.</CommandEmpty>
                        <CommandList>
                            <CommandGroup>
                                {(cities || []).map((city) => (
                                    <CommandItem
                                        key={city}
                                        value={city}
                                        onSelect={() => {
                                            onCityChange(city);
                                            setOpenCity(false);
                                        }}
                                    >
                                        <Check className={cn('mr-2 h-4 w-4', selectedCity === city ? 'opacity-100' : 'opacity-0')} />
                                        {city}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {unitIdError && <p className="mt-1 text-sm text-red-600">{unitIdError}</p>}
            {validationError && <p className="mt-1 text-sm text-red-600">{validationError}</p>}
        </div>
    );
}
