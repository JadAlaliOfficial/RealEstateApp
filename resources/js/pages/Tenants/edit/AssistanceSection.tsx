import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AssistanceSectionProps {
    assistanceAmount: string;
    assistanceCompany: string;
    onAssistanceAmountChange: (value: string) => void;
    onAssistanceCompanyChange: (value: string) => void;
    errors: Record<string, string>;
}

export default function AssistanceSection({
    assistanceAmount,
    assistanceCompany,
    onAssistanceAmountChange,
    onAssistanceCompanyChange,
    errors,
}: AssistanceSectionProps) {
    return (
        <>
            {/* Assistance Amount */}
            <div className="rounded-lg border-l-4 border-l-rose-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="assistance_amount" className="text-base font-semibold">
                        Assistance Amount
                    </Label>
                </div>
                <Input
                    id="assistance_amount"
                    type="number"
                    step="0.01"
                    value={assistanceAmount}
                    onChange={(e) => onAssistanceAmountChange(e.target.value)}
                    placeholder="Enter assistance amount"
                />
                {errors.assistance_amount && <p className="mt-1 text-sm text-red-600">{errors.assistance_amount}</p>}
            </div>

            {/* Assistance Company */}
            <div className="rounded-lg border-l-4 border-l-amber-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="assistance_company" className="text-base font-semibold">
                        Assistance Company
                    </Label>
                </div>
                <Input
                    id="assistance_company"
                    value={assistanceCompany}
                    onChange={(e) => onAssistanceCompanyChange(e.target.value)}
                    placeholder="Enter assistance company name"
                />
                {errors.assistance_company && <p className="mt-1 text-sm text-red-600">{errors.assistance_company}</p>}
            </div>
        </>
    );
}
