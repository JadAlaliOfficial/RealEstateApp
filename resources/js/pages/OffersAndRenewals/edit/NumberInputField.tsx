import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NumberInputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  borderColor: string;
  placeholder?: string;
  min?: string;
  step?: string;
}

export default function NumberInputField({ 
  label, 
  value, 
  onChange, 
  error,
  borderColor,
  placeholder = "Enter number",
  min = "0",
  step = "1"
}: NumberInputFieldProps) {
  return (
    <div className={`rounded-lg border-l-4 ${borderColor} p-4`}>
      <div className="mb-2">
        <Label className="text-base font-semibold">
          {label}
        </Label>
      </div>
      <Input
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
