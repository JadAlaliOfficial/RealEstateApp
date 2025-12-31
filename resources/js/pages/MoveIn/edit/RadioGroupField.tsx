import { RadioGroup } from '@/components/ui/radioGroup';

interface RadioGroupFieldProps {
    value: 'Yes' | 'No' | '';
    onChange: (value: 'Yes' | 'No' | '') => void;
    name: string;
}

export default function RadioGroupField({ value, onChange, name }: RadioGroupFieldProps) {
    return (
        <RadioGroup
            value={value}
            onValueChange={(val) => onChange(val as 'Yes' | 'No' | '')}
            name={name}
            options={[
                { value: 'No', label: 'No' },
                { value: 'Yes', label: 'Yes' },
            ]}
        />
    );
}
