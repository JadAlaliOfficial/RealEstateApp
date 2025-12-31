import { RadioGroup } from '@/components/ui/radioGroup';

interface RadioOption {
    value: string;
    label: string;
}

interface Props {
    value: string;
    onValueChange: (value: string) => void;
    name: string;
    options: RadioOption[];
}

export default function RadioGroupField({ value, onValueChange, name, options }: Props) {
    return (
        <RadioGroup
            value={value}
            onValueChange={onValueChange}
            name={name}
            options={options}
        />
    );
}
