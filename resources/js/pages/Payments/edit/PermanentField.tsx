import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radioGroup';

interface PermanentFieldProps {
    data: any;
    setData: (data: any) => void;
    errors: any;
}

export default function PermanentField({ data, setData, errors }: PermanentFieldProps) {
    return (
        <div className="rounded-lg border-l-4 border-l-cyan-500 p-4">
            <div className="mb-2">
                <Label htmlFor="permanent" className="text-base font-semibold">
                    Permanent *
                </Label>
            </div>
            <RadioGroup
                value={data.permanent}
                onValueChange={(value) => setData((prev: any) => ({ ...prev, permanent: value as 'Yes' | 'No' }))}
                name="permanent"
                options={[
                    { value: 'Yes', label: 'Yes' },
                    { value: 'No', label: 'No' },
                ]}
            />
            {errors.permanent && <p className="mt-1 text-sm text-red-600">{errors.permanent}</p>}
        </div>
    );
}
