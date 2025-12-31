import React, { useState } from 'react';
import FormField from './FormField';
import TextInputField from './TextInputField';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { City } from '@/types/City';
import { PropertyInfoWithoutInsurance } from '@/types/PropertyInfoWithoutInsurance';

interface Props {
    cities: City[];
    availableProperties: PropertyInfoWithoutInsurance[];
    availableUnits: Array<{ id: number; unit_name: string }>;
    selectedCity: number | null;
    selectedProperty: number | null;
    selectedUnit: number | null;
    validationErrors: {
        city: string;
        property: string;
        unit: string;
    };
    cityRef: React.RefObject<HTMLButtonElement | null>;
    propertyRef: React.RefObject<HTMLButtonElement | null>;
    unitRef: React.RefObject<HTMLButtonElement | null>;
    onCityChange: (value: string) => void;
    onPropertyChange: (value: string) => void;
    onUnitChange: (value: string) => void;
    // New props for tenants field
    tenants: string;
    tenantsError?: string;
    onTenantsChange: (value: string) => void;
}

export default function LocationSection({
    cities,
    availableProperties,
    availableUnits,
    selectedCity,
    selectedProperty,
    selectedUnit,
    validationErrors,
    cityRef,
    propertyRef,
    unitRef,
    onCityChange,
    onPropertyChange,
    onUnitChange,
    tenants,
    tenantsError,
    onTenantsChange,
}: Props) {
    const [openCity, setOpenCity] = useState(false);
    const [openProperty, setOpenProperty] = useState(false);
    const [openUnit, setOpenUnit] = useState(false);
    return (
        <>
            <FormField
                label="City"
                borderColor="blue"
                error={validationErrors.city}
                required
            >
                <Popover open={openCity} onOpenChange={setOpenCity}>
                    <PopoverTrigger asChild>
                        <Button
                            ref={cityRef}
                            variant="outline"
                            role="combobox"
                            aria-expanded={openCity}
                            className="w-full justify-between"
                        >
                            {selectedCity ? cities.find((c) => c.id === selectedCity)?.city : 'Select city'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
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
                                                    selectedCity === city.id ? 'opacity-100' : 'opacity-0'
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
            </FormField>

            <FormField
                label="Property Name"
                borderColor="green"
                error={validationErrors.property}
                required
            >
                <Popover open={openProperty} onOpenChange={setOpenProperty}>
                    <PopoverTrigger asChild>
                        <Button
                            ref={propertyRef}
                            variant="outline"
                            role="combobox"
                            aria-expanded={openProperty}
                            className="w-full justify-between"
                            disabled={!selectedCity}
                        >
                            {selectedProperty
                                ? availableProperties.find((p) => p.id === selectedProperty)?.property_name
                                : 'Select property'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
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
                                                    selectedProperty === property.id ? 'opacity-100' : 'opacity-0'
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
            </FormField>

            <FormField
                label="Unit Name"
                borderColor="purple"
                error={validationErrors.unit}
                required
            >
                <Popover open={openUnit} onOpenChange={setOpenUnit}>
                    <PopoverTrigger asChild>
                        <Button
                            ref={unitRef}
                            variant="outline"
                            role="combobox"
                            aria-expanded={openUnit}
                            className="w-full justify-between"
                            disabled={!selectedProperty}
                        >
                            {selectedUnit
                                ? availableUnits.find((u) => u.id === selectedUnit)?.unit_name
                                : 'Select unit'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
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
                                                    selectedUnit === unit.id ? 'opacity-100' : 'opacity-0'
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
            </FormField>

            <FormField
                label="Tenants"
                borderColor="orange"
                error={tenantsError}
            >
                <TextInputField
                    id="tenants"
                    value={tenants}
                    onChange={(e) => onTenantsChange(e.target.value)}
                    placeholder="Enter tenant names"
                />
            </FormField>
        </>
    );
}
