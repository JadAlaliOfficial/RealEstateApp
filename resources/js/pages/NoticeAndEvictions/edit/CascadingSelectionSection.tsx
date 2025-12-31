import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { City, PropertyInfoWithoutInsurance, Tenant } from '@/types/NoticeAndEviction';


interface Unit {
    id: number;
    property_id: number;
    unit_name: string;
    property_name: string;
    city_name: string;
}


interface ExtendedTenant extends Tenant {
    unit_id: number;
    full_name: string;
    unit_name: string;
    property_name: string;
    city_name: string;
}


interface ExtendedProperty extends PropertyInfoWithoutInsurance {
    city_id: number;
    city_name: string;
}


interface Props {
    cities: City[];
    filteredProperties: ExtendedProperty[];
    filteredUnits: Unit[];
    filteredTenants: ExtendedTenant[];
    selectedCityId: number | null;
    selectedPropertyId: number | null;
    selectedUnitId: number | null;
    tenantId: number | null;
    onCityChange: (cityId: string) => void;
    onPropertyChange: (propertyId: string) => void;
    onUnitChange: (unitId: string) => void;
    onTenantChange: (tenantId: string) => void;
    validationErrors: { [key: string]: string };
    errors: any;
}


export function CascadingSelectionSection({
    cities,
    filteredProperties,
    filteredUnits,
    filteredTenants,
    selectedCityId,
    selectedPropertyId,
    selectedUnitId,
    tenantId,
    onCityChange,
    onPropertyChange,
    onUnitChange,
    onTenantChange,
    validationErrors,
    errors,
}: Props) {
    const [openCity, setOpenCity] = useState(false);
    const [openProperty, setOpenProperty] = useState(false);
    const [openUnit, setOpenUnit] = useState(false);
    const [openTenant, setOpenTenant] = useState(false);

    const selectedCity = cities.find((city) => city.id === selectedCityId);
    const selectedProperty = filteredProperties.find((property) => property.id === selectedPropertyId);
    const selectedUnit = filteredUnits.find((unit) => unit.id === selectedUnitId);
    const selectedTenant = filteredTenants.find((tenant) => tenant.id === tenantId);

    return (
        <>
            {/* City Combobox */}
            <div className="rounded-lg border-l-4 border-l-blue-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="city" className="text-base font-semibold">
                        City *
                    </Label>
                </div>
                <Popover open={openCity} onOpenChange={setOpenCity}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openCity}
                            className="w-full justify-between"
                        >
                            {selectedCity?.city || 'Select city...'}
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
                                                    selectedCityId === city.id ? 'opacity-100' : 'opacity-0'
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
                {validationErrors.city && <p className="mt-1 text-sm text-red-600">{validationErrors.city}</p>}
            </div>

            {/* Property Combobox */}
            <div className="rounded-lg border-l-4 border-l-indigo-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="property" className="text-base font-semibold">
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
                            disabled={!selectedCityId}
                        >
                            {selectedProperty?.property_name || (selectedCityId ? 'Select property...' : 'Select city first')}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                        <Command>
                            <CommandInput placeholder="Search property..." />
                            <CommandEmpty>No property found.</CommandEmpty>
                            <CommandList>
                                <CommandGroup>
                                    {filteredProperties.map((property) => (
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
                                                    selectedPropertyId === property.id ? 'opacity-100' : 'opacity-0'
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
                {validationErrors.property && <p className="mt-1 text-sm text-red-600">{validationErrors.property}</p>}
            </div>

            {/* Unit Combobox */}
            <div className="rounded-lg border-l-4 border-l-green-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="unit" className="text-base font-semibold">
                        Unit *
                    </Label>
                </div>
                <Popover open={openUnit} onOpenChange={setOpenUnit}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openUnit}
                            className="w-full justify-between"
                            disabled={!selectedPropertyId}
                        >
                            {selectedUnit?.unit_name || (selectedPropertyId ? 'Select unit...' : 'Select property first')}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                        <Command>
                            <CommandInput placeholder="Search unit..." />
                            <CommandEmpty>No unit found.</CommandEmpty>
                            <CommandList>
                                <CommandGroup>
                                    {filteredUnits.map((unit) => (
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
                                                    selectedUnitId === unit.id ? 'opacity-100' : 'opacity-0'
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
                {validationErrors.unit && <p className="mt-1 text-sm text-red-600">{validationErrors.unit}</p>}
            </div>

            {/* Tenant Combobox */}
            <div className="rounded-lg border-l-4 border-l-teal-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="tenant" className="text-base font-semibold">
                        Tenant *
                    </Label>
                </div>
                <Popover open={openTenant} onOpenChange={setOpenTenant}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openTenant}
                            className="w-full justify-between"
                            disabled={!selectedUnitId}
                        >
                            {selectedTenant ? `${selectedTenant.first_name} ${selectedTenant.last_name}` : (selectedUnitId ? 'Select tenant...' : 'Select unit first')}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                        <Command>
                            <CommandInput placeholder="Search tenant..." />
                            <CommandEmpty>No tenant found.</CommandEmpty>
                            <CommandList>
                                <CommandGroup>
                                    {filteredTenants.map((tenant) => (
                                        <CommandItem
                                            key={tenant.id}
                                            value={`${tenant.first_name} ${tenant.last_name}`}
                                            onSelect={() => {
                                                onTenantChange(tenant.id.toString());
                                                setOpenTenant(false);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    'mr-2 h-4 w-4',
                                                    tenantId === tenant.id ? 'opacity-100' : 'opacity-0'
                                                )}
                                            />
                                            {tenant.first_name} {tenant.last_name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                {errors.tenant_id && <p className="mt-1 text-sm text-red-600">{errors.tenant_id}</p>}
                {validationErrors.tenant && <p className="mt-1 text-sm text-red-600">{validationErrors.tenant}</p>}
            </div>
        </>
    );
}
