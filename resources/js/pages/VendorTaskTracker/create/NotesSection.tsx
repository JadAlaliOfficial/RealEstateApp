import { Label } from '@/components/ui/label';
import React from 'react';

interface NotesSectionProps {
    notes: string;
    onNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
   errors: Partial<Record<string, string>>; // Changed from Record<string, string>

}

export default function NotesSection({
    notes,
    onNotesChange,
    errors
}: NotesSectionProps) {
    return (
        <div className="rounded-lg border-l-4 border-l-pink-500 p-4">
            <div className="mb-2">
                <Label htmlFor="notes" className="text-base font-semibold">
                    Notes
                </Label>
            </div>
            <textarea
                id="notes"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={notes}
                onChange={onNotesChange}
                rows={3}
                placeholder="Enter any additional notes..."
            />
            {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
        </div>
    );
}
