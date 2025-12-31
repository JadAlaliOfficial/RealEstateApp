import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export default function EvictionsField({ value, onChange, error }: Props) {
    return (
        <div className="rounded-lg border-l-4 border-l-pink-500 p-4">
            <div className="mb-2">
                <Label htmlFor="evictions" className="text-base font-semibold">
                    Evictions
                </Label>
            </div>
            <Input id="evictions" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="Enter evictions information" />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
