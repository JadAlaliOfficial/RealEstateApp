import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FormSection from './FormSection';

interface UnitDetailsFieldsProps {
    unitName: string;
    onUnitNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    unitNameRef: React.RefObject<HTMLInputElement>;
    unitNameError?: string;
    unitNameValidationError: string;
    tenants: string;
    onTenantsChange: (value: string) => void;
    tenantsError?: string;
}

export default function UnitDetailsFields({
    unitName,
    onUnitNameChange,
    unitNameRef,
    unitNameError,
    unitNameValidationError,
    tenants,
    onTenantsChange,
    tenantsError,
}: UnitDetailsFieldsProps) {
    return (
        <>
            {/* Unit Name */}
            <FormSection borderColor="border-l-purple-500">
                <div className="mb-2">
                    <Label htmlFor="unit_name" className="text-base font-semibold">
                        Unit Name *
                    </Label>
                </div>
                <Input
                    id="unit_name"
                    ref={unitNameRef}
                    value={unitName}
                    onChange={onUnitNameChange}
                    placeholder="Enter unit name"
                />
                {unitNameError && <p className="mt-1 text-sm text-red-600">{unitNameError}</p>}
                {unitNameValidationError && <p className="mt-1 text-sm text-red-600">{unitNameValidationError}</p>}
            </FormSection>

            {/* Tenants */}
            <FormSection borderColor="border-l-orange-500">
                <div className="mb-2">
                    <Label htmlFor="tenants" className="text-base font-semibold">
                        Tenants
                    </Label>
                </div>
                <Input
                    id="tenants"
                    value={tenants}
                    onChange={(e) => onTenantsChange(e.target.value)}
                    placeholder="Enter tenant names"
                />
                {tenantsError && <p className="mt-1 text-sm text-red-600">{tenantsError}</p>}
            </FormSection>
        </>
    );
}
