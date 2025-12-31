import { Label } from '@/components/ui/label';

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  borderColor: string;
  placeholder?: string;
  rows?: number;
}

export default function TextAreaField({ 
  label, 
  value, 
  onChange, 
  error,
  borderColor,
  placeholder = "Enter text...",
  rows = 3
}: TextAreaFieldProps) {
  return (
    <div className={`rounded-lg border-l-4 ${borderColor} p-4`}>
      <div className="mb-2">
        <Label className="text-base font-semibold">
          {label}
        </Label>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
