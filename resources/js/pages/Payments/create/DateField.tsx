import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parse } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

interface DateFieldProps {
    date: string;
    onDateChange: (date: string) => void;
    calendarOpen: boolean;
    onCalendarOpenChange: (open: boolean) => void;
    validationError?: string;
    dateError?: string;
}

export function DateField({ 
    date, 
    onDateChange, 
    calendarOpen, 
    onCalendarOpenChange, 
    validationError, 
    dateError 
}: DateFieldProps) {
    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            onDateChange(format(selectedDate, 'yyyy-MM-dd'));
            onCalendarOpenChange(false);
        }
    };

    return (
        <div className="rounded-lg border-l-4 border-l-blue-500 p-4">
            <div className="mb-2">
                <Label htmlFor="date" className="text-base font-semibold">
                    Date *
                </Label>
            </div>
            <Popover open={calendarOpen} onOpenChange={onCalendarOpenChange} modal={false}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${!date && 'text-muted-foreground'}`}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(parse(date, 'yyyy-MM-dd', new Date()), 'PPP') : 'Pick a date'}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="z-[60] w-auto p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
                    <Calendar
                        mode="single"
                        selected={date ? parse(date, 'yyyy-MM-dd', new Date()) : undefined}
                        onSelect={handleDateSelect}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            {dateError && <p className="mt-1 text-sm text-red-600">{dateError}</p>}
            {validationError && <p className="mt-1 text-sm text-red-600">{validationError}</p>}
        </div>
    );
}
