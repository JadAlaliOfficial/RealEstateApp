import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface OwesFieldProps {
    data: any;
    handleOwesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    owesRef: React.RefObject<HTMLInputElement>;
    errors: any;
    owesValidationError: string;
}

export default function OwesField({
    data,
    handleOwesChange,
    owesRef,
    errors,
    owesValidationError,
}: OwesFieldProps) {
    return (
        <div className="rounded-lg border-l-4 border-l-teal-500 p-4">
            <div className="mb-2">
                <Label htmlFor="owes" className="text-base font-semibold">
                    Owes *
                </Label>
            </div>
            <Input
                ref={owesRef}
                id="owes"
                type="number"
                step="0.01"
                min="0"
                value={data.owes}
                onChange={handleOwesChange}
                placeholder="Enter amount owed"
            />
            {errors.owes && <p className="mt-1 text-sm text-red-600">{errors.owes}</p>}
            {owesValidationError && <p className="mt-1 text-sm text-red-600">{owesValidationError}</p>}
        </div>
    );
}
