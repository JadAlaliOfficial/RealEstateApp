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
import { useMemo, useRef, useState } from 'react';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CityData {
    id: number;
    name: string;
}

interface PropertyData {
    id: number;
    name: string;
    city_id: number;
}

interface UnitData {
    id: number;
    name: string;
    property_id: number;
}

interface Props {
    cities: CityData[];
    selectedCityId: number | null;
    selectedPropertyId: number | null;
    selectedUnitId: number | null;
    availableProperties: PropertyData[];
    availableUnits: UnitData[];
    onCityChange: (cityId: string) => void;
    onPropertyChange: (propertyId: string) => void;
    onUnitChange: (unitId: string) => void;
    errors: Record<string, string>;
    validationErrors: {
        city?: string;
        property?: string;
        unit?: string;
    };
}

export function CityPropertyUnitSelector({
    cities,
    selectedCityId,
    selectedPropertyId,
    selectedUnitId,
    availableProperties,
    availableUnits,
    onCityChange,
    onPropertyChange,
    onUnitChange,
    errors,
    validationErrors,
}: Props) {
    const cityRef = useRef<HTMLButtonElement>(null);
    const propertyRef = useRef<HTMLButtonElement>(null);
    const unitRef = useRef<HTMLButtonElement>(null);

    const [cityOpen, setCityOpen] = useState(false);
    const [propertyOpen, setPropertyOpen] = useState(false);
    const [unitOpen, setUnitOpen] = useState(false);

    const selectedCityLabel = useMemo(() => {
        const found = cities?.find((c) => c.id.toString() === (selectedCityId?.toString() || ''));
        return found ? found.name : '';
    }, [cities, selectedCityId]);

    const selectedPropertyLabel = useMemo(() => {
        const found = availableProperties?.find((p) => p.id.toString() === (selectedPropertyId?.toString() || ''));
        return found ? found.name : '';
    }, [availableProperties, selectedPropertyId]);

    const selectedUnitLabel = useMemo(() => {
        const found = availableUnits?.find((u) => u.id.toString() === (selectedUnitId?.toString() || ''));
        return found ? found.name : '';
    }, [availableUnits, selectedUnitId]);

    return (
        <>
            {/* City Selection */}
            <div className="rounded-lg border-l-4 border-l-blue-500 p-4">
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
                                    {cities?.map((city) => {
                                        const idStr = city.id.toString();
                                        const isSelected = selectedCityId?.toString() === idStr;
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
                                    }) || []}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                {errors.unit_id && <p className="mt-1 text-sm text-red-600">{errors.unit_id}</p>}
                {validationErrors.city && <p className="mt-1 text-sm text-red-600">{validationErrors.city}</p>}
            </div>

            {/* Property Selection */}
            <div className="rounded-lg border-l-4 border-l-green-500 p-4">
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
                            disabled={!selectedCityId}
                        >
                            {selectedPropertyLabel || (selectedCityId ? 'Select property' : 'Select city first')}
                            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                        <Command>
                            <CommandInput placeholder="Search property..." />
                            <CommandList>
                                <CommandEmpty>No property found.</CommandEmpty>
                                <CommandGroup>
                                    {availableProperties?.map((property) => {
                                        const idStr = property.id.toString();
                                        const isSelected = selectedPropertyId?.toString() === idStr;
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
                                    }) || []}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                {errors.unit_id && <p className="mt-1 text-sm text-red-600">{errors.unit_id}</p>}
                {validationErrors.property && <p className="mt-1 text-sm text-red-600">{validationErrors.property}</p>}
            </div>

            {/* Unit Selection */}
            <div className="rounded-lg border-l-4 border-l-purple-500 p-4">
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
                            disabled={!selectedPropertyId}
                        >
                            {selectedUnitLabel || (selectedPropertyId ? 'Select unit' : 'Select property first')}
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
                                        const isSelected = selectedUnitId?.toString() === idStr;
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
                                    }) || []}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                {errors.unit_id && <p className="mt-1 text-sm text-red-600">{errors.unit_id}</p>}
                {validationErrors.unit && <p className="mt-1 text-sm text-red-600">{validationErrors.unit}</p>}
            </div>
        </>
    );
}
