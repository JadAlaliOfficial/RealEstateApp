import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import FormSection from './FormSection';

interface PropertyOption {
    id: number;
    property_name: string;
    city?: string;
}

interface PropertySelectorProps {
    properties: PropertyOption[];
    selectedProperty: string;
    onPropertyChange: (property: string) => void;
    disabled: boolean;
    error?: string;
}

export default function PropertySelector({
    properties,
    selectedProperty,
    onPropertyChange,
    disabled,
    error,
}: PropertySelectorProps) {
    return (
        <FormSection
            label="Property"
            required
            borderColor="border-l-indigo-500"
            error={error}
        >
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={false}
                        className="w-full justify-between"
                        disabled={disabled}
                    >
                        {selectedProperty || 'Select property'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder="Search property..." />
                        <CommandEmpty>No property found.</CommandEmpty>
                        <CommandList>
                            <CommandGroup>
                                {properties?.map((property) => (
                                    <CommandItem
                                        key={property.id}
                                        value={property.property_name}
                                        onSelect={() => onPropertyChange(property.property_name)}
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
        </FormSection>
    );
}
