import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';

interface VendorNameFieldProps {
    vendorNameRef: React.RefObject<HTMLInputElement>;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    validationError?: string;
}

export default function VendorNameField({ vendorNameRef, value, onChange, error, validationError }: VendorNameFieldProps) {
    return (
        <div className="rounded-lg border-l-4 border-l-green-500 p-4">
            <div className="mb-2">
                <Label htmlFor="vendor_name" className="text-base font-semibold">
                    Vendor Name *
                </Label>
            </div>
            <Input
                ref={vendorNameRef}
                id="vendor_name"
                value={value}
                onChange={onChange}
                placeholder="Enter vendor name"
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            {validationError && <p className="mt-1 text-sm text-red-600">{validationError}</p>}
        </div>
    );
}
