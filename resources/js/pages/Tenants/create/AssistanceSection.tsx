import { FormField } from './FormField';

interface AssistanceSectionProps {
    assistanceAmount: string;
    assistanceCompany: string;
    onAssistanceAmountChange: (value: string) => void;
    onAssistanceCompanyChange: (value: string) => void;
    assistanceAmountError?: string;
    assistanceCompanyError?: string;
}

export function AssistanceSection({
    assistanceAmount,
    assistanceCompany,
    onAssistanceAmountChange,
    onAssistanceCompanyChange,
    assistanceAmountError,
    assistanceCompanyError,
}: AssistanceSectionProps) {
    return (
        <>
            <FormField
                id="assistance_amount"
                label="Assistance Amount"
                type="number"
                step="0.01"
                value={assistanceAmount}
                onChange={onAssistanceAmountChange}
                placeholder="Enter assistance amount"
                borderColor="rose"
                error={assistanceAmountError}
            />

            <FormField
                id="assistance_company"
                label="Assistance Company"
                value={assistanceCompany}
                onChange={onAssistanceCompanyChange}
                placeholder="Enter assistance company name"
                borderColor="amber"
                error={assistanceCompanyError}
            />
        </>
    );
}
