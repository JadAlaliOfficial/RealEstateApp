import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { PropertyFilters as PropertyFiltersType } from '@/types/property';

interface PropertyFiltersProps {
    filters: PropertyFiltersType;
    onFilterChange: (key: keyof PropertyFiltersType, value: string) => void;
    onSearch: () => void;
    onClear: () => void;
}

export default function PropertyFilters({
    filters,
    onFilterChange,
    onSearch,
    onClear,
}: PropertyFiltersProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <Input
                type="text"
                placeholder="Property Name"
                value={filters.property_name || ''}
                onChange={(e) => onFilterChange('property_name', e.target.value)}
                className="bg-input text-input-foreground"
            />
            <Input
                type="text"
                placeholder="Insurance Company"
                value={filters.insurance_company_name || ''}
                onChange={(e) => onFilterChange('insurance_company_name', e.target.value)}
                className="bg-input text-input-foreground"
            />
            <Input
                type="text"
                placeholder="Policy Number"
                value={filters.policy_number || ''}
                onChange={(e) => onFilterChange('policy_number', e.target.value)}
                className="bg-input text-input-foreground"
            />
            <select
                value={filters.status || ''}
                onChange={(e) => onFilterChange('status', e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
            </select>
            <div className="flex justify-around">
                <Button
                    variant="outline"
                    onClick={onClear}
                    className="flex items-center"
                >
                    <X className="h-4 w-4 mr-2" />
                    Clear
                </Button>
                <Button
                    onClick={onSearch}
                    className="flex items-center"
                >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                </Button>
            </div>
        </div>
    );
}
