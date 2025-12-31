import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parse, isValid } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import FormSection from './FormSection';

interface DatePickerFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    error?: string;
    borderColor: string;
}

// Safe date parsing function
const parseDate = (dateString: string | null | undefined): Date | undefined => {
    if (!dateString || dateString.trim() === '') {
        return undefined;
    }
    
    try {
        const parsedDate = parse(dateString, 'yyyy-MM-dd', new Date());
        if (isValid(parsedDate)) {
            return parsedDate;
        }
        
        const directDate = new Date(dateString);
        if (isValid(directDate)) {
            return directDate;
        }
        
        return undefined;
    } catch (error) {
        console.warn('Date parsing error:', error);
        return undefined;
    }
};

export default function DatePickerField({
    label,
    value,
    onChange,
    isOpen,
    onOpenChange,
    error,
    borderColor,
}: DatePickerFieldProps) {
    return (
        <FormSection borderColor={borderColor}>
            <div className="mb-2">
                <Label className="text-base font-semibold">
                    {label}
                </Label>
            </div>
            <Popover open={isOpen} onOpenChange={onOpenChange} modal={false}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={`relative w-full justify-start text-left font-normal ${!value && 'text-muted-foreground'}`}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {value && value.trim() !== ''
                            ? (() => {
                                const parsedDate = parseDate(value);
                                return parsedDate ? format(parsedDate, 'PPP') : 'Pick a date';
                            })()
                            : 'Pick a date'}
                        {value && value.trim() !== '' && (
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onChange('');
                                    onOpenChange(false);
                                }}
                                aria-label="Clear date"
                            >
                                ×
                            </button>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="z-[60] w-auto p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
                    <Calendar
                        mode="single"
                        selected={parseDate(value)}
                        onSelect={(date) => {
                            if (date && isValid(date)) {
                                onChange(format(date, 'yyyy-MM-dd'));
                                onOpenChange(false);
                            }
                        }}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </FormSection>
    );
}
