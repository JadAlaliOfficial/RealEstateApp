import { Label } from '@/components/ui/label';

interface NotesFieldProps {
    data: any;
    setData: (data: any) => void;
    errors: any;
}

export default function NotesField({ data, setData, errors }: NotesFieldProps) {
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
                value={data.notes}
                onChange={(e) => setData((prev: any) => ({ ...prev, notes: e.target.value }))}
                rows={3}
                placeholder="Enter any additional notes..."
            />
            {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
        </div>
    );
}
