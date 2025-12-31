import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { PropertyInfoWithoutInsurance } from '@/types/PropertyInfoWithoutInsurance';
import { forwardRef, useMemo, useState } from 'react';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
    availableProperties: PropertyInfoWithoutInsurance[];
    selectedCityId: string;
    propertyId: string;
    onPropertyChange: (propertyId: string) => void;
    error?: string;
    validationError?: string;
}

const PropertySelection = forwardRef<HTMLButtonElement, Props>(
    ({ availableProperties, selectedCityId, propertyId, onPropertyChange, error, validationError }, ref) => {
        const [open, setOpen] = useState(false);

        const selectedLabel = useMemo(() => {
            const found = availableProperties?.find((p) => p.id.toString() === propertyId);
            return found ? found.property_name : '';
        }, [availableProperties, propertyId]);

        const disabled = !selectedCityId || availableProperties.length === 0;

        return (
            <div className="rounded-lg border-l-4 border-l-green-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="property_id" className="text-base font-semibold">
                        Property *
                    </Label>
                </div>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            id="property_id"
                            ref={ref}
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                            disabled={disabled}
                        >
                            {selectedLabel || (!selectedCityId ? 'Select city first' : 'Select property')}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0" align="start">
                        <Command>
                            <CommandInput placeholder="Search property..." />
                            <CommandList>
                                <CommandEmpty>No property found.</CommandEmpty>
                                <CommandGroup>
                                    {availableProperties?.map((property) => (
                                        <CommandItem
                                            key={property.id}
                                            value={property.property_name}
                                            onSelect={() => {
                                                onPropertyChange(property.id.toString());
                                                setOpen(false);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    'mr-2 h-4 w-4',
                                                    propertyId === property.id.toString() ? 'opacity-100' : 'opacity-0'
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
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                {validationError && <p className="mt-1 text-sm text-red-600">{validationError}</p>}
            </div>
        );
    }
);

PropertySelection.displayName = 'PropertySelection';

export default PropertySelection;
