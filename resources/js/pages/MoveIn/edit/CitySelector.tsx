import React, { useState } from 'react';
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
import { cn } from '@/lib/utils';
import { City } from '@/types/City';
import FormSection from './FormSection';

interface CitySelectorProps {
    cities: City[];
    selectedCityId: string;
    onCityChange: (cityId: string) => void;
    cityRef: React.RefObject<HTMLButtonElement>;
    error?: string;
}

export default function CitySelector({ 
    cities, 
    selectedCityId, 
    onCityChange, 
    cityRef,
    error 
}: CitySelectorProps) {
    const [open, setOpen] = useState(false);
    const selectedCity = cities.find((c) => c.id.toString() === selectedCityId);
    return (
        <FormSection 
            label="City" 
            borderColor="border-l-slate-500" 
            error={error}
            required
        >
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        ref={cityRef}
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {selectedCity?.city || 'Select city'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Search city..." />
                        <CommandEmpty>No city found.</CommandEmpty>
                        <CommandList>
                            <CommandGroup>
                                {cities.map((city) => (
                                    <CommandItem
                                        key={city.id}
                                        value={city.city}
                                        onSelect={() => {
                                            onCityChange(city.id.toString());
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                selectedCityId === city.id.toString() ? 'opacity-100' : 'opacity-0'
                                            )}
                                        />
                                        {city.city}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </FormSection>
    );
}
