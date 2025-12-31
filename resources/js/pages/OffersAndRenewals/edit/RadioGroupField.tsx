import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radioGroup';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  error?: string;
  borderColor: string;
}

export default function RadioGroupField({ 
  label, 
  name, 
  value, 
  onChange, 
  options, 
  error,
  borderColor 
}: RadioGroupFieldProps) {
  return (
    <div className={`rounded-lg border-l-4 ${borderColor} p-4`}>
      <div className="mb-2">
        <Label className="text-base font-semibold">
          {label}
        </Label>
      </div>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        name={name}
        options={options}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
