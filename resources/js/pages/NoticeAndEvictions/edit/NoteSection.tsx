import { Label } from '@/components/ui/label';

interface Props {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export function NoteSection({ value, onChange, error }: Props) {
    return (
        <div className="rounded-lg border-l-4 border-l-indigo-500 p-4">
            <div className="mb-2">
                <Label htmlFor="note" className="text-base font-semibold">
                    Note
                </Label>
            </div>
            <textarea
                id="note"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={3}
                placeholder="Enter any notes..."
                className="resize-vertical min-h-[100px] w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
