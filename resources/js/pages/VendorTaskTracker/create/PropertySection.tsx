import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface PropertyOption {
    id: number;
    property_name: string;
    city?: string;
}

interface PropertySectionProps {
    availableProperties: PropertyOption[];
    selectedProperty: string;
    selectedCity: string;
    onPropertyChange: (property: string) => void;
}

export default function PropertySection({
    availableProperties,
    selectedProperty,
    selectedCity,
    onPropertyChange
}: PropertySectionProps) {
    const [open, setOpen] = useState(false);
    return (
        <div className="rounded-lg border-l-4 border-l-indigo-500 p-4">
            <div className="mb-2">
                <Label htmlFor="property" className="text-base font-semibold">
                    Property *
                </Label>
            </div>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                        disabled={!selectedCity}
                    >
                        {selectedProperty || (selectedCity ? 'Select property' : 'Select city first')}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder="Search property..." />
                        <CommandEmpty>No property found.</CommandEmpty>
                        <CommandList>
                            <CommandGroup>
                                {availableProperties?.map((property) => (
                                    <CommandItem
                                        key={property.id}
                                        value={property.property_name}
                                        onSelect={() => {
                                            onPropertyChange(property.property_name);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                selectedProperty === property.property_name ? 'opacity-100' : 'opacity-0'
                                            )}
                                        />
                                        {property.property_name}
                                    </CommandItem>
                                )) || []}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
