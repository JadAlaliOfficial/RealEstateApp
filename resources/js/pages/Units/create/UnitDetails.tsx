import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { forwardRef } from 'react';

interface Props {
    unitName: string;
    onUnitNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    validationError?: string;
}

const UnitDetails = forwardRef<HTMLInputElement, Props>(
    ({ unitName, onUnitNameChange, error, validationError }, ref) => {
        return (
            <div className="rounded-lg border-l-4 border-l-purple-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="unit_name" className="text-base font-semibold">
                        Unit Name *
                    </Label>
                </div>
                <Input
                    id="unit_name"
                    ref={ref}
                    value={unitName}
                    onChange={onUnitNameChange}
                    placeholder="Enter unit name"
                />
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                {validationError && <p className="mt-1 text-sm text-red-600">{validationError}</p>}
            </div>
        );
    }
);

UnitDetails.displayName = 'UnitDetails';

export default UnitDetails;
