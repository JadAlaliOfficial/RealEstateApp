import { Label } from '@/components/ui/label';

interface AdditionalFieldsSectionProps {
    notes: string;
    onNotesChange: (value: string) => void;
    errors: {
        notes?: string;
    };
}

export default function AdditionalFieldsSection({
    notes,
    onNotesChange,
    errors,
}: AdditionalFieldsSectionProps) {
    return (
        <div className="rounded-lg border-l-4 border-l-slate-500 p-4">
            <div className="mb-2">
                <Label htmlFor="notes" className="text-base font-semibold">
                    Notes
                </Label>
            </div>
            <textarea
                id="notes"
                value={notes ?? ''}
                onChange={(e) => onNotesChange(e.target.value)}
                rows={3}
                placeholder="Enter any notes..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] resize-vertical"
            />
            {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
        </div>
    );
}
