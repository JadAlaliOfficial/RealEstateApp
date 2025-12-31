import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
    utilityStatus: string;
    accountNumber: string;
    onUtilityStatusChange: (value: string) => void;
    onAccountNumberChange: (value: string) => void;
    errors: {
        utility_status?: string;
        account_number?: string;
    };
}

export default function UtilityInformation({
    utilityStatus,
    accountNumber,
    onUtilityStatusChange,
    onAccountNumberChange,
    errors
}: Props) {
    return (
        <>
            <div className="rounded-lg border-l-4 border-l-cyan-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="utility_status" className="text-base font-semibold">
                        Utility Status
                    </Label>
                </div>
                <Input
                    id="utility_status"
                    value={utilityStatus}
                    onChange={(e) => onUtilityStatusChange(e.target.value)}
                    placeholder="Enter utility status"
                />
                {errors.utility_status && <p className="mt-1 text-sm text-red-600">{errors.utility_status}</p>}
            </div>

            <div className="rounded-lg border-l-4 border-l-gray-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="account_number" className="text-base font-semibold">
                        Account Number
                    </Label>
                </div>
                <Input
                    id="account_number"
                    value={accountNumber}
                    onChange={(e) => onAccountNumberChange(e.target.value)}
                    placeholder="Enter account number"
                />
                {errors.account_number && <p className="mt-1 text-sm text-red-600">{errors.account_number}</p>}
            </div>
        </>
    );
}
