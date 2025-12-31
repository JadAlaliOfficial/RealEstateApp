import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
    stageInProgress: string;
    notes: string;
    onStageChange: (stage: string) => void;
    onNotesChange: (notes: string) => void;
    errors: Record<string, string>;
}

export function StageAndNotesFields({ stageInProgress, notes, onStageChange, onNotesChange, errors }: Props) {
    return (
        <>
            {/* Stage in Progress Field */}
            <div className="rounded-lg border-l-4 border-l-pink-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="stage_in_progress" className="text-base font-semibold">
                        Stage in Progress
                    </Label>
                </div>
                <Input
                    id="stage_in_progress"
                    value={stageInProgress}
                    onChange={(e) => onStageChange(e.target.value)}
                    placeholder="e.g., Document Review, Background Check, etc."
                />
                {errors.stage_in_progress && <p className="mt-1 text-sm text-red-600">{errors.stage_in_progress}</p>}
            </div>

            {/* Notes Field */}
            <div className="rounded-lg border-l-4 border-l-red-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="notes" className="text-base font-semibold">
                        Notes
                    </Label>
                </div>
                <textarea
                    id="notes"
                    className="resize-vertical min-h-[100px] w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    placeholder="Add any additional notes..."
                    rows={4}
                />
                {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
            </div>
        </>
    );
}
