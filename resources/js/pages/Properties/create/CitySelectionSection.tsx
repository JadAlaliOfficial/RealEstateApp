// resources/js/Pages/Properties/create/CitySelectionSection.tsx
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { MapPin, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { City } from '@/types/City';

interface CitySelectionSectionProps {
    selectedCityId: string;
    cities: City[];
    onCityChange: (value: string) => void;
}

/**
 * City selection section
 * Users must select a city first to filter properties
 * No validation needed - just a helper to filter properties
 */
export default function CitySelectionSection({
    selectedCityId,
    cities,
    onCityChange
}: CitySelectionSectionProps) {
    const [open, setOpen] = useState(false);

    const selectedCityName =
        cities.find((c) => c.id.toString() === selectedCityId)?.city || '';

    return (
        <div className="rounded-lg border-l-4 border-l-blue-500 p-4">
            <div className="mb-2">
                <Label htmlFor="city_select" className="text-base font-semibold">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Select City
                </Label>
            </div>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id="city_select"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {selectedCityName || 'Choose a city...'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder="Search city..." />
                        <CommandEmpty>No city found.</CommandEmpty>
                        <CommandList>
                            <CommandGroup>
                                {cities.map((city) => {
                                    const value = city.id.toString();
                                    const isSelected = selectedCityId === value;
                                    return (
                                        <CommandItem
                                            key={city.id}
                                            value={value}
                                            onSelect={(v) => {
                                                onCityChange(v);
                                                setOpen(false);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    'mr-2 h-4 w-4',
                                                    isSelected ? 'opacity-100' : 'opacity-0'
                                                )}
                                            />
                                            {city.city}
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
