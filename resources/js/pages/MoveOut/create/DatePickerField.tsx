import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parse, isValid } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';

interface Props {
    value: string;
    isOpen: boolean;
    onOpenChange: () => void;
    onDateSelect: (date: Date | undefined) => void;
    onClear?: () => void;
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
        
        return undefined;
    } catch (error) {
        console.warn('Date parsing error:', error);
        return undefined;
    }
};

export default function DatePickerField({ value, isOpen, onOpenChange, onDateSelect, onClear }: Props) {
    const displayValue = value && value.trim() !== ''
        ? (() => {
            const parsedDate = parseDate(value);
            return parsedDate ? format(parsedDate, 'PPP') : 'Pick a date';
        })()
        : 'Pick a date';

    const hasValue = Boolean(value && value.trim() !== '');

    return (
        <div className="relative">
            <Popover open={isOpen} onOpenChange={onOpenChange}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {displayValue}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={parseDate(value)}
                        onSelect={onDateSelect}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            {hasValue && (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Clear date"
                    onClick={() => {
                        onClear?.();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
