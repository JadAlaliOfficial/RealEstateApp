import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radioGroup';
import DatePickerField from './DatePickerField';
import FormSection from './FormSection';

interface LeaseInformationFieldsProps {
    leaseStart: string;
    onLeaseStartChange: (value: string) => void;
    leaseStartOpen: boolean;
    onLeaseStartOpenChange: (open: boolean) => void;
    leaseStartError?: string;
    leaseEnd: string;
    onLeaseEndChange: (value: string) => void;
    leaseEndOpen: boolean;
    onLeaseEndOpenChange: (open: boolean) => void;
    leaseEndError?: string;
    countBeds: string;
    onCountBedsChange: (value: string) => void;
    countBedsError?: string;
    countBaths: string;
    onCountBathsChange: (value: string) => void;
    countBathsError?: string;
    leaseStatus: string;
    onLeaseStatusChange: (value: string) => void;
    leaseStatusError?: string;
}

export default function LeaseInformationFields({
    leaseStart,
    onLeaseStartChange,
    leaseStartOpen,
    onLeaseStartOpenChange,
    leaseStartError,
    leaseEnd,
    onLeaseEndChange,
    leaseEndOpen,
    onLeaseEndOpenChange,
    leaseEndError,
    countBeds,
    onCountBedsChange,
    countBedsError,
    countBaths,
    onCountBathsChange,
    countBathsError,
    leaseStatus,
    onLeaseStatusChange,
    leaseStatusError,
}: LeaseInformationFieldsProps) {
    return (
        <>
            {/* Lease Start */}
            <DatePickerField
                label="Lease Start"
                value={leaseStart}
                onChange={onLeaseStartChange}
                isOpen={leaseStartOpen}
                onOpenChange={onLeaseStartOpenChange}
                error={leaseStartError}
                borderColor="border-l-emerald-500"
            />

            {/* Lease End */}
            <DatePickerField
                label="Lease End"
                value={leaseEnd}
                onChange={onLeaseEndChange}
                isOpen={leaseEndOpen}
                onOpenChange={onLeaseEndOpenChange}
                error={leaseEndError}
                borderColor="border-l-teal-500"
            />

            {/* Unit Specifications */}
            <FormSection borderColor="border-l-indigo-500">
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
                        {countBedsError && <p className="mt-1 text-sm text-red-600">{countBedsError}</p>}
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
                        {countBathsError && <p className="mt-1 text-sm text-red-600">{countBathsError}</p>}
                    </div>
                </div>
            </FormSection>

            {/* Lease Status */}
            <FormSection borderColor="border-l-pink-500">
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
                {leaseStatusError && <p className="mt-1 text-sm text-red-600">{leaseStatusError}</p>}
            </FormSection>
        </>
    );
}
