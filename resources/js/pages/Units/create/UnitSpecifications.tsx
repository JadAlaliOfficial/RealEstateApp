import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
    countBeds: string;
    countBaths: string;
    onCountBedsChange: (value: string) => void;
    onCountBathsChange: (value: string) => void;
    errors: {
        count_beds?: string;
        count_baths?: string;
    };
}

export default function UnitSpecifications({
    countBeds,
    countBaths,
    onCountBedsChange,
    onCountBathsChange,
    errors
}: Props) {
    return (
        <div className="rounded-lg border-l-4 border-l-indigo-500 p-4">
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <Label htmlFor="count_beds" className="text-base font-semibold">
                        Count Beds
                    </Label>
                    <Input
                        id="count_beds"
                        type="number"
                        step="0.5"
                        min="0"
                        value={countBeds}
                        onChange={(e) => onCountBedsChange(e.target.value)}
                        placeholder="Number of beds"
                    />
                    {errors.count_beds && <p className="mt-1 text-sm text-red-600">{errors.count_beds}</p>}
                </div>
                <div>
                    <Label htmlFor="count_baths" className="text-base font-semibold">
                        Count Baths
                    </Label>
                    <Input
                        id="count_baths"
                        type="number"
                        step="0.5"
                        min="0"
                        value={countBaths}
                        onChange={(e) => onCountBathsChange(e.target.value)}
                        placeholder="Number of baths"
                    />
                    {errors.count_baths && <p className="mt-1 text-sm text-red-600">{errors.count_baths}</p>}
                </div>
            </div>
        </div>
    );
}
