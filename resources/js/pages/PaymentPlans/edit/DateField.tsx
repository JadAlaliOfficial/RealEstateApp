import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parse, isValid } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

interface Props {
    dates: string;
    error?: string;
    onChange: (date: string) => void;
    dateRef?: React.RefObject<HTMLButtonElement>;
}

export function DateField({ dates, error, onChange, dateRef }: Props) {
    const [calendarOpen, setCalendarOpen] = useState(false);

    // Helper function to safely parse and validate dates
    const parseDate = (dateString: string): Date | null => {
        if (!dateString || dateString.trim() === '') return null;
        
        try {
            const parsedDate = parse(dateString, 'yyyy-MM-dd', new Date());
            return isValid(parsedDate) ? parsedDate : null;
        } catch (error) {
            console.warn('Failed to parse date:', dateString, error);
            return null;
        }
    };

    // Helper function to format date for display
    const formatDateForDisplay = (dateString: string): string => {
        const parsedDate = parseDate(dateString);
        return parsedDate ? format(parsedDate, 'PPP') : 'Pick a date';
    };

    // Handle date selection
    const handleDateSelect = (date: Date | undefined) => {
        if (date) {
            onChange(format(date, 'yyyy-MM-dd'));
            setCalendarOpen(false);
        }
    };

    return (
        <div className="rounded-lg border-l-4 border-l-red-500 p-4">
            <div className="mb-2">
                <Label htmlFor="dates" className="text-base font-semibold">
                    Payment Date *
                </Label>
            </div>
            <Popover
                open={calendarOpen}
                onOpenChange={setCalendarOpen}
                modal={false}
            >
                <PopoverTrigger asChild>
                    <Button
                        ref={dateRef}
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${!dates && 'text-muted-foreground'}`}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formatDateForDisplay(dates)}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
                    <Calendar
                        mode="single"
                        selected={parseDate(dates) || undefined}
                        onSelect={handleDateSelect}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
