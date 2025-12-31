import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radioGroup';

interface UrgencySectionProps {
    urgent: string;
    onUrgentChange: (value: string) => void;
    errors: Partial<Record<string, string>>; // Changed from Record<string, string>

}

export default function UrgencySection({
    urgent,
    onUrgentChange,
    errors
}: UrgencySectionProps) {
    return (
        <div className="rounded-lg border-l-4 border-l-yellow-500 p-4">
            <div className="mb-2">
                <Label htmlFor="urgent" className="text-base font-semibold">
                    Urgent
                </Label>
            </div>
            <RadioGroup
                value={urgent}
                onValueChange={onUrgentChange}
                name="urgent"
                options={[
                    { value: 'Yes', label: 'Yes' },
                    { value: 'No', label: 'No' }
                ]}
            />
            {errors.urgent && <p className="mt-1 text-sm text-red-600">{errors.urgent}</p>}
        </div>
    );
}
