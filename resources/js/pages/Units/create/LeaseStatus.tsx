import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radioGroup';

interface Props {
    leaseStatus: string;
    onLeaseStatusChange: (value: string) => void;
    error?: string;
}

export default function LeaseStatus({ leaseStatus, onLeaseStatusChange, error }: Props) {
    return (
        <div className="rounded-lg border-l-4 border-l-pink-500 p-4">
            <div className="mb-2">
                <Label htmlFor="lease_status" className="text-base font-semibold">
                    Lease Status
                </Label>
            </div>
            <RadioGroup
                value={leaseStatus}
                onValueChange={onLeaseStatusChange}
                name="lease_status"
                options={[
                    { value: 'Fixed', label: 'Fixed' },
                    { value: 'Fixed with roll over', label: 'Fixed with roll over' },
                    { value: 'At will', label: 'At will' }
                ]}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
