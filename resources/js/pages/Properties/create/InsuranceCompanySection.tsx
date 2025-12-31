// resources/js/Pages/Properties/create/InsuranceCompanySection.tsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Shield } from 'lucide-react';

interface InsuranceCompanySectionProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errors: any;
}

/**
 * Insurance company section
 * OPTIONAL field - no validation needed, user can leave blank
 */
export default function InsuranceCompanySection({
    value,
    onChange,
    errors
}: InsuranceCompanySectionProps) {
    return (
        <div className="rounded-lg border-l-4 border-l-orange-500 p-4">
            <div className="mb-2">
                <Label htmlFor="insurance_company_name" className="text-base font-semibold">
                    <Shield className="h-4 w-4 inline mr-1" />
                    Insurance Company (Optional)
                </Label>
            </div>
            <Input
                id="insurance_company_name"
                value={value}
                onChange={onChange}
                placeholder="Enter insurance company name"
            />
            {/* Only show backend validation errors if any */}
            {errors.insurance_company_name && (
                <p className="mt-1 text-sm text-red-600">{errors.insurance_company_name}</p>
            )}
        </div>
    );
}
