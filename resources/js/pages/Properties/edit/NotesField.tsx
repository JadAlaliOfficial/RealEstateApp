// resources/js/pages/Properties/edit/NotesField.tsx
import React, { forwardRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileText } from 'lucide-react';

interface NotesFieldProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    error?: string;
}

/**
 * Notes field for additional information
 * This field is OPTIONAL - no validation needed
 */
const NotesField = forwardRef<HTMLTextAreaElement, NotesFieldProps>(
    ({ value, onChange, error }, ref) => {
        return (
            <div className="rounded-lg border-l-4 border-l-purple-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="notes" className="text-base font-semibold">
                        <FileText className="h-4 w-4 inline mr-1" />
                        Notes (Optional)
                    </Label>
                </div>
                <Textarea
                    ref={ref}
                    id="notes"
                    name="notes"
                    value={value}
                    onChange={onChange}
                    placeholder="Enter any additional notes about this property insurance..."
                    rows={4}
                    className={`w-full ${error ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {/* Only show backend validation errors if any */}
                {error && (
                    <p className="mt-1 text-sm text-red-600">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

NotesField.displayName = 'NotesField';

export default NotesField;
