// resources/js/Pages/Properties/create/PropertySelectionSection.tsx
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, AlertCircle, Check, ChevronsUpDown } from 'lucide-react';
import { PropertyWithoutInsurance } from '@/types/property';
import { cn } from '@/lib/utils';

interface PropertySelectionSectionProps {
    propertyId: number;
    selectedCityId: string;
    filteredProperties: PropertyWithoutInsurance[];
    onPropertyChange: (value: string) => void;
    errors: any;
    validationError: string;
}

/**
 * Property selection component
 * Displays available properties for selected city
 * This is the ONLY required field
 */
export default function PropertySelectionSection({
    propertyId,
    selectedCityId,
    filteredProperties,
    onPropertyChange,
    errors,
    validationError
}: PropertySelectionSectionProps) {
    const [open, setOpen] = useState(false);
    const selectedPropertyName =
        (propertyId && propertyId !== 0
            ? filteredProperties.find((p) => p.id === propertyId)?.property_name
            : '') || '';

    return (
        <div className="rounded-lg border-l-4 border-l-green-500 p-4">
            <div className="mb-2">
                <Label htmlFor="property_select" className="text-base font-semibold">
                    <Building2 className="h-4 w-4 inline mr-1" />
                    Select Property *
                </Label>
            </div>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id="property_select"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                        disabled={!selectedCityId}
                    >
                        {selectedCityId
                            ? selectedPropertyName || 'Choose a property...'
                            : 'Select a city first...'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder="Search property..." />
                        <CommandEmpty>No property found.</CommandEmpty>
                        <CommandList>
                            <CommandGroup>
                                {filteredProperties.map((property) => {
                                    const value = property.id.toString();
                                    const isSelected = propertyId && propertyId !== 0 && value === propertyId.toString();
                                    return (
                                        <CommandItem
                                            key={property.id}
                                            value={value}
                                            onSelect={(v) => {
                                                onPropertyChange(v);
                                                setOpen(false);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    'mr-2 h-4 w-4',
                                                    isSelected ? 'opacity-100' : 'opacity-0'
                                                )}
                                            />
                                            {property.property_name}
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            
            {/* Show backend validation errors if any */}
            {errors.property_id && <p className="mt-1 text-sm text-red-600">{errors.property_id}</p>}
            
            {/* Show frontend validation error if user tries to submit without selecting */}
            {validationError && <p className="mt-1 text-sm text-red-600">{validationError}</p>}
            
            {/* Show alert if city is selected but no properties available */}
            {selectedCityId && filteredProperties.length === 0 && (
                <Alert className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        No properties found for the selected city.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
