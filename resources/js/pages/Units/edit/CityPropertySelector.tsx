import React from 'react';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PropertyInfoWithoutInsurance } from '@/types/PropertyInfoWithoutInsurance';
import FormSection from './FormSection';

interface CityPropertySelectorProps {
    cities: Array<{ id: number; city: string }>;
    selectedCityId: string;
    onCityChange: (cityId: string) => void;
    availableProperties: PropertyInfoWithoutInsurance[];
    propertyId: string;
    onPropertyChange: (propertyId: string) => void;
    propertyRef: React.RefObject<HTMLButtonElement>;
    validationError: string;
    propertyValidationError: string;
    propertyError?: string;
}

export default function CityPropertySelector({
    cities,
    selectedCityId,
    onCityChange,
    availableProperties,
    propertyId,
    onPropertyChange,
    propertyRef,
    validationError,
    propertyValidationError,
    propertyError,
}: CityPropertySelectorProps) {
    return (
        <>
            {/* City Selection */}
            <FormSection borderColor="border-l-blue-500">
                <div className="mb-2">
                    <Label htmlFor="city" className="text-base font-semibold">
                        City *
                    </Label>
                </div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={false}
                            className="w-full justify-between"
                        >
                            {selectedCityId
                                ? cities.find((c) => c.id.toString() === selectedCityId)?.city
                                : 'Select a city'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                            <CommandInput placeholder="Search city..." />
                            <CommandEmpty>No city found.</CommandEmpty>
                            <CommandGroup>
                                {cities?.map((city) => {
                                    const isSelected = selectedCityId === city.id.toString();
                                    return (
                                        <CommandItem
                                            key={city.id}
                                            value={city.city}
                                            onSelect={() => onCityChange(city.id.toString())}
                                        >
                                            <Check
                                                className={cn(
                                                    'mr-2 h-4 w-4',
                                                    isSelected ? 'opacity-100' : 'opacity-0'
                                                )}
                                            />
                                            {city.city}
                                        </CommandItem>
                                    );
                                }) || []}
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>
                {validationError && <p className="mt-1 text-sm text-red-600">{validationError}</p>}
            </FormSection>

            {/* Property Selection */}
            <FormSection borderColor="border-l-green-500">
                <div className="mb-2">
                    <Label htmlFor="property_id" className="text-base font-semibold">
                        Property *
                    </Label>
                </div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            ref={propertyRef as React.RefObject<HTMLButtonElement>}
                            variant="outline"
                            role="combobox"
                            aria-expanded={false}
                            className="w-full justify-between"
                            disabled={!selectedCityId || availableProperties.length === 0}
                        >
                            {propertyId
                                ? availableProperties.find((p) => p.id.toString() === propertyId)?.property_name
                                : !selectedCityId
                                    ? 'Select city first'
                                    : 'Select property'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                            <CommandInput placeholder="Search property..." />
                            <CommandEmpty>No property found.</CommandEmpty>
                            <CommandGroup>
                                {availableProperties?.map((property) => {
                                    const isSelected = propertyId === property.id.toString();
                                    return (
                                        <CommandItem
                                            key={property.id}
                                            value={property.property_name}
                                            onSelect={() => onPropertyChange(property.id.toString())}
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
                                }) || []}
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>
                {propertyError && <p className="mt-1 text-sm text-red-600">{propertyError}</p>}
                {propertyValidationError && <p className="mt-1 text-sm text-red-600">{propertyValidationError}</p>}
            </FormSection>
        </>
    );
}
