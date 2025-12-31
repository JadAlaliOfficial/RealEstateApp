import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertyFieldProps {
    selectedProperty: string;
    availableProperties: string[];
    onPropertyChange: (property: string) => void;
    disabled: boolean;
    validationError?: string;
}

export function PropertyField({
    selectedProperty,
    availableProperties,
    onPropertyChange,
    disabled,
    validationError,
}: PropertyFieldProps) {
    const [openProperty, setOpenProperty] = useState(false);

    return (
        <div className="rounded-lg border-l-4 border-l-orange-500 p-4">
            <div className="mb-2">
                <Label htmlFor="property_name" className="text-base font-semibold">
                    Property *
                </Label>
            </div>
            <Popover open={openProperty} onOpenChange={setOpenProperty}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openProperty}
                        className="w-full justify-between"
                        disabled={disabled}
                    >
                        {selectedProperty || (!disabled ? 'Select property...' : 'Select city first')}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder="Search property..." />
                        <CommandEmpty>No property found.</CommandEmpty>
                        <CommandList>
                            <CommandGroup>
                                {(availableProperties || []).map((property) => (
                                    <CommandItem
                                        key={property}
                                        value={property}
                                        onSelect={() => {
                                            onPropertyChange(property);
                                            setOpenProperty(false);
                                        }}
                                    >
                                        <Check className={cn('mr-2 h-4 w-4', selectedProperty === property ? 'opacity-100' : 'opacity-0')} />
                                        {property}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {validationError && <p className="mt-1 text-sm text-red-600">{validationError}</p>}
        </div>
    );
}
