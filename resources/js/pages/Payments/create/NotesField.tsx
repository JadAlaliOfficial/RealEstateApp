import { Label } from '@/components/ui/label';

interface NotesFieldProps {
    notes: string;
    onNotesChange: (value: string) => void;
    error?: string;
}

export function NotesField({ notes, onNotesChange, error }: NotesFieldProps) {
    return (
        <div className="rounded-lg border-l-4 border-l-pink-500 p-4">
            <div className="mb-2">
                <Label htmlFor="notes" className="text-base font-semibold">
                    Notes
                </Label>
            </div>
            <textarea
                id="notes"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={notes}
                onChange={(e) => onNotesChange(e.target.value)}
                rows={3}
                placeholder="Enter any additional notes..."
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
