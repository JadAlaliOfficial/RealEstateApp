import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RotateCcw, Search } from 'lucide-react';
// Using string arrays for city, property, and unit suggestions

interface TenantFiltersProps {
    cities: string[];
    properties: string[];
    uniqueUnitNames: string[];
    onSearch: (filters: FilterState) => void;
    onClear: () => void;
    initialFilters?: FilterState;
}

export interface FilterState {
    city: string;
    property: string;
    unitName: string;
    search: string;
}

export const TenantFilters: React.FC<TenantFiltersProps> = ({
    cities,
    properties,
    uniqueUnitNames,
    onSearch,
    onClear,
    initialFilters = { city: '', property: '', unitName: '', search: '' },
}) => {
    const [filters, setFilters] = useState<FilterState>(initialFilters);
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);
    const [showUnitDropdown, setShowUnitDropdown] = useState(false);

    const cityDropdownRef = useRef<HTMLDivElement>(null);
    const propertyDropdownRef = useRef<HTMLDivElement>(null);
    const unitDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
                setShowCityDropdown(false);
            }
            if (propertyDropdownRef.current && !propertyDropdownRef.current.contains(event.target as Node)) {
                setShowPropertyDropdown(false);
            }
            if (unitDropdownRef.current && !unitDropdownRef.current.contains(event.target as Node)) {
                setShowUnitDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleCitySelect = (cityName: string) => {
        handleFilterChange('city', cityName);
        setShowCityDropdown(false);
    };

    const handlePropertySelect = (propertyName: string) => {
        handleFilterChange('property', propertyName);
        setShowPropertyDropdown(false);
    };

    const handleUnitSelect = (unitName: string) => {
        handleFilterChange('unitName', unitName);
        setShowUnitDropdown(false);
    };

    const filteredCities = cities.filter((cityName) => cityName.toLowerCase().includes(filters.city.toLowerCase()));

    const filteredProperties = properties.filter((propertyName) =>
        propertyName.toLowerCase().includes(filters.property.toLowerCase())
    );

    const filteredUnitNames = uniqueUnitNames.filter((unitName) => unitName.toLowerCase().includes(filters.unitName.toLowerCase()));

    return (
        <div className="relative z-20 grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* City Filter */}
            <div className="relative" ref={cityDropdownRef}>
                <Input
                    type="text"
                    placeholder="City"
                    value={filters.city}
                    onChange={(e) => {
                        const value = e.target.value;
                        handleFilterChange('city', value);
                        setShowCityDropdown(true);
                    }}
                    onFocus={() => setShowCityDropdown(true)}
                    className="text-input-foreground bg-input"
                />
                {showCityDropdown && filteredCities.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-50 mb-1 max-h-60 overflow-auto rounded-md border border-input bg-popover shadow-lg">
                        {filteredCities.map((cityName) => (
                            <div
                                key={cityName}
                                className="cursor-pointer px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                                onClick={() => handleCitySelect(cityName)}
                            >
                                {cityName}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Property Filter */}
            <div className="relative" ref={propertyDropdownRef}>
                <Input
                    type="text"
                    placeholder="Property"
                    value={filters.property}
                    onChange={(e) => {
                        const value = e.target.value;
                        handleFilterChange('property', value);
                        setShowPropertyDropdown(true);
                    }}
                    onFocus={() => setShowPropertyDropdown(true)}
                    className="text-input-foreground bg-input"
                />
                {showPropertyDropdown && filteredProperties.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-50 mb-1 max-h-60 overflow-auto rounded-md border border-input bg-popover shadow-lg">
                        {filteredProperties.map((propertyName) => (
                            <div
                                key={propertyName}
                                className="cursor-pointer px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                                onClick={() => handlePropertySelect(propertyName)}
                            >
                                {propertyName}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Unit Name Filter */}
            <div className="relative" ref={unitDropdownRef}>
                <Input
                    type="text"
                    placeholder="Unit Name"
                    value={filters.unitName}
                    onChange={(e) => {
                        const value = e.target.value;
                        handleFilterChange('unitName', value);
                        setShowUnitDropdown(true);
                    }}
                    onFocus={() => setShowUnitDropdown(true)}
                    className="text-input-foreground bg-input"
                />
                {showUnitDropdown && filteredUnitNames.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-50 mb-1 max-h-60 overflow-auto rounded-md border border-input bg-popover shadow-lg">
                        {filteredUnitNames.map((unitName) => (
                            <div
                                key={unitName}
                                className="cursor-pointer px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                                onClick={() => handleUnitSelect(unitName)}
                            >
                                {unitName}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Search Filter */}
            <div className="flex gap-2">
                <Input
                    type="text"
                    placeholder="Search tenants..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="text-input-foreground bg-input flex-1"
                />
                <Button type="button" onClick={() => onSearch(filters)} size="sm">
                    <Search className="h-4 w-4" />
                </Button>
                <Button type="button" onClick={onClear} size="sm" variant="outline" title="Clear all filters">
                    <RotateCcw className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};
