import { useMemo, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface Tenant {
    id: number;
    first_name: string;
    last_name: string;
}

interface Props {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    tenants?: Tenant[];
    disabled?: boolean;
}

export default function OtherTenantsField({ value, onChange, error, tenants = [], disabled = false }: Props) {
    const [showOtherTenantsDropdown, setShowOtherTenantsDropdown] = useState(false);

    // Update filtered tenants when available tenants change
    const [filteredTenants, setFilteredTenants] = useState(tenants);

    // Update filtered tenants when tenants prop changes
    useMemo(() => {
        setFilteredTenants(tenants);
    }, [tenants]);

    const handleOtherTenantsInputChange = (inputValue: string) => {
        onChange(inputValue);

        // Filter tenants based on input
        if (inputValue.trim() === '') {
            setFilteredTenants(tenants);
        } else {
            const filtered = tenants.filter(
                (tenant) =>
                    `${tenant.first_name} ${tenant.last_name}`
                        .toLowerCase()
                        .includes(inputValue.toLowerCase()) ||
                    tenant.first_name.toLowerCase().includes(inputValue.toLowerCase()) ||
                    tenant.last_name.toLowerCase().includes(inputValue.toLowerCase())
            );
            setFilteredTenants(filtered);
        }
        setShowOtherTenantsDropdown(true);
    };

    const handleTenantSelect = (tenant: Tenant) => {
        const tenantFullName = `${tenant.first_name} ${tenant.last_name}`;
        onChange(tenantFullName);
        setShowOtherTenantsDropdown(false);
    };

    return (
        <div className="rounded-lg border-l-4 border-l-pink-500 p-4">
            <div className="mb-2">
                <Label htmlFor="other_tenants" className="text-base font-semibold">
                    Other Tenant Names
                </Label>
                <p className="text-sm text-gray-600 mt-1">You can select from the dropdown or type custom names</p>
            </div>
            <div className="relative">
                <Input
                    id="other_tenants"
                    type="text"
                    placeholder={disabled ? 'Select a unit first' : 'Type tenant names or select from dropdown'}
                    value={value}
                    onChange={(e) => handleOtherTenantsInputChange(e.target.value)}
                    onFocus={() => {
                        if (!disabled) {
                            setFilteredTenants(tenants);
                            setShowOtherTenantsDropdown(tenants.length > 0);
                        }
                    }}
                    onBlur={() => {
                        // Delay hiding dropdown to allow for clicks
                        setTimeout(() => setShowOtherTenantsDropdown(false), 200);
                    }}
                    disabled={disabled}
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
                                {tenant.first_name} {tenant.last_name}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
