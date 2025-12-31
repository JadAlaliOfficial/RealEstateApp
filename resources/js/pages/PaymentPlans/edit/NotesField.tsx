import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Props {
    notes: string;
    error?: string;
    onChange: (value: string) => void;
}

export function NotesField({ notes, error, onChange }: Props) {
    return (
        <div className="rounded-lg border-l-4 border-l-slate-500 p-4">
            <div className="mb-2">
                <Label htmlFor="notes" className="text-base font-semibold">
                    Notes
                </Label>
            </div>
            <Textarea
                id="notes"
                value={notes || ''}
                onChange={(e) => onChange(e.target.value)}
                rows={3}
                placeholder="Enter any additional notes..."
                maxLength={1000}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            <p className="mt-1 text-xs text-muted-foreground">
                {(notes || '').length}/1000 characters
            </p>
        </div>
    );
}
