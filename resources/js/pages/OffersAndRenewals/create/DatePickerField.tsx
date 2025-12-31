import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parse } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';

interface DatePickerFieldProps {
    label: string;
    value: string | null;
    onChange: (date: string | null) => void;
    error?: string;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    borderColor: string;
    required?: boolean;
    allowClear?: boolean;
    clearToNull?: boolean;
}

export default function DatePickerField({
    label,
    value,
    onChange,
    error,
    isOpen,
    onOpenChange,
    borderColor,
    required = false,
    allowClear = true,
    clearToNull = true,
}: DatePickerFieldProps) {
    return (
        <div className={`rounded-lg border-l-4 ${borderColor} p-4`}>
            <div className="mb-2">
                <Label htmlFor={label} className="text-base font-semibold">
                    {label} {required && '*'}
                </Label>
            </div>
            <Popover open={isOpen} onOpenChange={onOpenChange} modal={false}>
                <div className="relative">
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${!value && 'text-muted-foreground'}`}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {value
                                ? format(parse(value, 'yyyy-MM-dd', new Date()), 'PPP')
                                : 'Pick a date'}
                        </Button>
                    </PopoverTrigger>
                    {allowClear && value && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange(clearToNull ? null : '');
                                onOpenChange(false);
                            }}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    )}
                </div>
                <PopoverContent className="z-[60] w-auto p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
                    <Calendar
                        mode="single"
                        selected={value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined}
                        onSelect={(date) => {
                            if (date) {
                                onChange(format(date, 'yyyy-MM-dd'));
                                onOpenChange(false);
                            }
                        }}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
