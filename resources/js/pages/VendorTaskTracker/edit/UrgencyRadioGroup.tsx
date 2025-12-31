import { RadioGroup } from '@/components/ui/radioGroup';
import FormSection from './FormSection';

interface UrgencyRadioGroupProps {
    value: "Yes" | "No";
    onChange: (value: "Yes" | "No") => void;
    error?: string;
}

export default function UrgencyRadioGroup({ value, onChange, error }: UrgencyRadioGroupProps) {
    return (
        <FormSection
            label="Urgent"
            borderColor="border-l-yellow-500"
            error={error}
        >
            <RadioGroup
                value={value}
                onValueChange={(value) => onChange(value as "Yes" | "No")}
                name="urgent"
                options={[
                    { value: 'Yes', label: 'Yes' },
                    { value: 'No', label: 'No' }
                ]}
            />
        </FormSection>
    );
}
