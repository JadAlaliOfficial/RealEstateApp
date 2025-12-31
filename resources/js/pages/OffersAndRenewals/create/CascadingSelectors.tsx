import { useMemo, RefObject, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HierarchicalData {
    id: number;
    name: string;
    properties: {
        id: number;
        name: string;
        city_id: number;
        units: {
            id: number;
            name: string;
            property_id: number;
            tenants: {
                id: number;
                name: string;
                first_name: string;
                last_name: string;
                unit_id: number;
            }[];
        }[];
    }[];
}

interface CascadingSelectorsProps {
    hierarchicalData: HierarchicalData[];
    cityId: string;
    propertyId: string;
    unitId: string;
    tenantId: string;
    otherTenants: string;
    onCityChange: (cityId: string) => void;
    onPropertyChange: (propertyId: string) => void;
    onUnitChange: (unitId: string) => void;
    onTenantChange: (tenantId: string) => void;
    onOtherTenantsChange: (value: string) => void;
    errors: {
        city_id?: string;
        property_id?: string;
        unit_id?: string;
        tenant_id?: string;
    };
    validationErrors: {
        city?: string;
        property?: string;
        unit?: string;
        tenant?: string;
    };
    cityRef: RefObject<HTMLButtonElement | null>;
    propertyRef: RefObject<HTMLButtonElement | null>;
    unitRef: RefObject<HTMLButtonElement | null>;
    tenantRef: RefObject<HTMLButtonElement | null>;
}

export default function CascadingSelectors({
    hierarchicalData,
    cityId,
    propertyId,
    unitId,
    tenantId,
    otherTenants,
    onCityChange,
    onPropertyChange,
    onUnitChange,
    onTenantChange,
    onOtherTenantsChange,
    errors,
    validationErrors,
    cityRef,
    propertyRef,
    unitRef,
    tenantRef,
}: CascadingSelectorsProps) {
    const availableProperties = useMemo(() => {
        if (!cityId) return [];
        const selectedCity = hierarchicalData.find(city => city.id.toString() === cityId);
        return selectedCity ? selectedCity.properties : [];
    }, [hierarchicalData, cityId]);

    const availableUnits = useMemo(() => {
        if (!propertyId) return [];
        const selectedProperty = availableProperties.find(property => property.id.toString() === propertyId);
        return selectedProperty ? selectedProperty.units : [];
    }, [availableProperties, propertyId]);

    const availableTenants = useMemo(() => {
        if (!unitId) return [];
        const selectedUnit = availableUnits.find(unit => unit.id.toString() === unitId);
        return selectedUnit ? selectedUnit.tenants : [];
    }, [availableUnits, unitId]);

    const [cityOpen, setCityOpen] = useState(false);
    const [propertyOpen, setPropertyOpen] = useState(false);
    const [unitOpen, setUnitOpen] = useState(false);
    const [tenantOpen, setTenantOpen] = useState(false);

    const selectedCityLabel = useMemo(() => {
        const found = hierarchicalData.find((c) => c.id.toString() === cityId);
        return found ? found.name : '';
    }, [hierarchicalData, cityId]);

    const selectedPropertyLabel = useMemo(() => {
        const found = availableProperties.find((p) => p.id.toString() === propertyId);
        return found ? found.name : '';
    }, [availableProperties, propertyId]);

    const selectedUnitLabel = useMemo(() => {
        const found = availableUnits.find((u) => u.id.toString() === unitId);
        return found ? found.name : '';
    }, [availableUnits, unitId]);

    const selectedTenantLabel = useMemo(() => {
        const found = availableTenants.find((t) => t.id.toString() === tenantId);
        return found ? found.name : '';
    }, [availableTenants, tenantId]);

    const [showOtherTenantsDropdown, setShowOtherTenantsDropdown] = useState(false);
    
    // Update filtered tenants when available tenants change
    const [filteredTenants, setFilteredTenants] = useState(availableTenants);
    
    // Update filtered tenants when availableTenants changes
    useMemo(() => {
        setFilteredTenants(availableTenants);
    }, [availableTenants]);

    const handleOtherTenantsInputChange = (value: string) => {
        onOtherTenantsChange(value);
        
        // Filter tenants based on input
        if (value.trim() === '') {
            setFilteredTenants(availableTenants);
        } else {
            const filtered = availableTenants.filter(tenant =>
                tenant.name.toLowerCase().includes(value.toLowerCase()) ||
                tenant.first_name.toLowerCase().includes(value.toLowerCase()) ||
                tenant.last_name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredTenants(filtered);
        }
        setShowOtherTenantsDropdown(true);
    };

    const handleTenantSelect = (tenant: any) => {
        onOtherTenantsChange(tenant.name);
        setShowOtherTenantsDropdown(false);
    };

    return (
        <>
            <div className="rounded-lg border-l-4 border-l-indigo-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="city" className="text-base font-semibold">
                        City *
                    </Label>
                </div>
                <Popover open={cityOpen} onOpenChange={setCityOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            ref={cityRef}
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
                                    {hierarchicalData.map((city) => {
                                        const idStr = city.id.toString();
                                        const isSelected = cityId === idStr;
                                        return (
                                            <CommandItem
                                                key={city.id}
                                                value={city.name}
                                                onSelect={() => {
                                                    onCityChange(idStr);
                                                    setCityOpen(false);
                                                }}
                                            >
                                                <Check className={cn('mr-2 h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')} />
                                                {city.name}
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                {errors.city_id && <p className="mt-1 text-sm text-red-600">{errors.city_id}</p>}
                {validationErrors.city && <p className="mt-1 text-sm text-red-600">{validationErrors.city}</p>}
            </div>

            <div className="rounded-lg border-l-4 border-l-blue-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="property" className="text-base font-semibold">
                        Property *
                    </Label>
                </div>
                <Popover open={propertyOpen} onOpenChange={setPropertyOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            ref={propertyRef}
                            role="combobox"
                            aria-expanded={propertyOpen}
                            variant="outline"
                            className="w-full justify-between text-left font-normal"
                            disabled={!cityId || availableProperties.length === 0}
                        >
                            {selectedPropertyLabel || (!cityId ? 'Select city first' : availableProperties.length === 0 ? 'No properties available' : 'Select property')}
                            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                        <Command>
                            <CommandInput placeholder="Search property..." />
                            <CommandList>
                                <CommandEmpty>No property found.</CommandEmpty>
                                <CommandGroup>
                                    {availableProperties.map((property) => {
                                        const idStr = property.id.toString();
                                        const isSelected = propertyId === idStr;
                                        return (
                                            <CommandItem
                                                key={property.id}
                                                value={property.name}
                                                onSelect={() => {
                                                    onPropertyChange(idStr);
                                                    setPropertyOpen(false);
                                                }}
                                            >
                                                <Check className={cn('mr-2 h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')} />
                                                {property.name}
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                {errors.property_id && <p className="mt-1 text-sm text-red-600">{errors.property_id}</p>}
                {validationErrors.property && <p className="mt-1 text-sm text-red-600">{validationErrors.property}</p>}
            </div>

            <div className="rounded-lg border-l-4 border-l-green-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="unit" className="text-base font-semibold">
                        Unit *
                    </Label>
                </div>
                <Popover open={unitOpen} onOpenChange={setUnitOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            ref={unitRef}
                            role="combobox"
                            aria-expanded={unitOpen}
                            variant="outline"
                            className="w-full justify-between text-left font-normal"
                            disabled={!propertyId || availableUnits.length === 0}
                        >
                            {selectedUnitLabel || (!propertyId ? 'Select property first' : availableUnits.length === 0 ? 'No units available' : 'Select unit')}
                            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                        <Command>
                            <CommandInput placeholder="Search unit..." />
                            <CommandList>
                                <CommandEmpty>No unit found.</CommandEmpty>
                                <CommandGroup>
                                    {availableUnits.map((unit) => {
                                        const idStr = unit.id.toString();
                                        const isSelected = unitId === idStr;
                                        return (
                                            <CommandItem
                                                key={unit.id}
                                                value={unit.name}
                                                onSelect={() => {
                                                    onUnitChange(idStr);
                                                    setUnitOpen(false);
                                                }}
                                            >
                                                <Check className={cn('mr-2 h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')} />
                                                {unit.name}
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                {errors.unit_id && <p className="mt-1 text-sm text-red-600">{errors.unit_id}</p>}
                {validationErrors.unit && <p className="mt-1 text-sm text-red-600">{validationErrors.unit}</p>}
            </div>

            <div className="rounded-lg border-l-4 border-l-purple-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="tenant" className="text-base font-semibold">
                        Tenant *
                    </Label>
                </div>
                <Popover open={tenantOpen} onOpenChange={setTenantOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            ref={tenantRef}
                            role="combobox"
                            aria-expanded={tenantOpen}
                            variant="outline"
                            className="w-full justify-between text-left font-normal"
                            disabled={!unitId || availableTenants.length === 0}
                        >
                            {selectedTenantLabel || (!unitId ? 'Select unit first' : availableTenants.length === 0 ? 'No tenants available' : 'Select tenant')}
                            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                        <Command>
                            <CommandInput placeholder="Search tenant..." />
                            <CommandList>
                                <CommandEmpty>No tenant found.</CommandEmpty>
                                <CommandGroup>
                                    {availableTenants.map((tenant) => {
                                        const idStr = tenant.id.toString();
                                        const isSelected = tenantId === idStr;
                                        return (
                                            <CommandItem
                                                key={tenant.id}
                                                value={tenant.name}
                                                onSelect={() => {
                                                    onTenantChange(idStr);
                                                    setTenantOpen(false);
                                                }}
                                            >
                                                <Check className={cn('mr-2 h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')} />
                                                {tenant.name}
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                {errors.tenant_id && <p className="mt-1 text-sm text-red-600">{errors.tenant_id}</p>}
                {validationErrors.tenant && <p className="mt-1 text-sm text-red-600">{validationErrors.tenant}</p>}
            </div>

            {/* Other Tenant Names Input */}
            <div className="rounded-lg border-l-4 border-l-pink-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="other_tenants" className="text-base font-semibold">
                        Other Tenant Names
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                        You can select from the dropdown or type custom names
                    </p>
                </div>
                <div className="relative">
                    <Input
                        id="other_tenants"
                        type="text"
                        placeholder="Type tenant names or select from dropdown"
                        value={otherTenants}
                        onChange={(e) => handleOtherTenantsInputChange(e.target.value)}
                        onFocus={() => {
                            setFilteredTenants(availableTenants);
                            setShowOtherTenantsDropdown(availableTenants.length > 0);
                        }}
                        onBlur={() => {
                            // Delay hiding dropdown to allow for clicks
                            setTimeout(() => setShowOtherTenantsDropdown(false), 200);
                        }}
                        disabled={!unitId || availableTenants.length === 0}
                        className="w-full"
                    />
                    
                    {showOtherTenantsDropdown && filteredTenants.length > 0 && (
                        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border border-input bg-popover shadow-lg">
                            {filteredTenants.map((tenant) => (
                                <div
                                    key={tenant.id}
                                    className="cursor-pointer px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                                    onClick={() => handleTenantSelect(tenant)}
                                >
                                    {tenant.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
