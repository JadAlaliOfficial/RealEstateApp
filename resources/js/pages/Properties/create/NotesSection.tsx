// resources/js/Pages/Properties/create/NotesSection.tsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface NotesSectionProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    errors: any;
}

/**
 * Notes section for additional information
 * This field is OPTIONAL - no validation needed
 */
export default function NotesSection({
    value,
    onChange,
    errors
}: NotesSectionProps) {
    const hasError = errors?.notes;

    return (
        <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
                Notes (Optional)
            </Label>
            <Textarea
                id="notes"
                name="notes"
                value={value}
                onChange={onChange}
                placeholder="Enter any additional notes about this property insurance..."
                rows={4}
                className={`w-full ${hasError ? 'border-red-500 focus:border-red-500' : ''}`}
            />
            {/* Only show backend validation errors if any */}
            {hasError && (
                <p className="text-sm text-red-600">
                    {errors.notes}
                </p>
            )}
        </div>
    );
}
