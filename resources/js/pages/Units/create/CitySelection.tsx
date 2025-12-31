import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ChevronsUpDown, Check } from 'lucide-react';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

interface Props {
    cities: Array<{ id: number; city: string }>;
    selectedCityId: string;
    onCityChange: (cityId: string) => void;
    validationError?: string;
}

export default function CitySelection({ cities, selectedCityId, onCityChange, validationError }: Props) {
    const [open, setOpen] = useState(false);

    const selectedLabel = useMemo(() => {
        const found = cities?.find((c) => c.id.toString() === selectedCityId);
        return found ? found.city : '';
    }, [cities, selectedCityId]);

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
                        id="city"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {selectedLabel || 'Select a city'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Search city..." />
                        <CommandList>
                            <CommandEmpty>No city found.</CommandEmpty>
                            <CommandGroup>
                                {cities?.map((city) => (
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
                                )) || []}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {validationError && <p className="mt-1 text-sm text-red-600">{validationError}</p>}
        </div>
    );
}
