import { useState } from 'react';
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
import { cn } from '@/lib/utils';
import { City } from '@/types/City';
import { PropertyInfoWithoutInsurance } from '@/types/PropertyInfoWithoutInsurance';
import { RefObject } from 'react';

interface CityPropertyUnitSelectorProps {
    cities: City[];
    availableProperties: PropertyInfoWithoutInsurance[];
    availableUnits: Array<{id: number, unit_name: string}>;
    selectedCityId: string;
    selectedPropertyId: string;
    unitId: number | '';
    cityRef: RefObject<HTMLButtonElement>;
    propertyRef: RefObject<HTMLButtonElement>;
    unitRef: RefObject<HTMLButtonElement>;
    onCityChange: (cityId: string) => void;
    onPropertyChange: (propertyId: string) => void;
    onUnitChange: (unitId: string) => void;
    errors: any;
    cityValidationError: string;
    propertyValidationError: string;
    validationError: string;
}

export function CityPropertyUnitSelector({
    cities,
    availableProperties,
    availableUnits,
    selectedCityId,
    selectedPropertyId,
    unitId,
    cityRef,
    propertyRef,
    unitRef,
    onCityChange,
    onPropertyChange,
    onUnitChange,
    errors,
    cityValidationError,
    propertyValidationError,
    validationError,
}: CityPropertyUnitSelectorProps) {
    const [openCity, setOpenCity] = useState(false);
    const [openProperty, setOpenProperty] = useState(false);
    const [openUnit, setOpenUnit] = useState(false);

    const selectedCity = cities.find((c) => c.id.toString() === selectedCityId);
    const selectedProperty = availableProperties.find((p) => p.id.toString() === selectedPropertyId);
    const selectedUnit = typeof unitId === 'number' ? availableUnits.find((u) => u.id === unitId) : undefined;

    return (
        <>
            <div className="rounded-lg border-l-4 border-l-slate-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="city_id" className="text-base font-semibold">
                        City *
                    </Label>
                </div>
                <Popover open={openCity} onOpenChange={setOpenCity}>
                    <PopoverTrigger asChild>
                        <Button
                            ref={cityRef}
                            variant="outline"
                            role="combobox"
                            aria-expanded={openCity}
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
                                                setOpenCity(false);
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
                {errors.unit_id && <p className="mt-1 text-sm text-red-600">Please select a valid unit.</p>}
                {cityValidationError && <p className="mt-1 text-sm text-red-600">{cityValidationError}</p>}
            </div>

            <div className="rounded-lg border-l-4 border-l-gray-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="property_id" className="text-base font-semibold">
                        Property *
                    </Label>
                </div>
                <Popover open={openProperty} onOpenChange={setOpenProperty}>
                    <PopoverTrigger asChild>
                        <Button
                            ref={propertyRef}
                            variant="outline"
                            role="combobox"
                            aria-expanded={openProperty}
                            className="w-full justify-between"
                            disabled={!selectedCityId}
                        >
                            {selectedProperty?.property_name || (selectedCityId ? 'Select property' : 'Select city first')}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                        <Command>
                            <CommandInput placeholder="Search property..." />
                            <CommandEmpty>No property found.</CommandEmpty>
                            <CommandList>
                                <CommandGroup>
                                    {availableProperties.map((property) => (
                                        <CommandItem
                                            key={property.id}
                                            value={property.property_name}
                                            onSelect={() => {
                                                onPropertyChange(property.id.toString());
                                                setOpenProperty(false);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    'mr-2 h-4 w-4',
                                                    selectedPropertyId === property.id.toString() ? 'opacity-100' : 'opacity-0'
                                                )}
                                            />
                                            {property.property_name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                {propertyValidationError && <p className="mt-1 text-sm text-red-600">{propertyValidationError}</p>}
            </div>

            <div className="rounded-lg border-l-4 border-l-blue-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="unit_id" className="text-base font-semibold">
                        Unit Name *
                    </Label>
                </div>
                <Popover open={openUnit} onOpenChange={setOpenUnit}>
                    <PopoverTrigger asChild>
                        <Button
                            ref={unitRef}
                            variant="outline"
                            role="combobox"
                            aria-expanded={openUnit}
                            className="w-full justify-between"
                            disabled={!selectedPropertyId}
                        >
                            {selectedUnit?.unit_name || (selectedPropertyId ? 'Select unit' : 'Select property first')}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                        <Command>
                            <CommandInput placeholder="Search unit..." />
                            <CommandEmpty>No unit found.</CommandEmpty>
                            <CommandList>
                                <CommandGroup>
                                    {availableUnits.map((unit) => (
                                        <CommandItem
                                            key={unit.id}
                                            value={unit.unit_name}
                                            onSelect={() => {
                                                onUnitChange(unit.id.toString());
                                                setOpenUnit(false);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    'mr-2 h-4 w-4',
                                                    unitId && unitId === unit.id ? 'opacity-100' : 'opacity-0'
                                                )}
                                            />
                                            {unit.unit_name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                {errors.unit_id && <p className="mt-1 text-sm text-red-600">{errors.unit_id}</p>}
                {validationError && <p className="mt-1 text-sm text-red-600">{validationError}</p>}
            </div>
        </>
    );
}
