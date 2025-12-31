import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, isValid, parse } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';

interface DatePickerFieldProps {
    value: string | null;
    onChange: (date: string | null) => void;
    placeholder?: string;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

// Helper function to safely parse dates
const safeParseDateString = (dateString: string | null | undefined): Date | undefined => {
    if (!dateString) return undefined;
    const raw = dateString.trim();
    if (!raw) return undefined;
    // Treat common invalid placeholders as empty
    if (raw === '0000-00-00') return undefined;

    // If an ISO string is provided, extract the YYYY-MM-DD portion
    const match = raw.match(/^(\d{4}-\d{2}-\d{2})/);
    const base = match ? match[1] : raw;

    try {
        const parsedExact = parse(base, 'yyyy-MM-dd', new Date());
        if (isValid(parsedExact)) return parsedExact;
    } catch {}

    try {
        const fallback = new Date(raw);
        return isValid(fallback) ? fallback : undefined;
    } catch (error) {
        console.warn('Failed to parse date:', dateString, error);
        return undefined;
    }
};

// Helper function to safely format dates for display
const safeFormatDate = (dateString: string | null | undefined): string => {
    const parsedDate = safeParseDateString(dateString);
    if (!parsedDate) return 'Pick a date';
    try {
        return format(parsedDate, 'PPP');
    } catch (error) {
        console.warn('Failed to format date:', dateString, error);
        return 'Pick a date';
    }
};

export default function DatePickerField({ 
    value, 
    onChange, 
    isOpen,
    onOpenChange 
}: DatePickerFieldProps) {
    return (
        <Popover open={isOpen} onOpenChange={onOpenChange} modal={false}>
            <div className="relative">
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${!value && 'text-muted-foreground'}`}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {safeFormatDate(value)}
                    </Button>
                </PopoverTrigger>
                {safeParseDateString(value) && (
                    <button
                        type="button"
                        aria-label="Clear date"
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-muted"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onChange(null);
                            onOpenChange(false);
                        }}
                    >
                        <X className="h-3 w-3" />
                    </button>
                )}
            </div>
            <PopoverContent className="z-[60] w-auto p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
                <Calendar
                    mode="single"
                    selected={safeParseDateString(value)}
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
    );
}
