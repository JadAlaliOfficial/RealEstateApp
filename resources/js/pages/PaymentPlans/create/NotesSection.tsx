import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface NotesSectionProps {
    notes: string;
    errors: {
        notes?: string;
    };
    onNotesChange: (notes: string) => void;
}

export default function NotesSection({ notes, errors, onNotesChange }: NotesSectionProps) {
    return (
        <div className="rounded-lg border-l-4 border-l-teal-500 p-4">
            <div className="mb-2">
                <Label htmlFor="notes" className="text-base font-semibold">
                    Notes
                </Label>
            </div>
            <Textarea
                id="notes"
                value={notes || ''}
                onChange={(e) => onNotesChange(e.target.value)}
                rows={3}
                placeholder="Enter any additional notes..."
                maxLength={1000}
            />
            {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
            <p className="mt-1 text-xs text-muted-foreground">
                {(notes || '').length}/1000 characters
            </p>
        </div>
    );
}
