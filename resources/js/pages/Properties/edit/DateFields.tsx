// resources/js/pages/Properties/edit/DateFields.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, X } from 'lucide-react';

interface DateFieldsProps {
    effectiveDateValue: string;
    expirationDateValue: string;
    onEffectiveDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onExpirationDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    effectiveDateError?: string;
    expirationDateError?: string;
}

/**
 * Dates section for effective and expiration dates
 * Both fields are OPTIONAL - only date format validation from backend
 */
export default function DateFields({
    effectiveDateValue,
    expirationDateValue,
    onEffectiveDateChange,
    onExpirationDateChange,
    effectiveDateError,
    expirationDateError
}: DateFieldsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Effective date field - optional */}
            <div className="rounded-lg border-l-4 border-l-indigo-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="effective_date" className="text-base font-semibold">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Effective Date (Optional)
                    </Label>
                </div>
                <div className="relative group">
                    <Input
                        id="effective_date"
                        type="date"
                        value={effectiveDateValue}
                        onChange={onEffectiveDateChange}
                        className="pr-10"
                    />
                    <button
                        type="button"
                        title="Clear date"
                        aria-label="Clear effective date"
                        className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-md p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onClick={() =>
                            onEffectiveDateChange({
                                target: { value: '' }
                            } as unknown as React.ChangeEvent<HTMLInputElement>)
                        }
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
                {/* Only show backend validation errors if any */}
                {effectiveDateError && (
                    <p className="mt-1 text-sm text-red-600">{effectiveDateError}</p>
                )}
            </div>

            {/* Expiration date field - optional */}
            <div className="rounded-lg border-l-4 border-l-teal-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="expiration_date" className="text-base font-semibold">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Expiration Date (Optional)
                    </Label>
                </div>
                <div className="relative group">
                    <Input
                        id="expiration_date"
                        type="date"
                        value={expirationDateValue}
                        onChange={onExpirationDateChange}
                        className="pr-10"
                    />
                    <button
                        type="button"
                        title="Clear date"
                        aria-label="Clear expiration date"
                        className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-md p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        onClick={() =>
                            onExpirationDateChange({
                                target: { value: '' }
                            } as unknown as React.ChangeEvent<HTMLInputElement>)
                        }
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
                {/* Only show backend validation errors if any */}
                {expirationDateError && (
                    <p className="mt-1 text-sm text-red-600">{expirationDateError}</p>
                )}
            </div>
        </div>
    );
}
