import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';


interface AssistanceFieldsProps {
    hasAssistance: boolean;
    assistanceAmount: string;
    assistanceCompany: string;
    onHasAssistanceChange: (value: boolean) => void;
    onAssistanceAmountChange: (value: string) => void;
    onAssistanceCompanyChange: (value: string) => void;
    assistanceAmountError?: string;
    assistanceCompanyError?: string;
}


export function AssistanceFields({ 
    hasAssistance, 
    assistanceAmount, 
    assistanceCompany, 
    onHasAssistanceChange, 
    onAssistanceAmountChange, 
    onAssistanceCompanyChange, 
    assistanceAmountError, 
    assistanceCompanyError 
}: AssistanceFieldsProps) {
    return (
        <div className="rounded-lg border-l-4 border-l-cyan-500 p-4">
            <div className="mb-4">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="has_assistance"
                        checked={hasAssistance}
                        onCheckedChange={(checked) => onHasAssistanceChange(checked as boolean)}
                    />
                    <Label htmlFor="has_assistance" className="text-base font-semibold cursor-pointer">
                        Has Assistance
                    </Label>
                </div>
            </div>

            {hasAssistance && (
                <>
                    <div className="mb-3">
                        <Label htmlFor="assistance_amount" className="text-sm font-medium">
                            Assistance Amount
                        </Label>
                        <Input
                            id="assistance_amount"
                            type="number"
                            step="0.01"
                            min="0"
                            value={assistanceAmount}
                            onChange={(e) => onAssistanceAmountChange(e.target.value)}
                            placeholder="Enter assistance amount"
                        />
                        {assistanceAmountError && <p className="mt-1 text-sm text-red-600">{assistanceAmountError}</p>}
                    </div>

                    <div>
                        <Label htmlFor="assistance_company" className="text-sm font-medium">
                            Assistance Company
                        </Label>
                        <Input
                            id="assistance_company"
                            type="text"
                            value={assistanceCompany}
                            onChange={(e) => onAssistanceCompanyChange(e.target.value)}
                            placeholder="Enter assistance company name"
                        />
                        {assistanceCompanyError && <p className="mt-1 text-sm text-red-600">{assistanceCompanyError}</p>}
                    </div>
                </>
            )}
        </div>
    );
}
