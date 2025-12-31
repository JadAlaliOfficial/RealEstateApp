import { Label } from '@/components/ui/label';
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
import { City } from '@/types/City';
import { PropertyInfoWithoutInsurance } from '@/types/PropertyInfoWithoutInsurance';
import React, { useMemo, useState } from 'react';

interface LocationSectionProps {
    cities: City[];
    selectedCityId: string;
    onCityChange: (cityId: string) => void;
    availableProperties: PropertyInfoWithoutInsurance[];
    selectedPropertyName: string;
    onPropertyChange: (propertyName: string) => void;
    propertyNameRef: React.RefObject<HTMLButtonElement>;
    validationError: string;
    availableUnits: Array<{id: number; unit_name: string}>;
    unitId: string;
    onUnitChange: (unitId: string) => void;
    unitNumberRef: React.RefObject<HTMLButtonElement>;
    unitValidationError: string;
    errors: Record<string, string>;
}

export default function LocationSection({
    cities,
    selectedCityId,
    onCityChange,
    availableProperties,
    selectedPropertyName,
    onPropertyChange,
    propertyNameRef,
    validationError,
    availableUnits,
    unitId,
    onUnitChange,
    unitNumberRef,
    unitValidationError,
    errors,
}: LocationSectionProps) {
    const [cityOpen, setCityOpen] = useState(false);
    const [propertyOpen, setPropertyOpen] = useState(false);
    const [unitOpen, setUnitOpen] = useState(false);

    const selectedCityLabel = useMemo(() => {
        const found = cities?.find((c) => c.id.toString() === selectedCityId);
        return found ? found.city : '';
    }, [cities, selectedCityId]);

    const selectedPropertyLabel = useMemo(() => {
        const found = availableProperties?.find((p) => p.property_name === selectedPropertyName);
        return found ? found.property_name : '';
    }, [availableProperties, selectedPropertyName]);

    const selectedUnitLabel = useMemo(() => {
        const found = availableUnits?.find((u) => u.id.toString() === unitId);
        return found ? found.unit_name : '';
    }, [availableUnits, unitId]);

    return (
        <>
            {/* City Selection */}
            <div className="rounded-lg border-l-4 border-l-blue-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="city_id" className="text-base font-semibold">
                        City *
                    </Label>
                </div>
                <Popover open={cityOpen} onOpenChange={setCityOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            role="combobox"
                            aria-expanded={cityOpen}
                            variant="outline"
                            className="w-full justify-between text-left font-normal"
                        >
                            {selectedCityLabel || 'Select city'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
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
                                                setCityOpen(false);
                                            }}
                                        >
                                            <Check
                                                className={`mr-2 h-4 w-4 ${selectedCityId === city.id.toString() ? 'opacity-100' : 'opacity-0'}`}
                                            />
                                            {city.city}
                                        </CommandItem>
                                    )) || []}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Property Information */}
            <div className="rounded-lg border-l-4 border-l-green-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="property_name" className="text-base font-semibold">
                        Property Name *
                    </Label>
                </div>
                <Popover open={propertyOpen} onOpenChange={setPropertyOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            ref={propertyNameRef as React.RefObject<HTMLButtonElement>}
                            role="combobox"
                            aria-expanded={propertyOpen}
                            variant="outline"
                            className="w-full justify-between text-left font-normal"
                            disabled={!selectedCityId}
                        >
                            {selectedPropertyLabel || 'Select property'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
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
                                                onPropertyChange(property.property_name);
                                                setPropertyOpen(false);
                                            }}
                                        >
                                            <Check
                                                className={`mr-2 h-4 w-4 ${selectedPropertyName === property.property_name ? 'opacity-100' : 'opacity-0'}`}
                                            />
                                            {property.property_name}
                                        </CommandItem>
                                    )) || []}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                {validationError && <p className="mt-1 text-sm text-red-600">{validationError}</p>}
            </div>

            {/* Unit Selection */}
            <div className="rounded-lg border-l-4 border-l-purple-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="unit_id" className="text-base font-semibold">
                        Unit *
                    </Label>
                </div>
                <Popover open={unitOpen} onOpenChange={setUnitOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            ref={unitNumberRef as React.RefObject<HTMLButtonElement>}
                            role="combobox"
                            aria-expanded={unitOpen}
                            variant="outline"
                            className="w-full justify-between text-left font-normal"
                            disabled={!selectedPropertyName}
                        >
                            {selectedUnitLabel || 'Select unit'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                        <Command>
                            <CommandInput placeholder="Search unit..." />
                            <CommandList>
                                <CommandEmpty>No unit found.</CommandEmpty>
                                <CommandGroup>
                                    {availableUnits?.map((unit) => {
                                        const idStr = unit.id.toString();
                                        return (
                                            <CommandItem
                                                key={unit.id}
                                                value={unit.unit_name}
                                                onSelect={() => {
                                                    onUnitChange(idStr);
                                                    setUnitOpen(false);
                                                }}
                                            >
                                                <Check
                                                    className={`mr-2 h-4 w-4 ${unitId === idStr ? 'opacity-100' : 'opacity-0'}`}
                                                />
                                                {unit.unit_name}
                                            </CommandItem>
                                        );
                                    }) || []}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                {errors.unit_id && <p className="mt-1 text-sm text-red-600">{errors.unit_id}</p>}
                {unitValidationError && <p className="mt-1 text-sm text-red-600">{unitValidationError}</p>}
            </div>
        </>
    );
}
