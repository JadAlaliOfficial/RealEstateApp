import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup } from '@/components/ui/radioGroup';
import { format, isValid, parse } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import { useState } from 'react';

interface Props {
    status: string;
    date: string;
    onStatusChange: (status: string) => void;
    onDateChange: (date: string) => void;
    errors: Record<string, string>;
    validationErrors: {
        status?: string;
    };
}

export function StatusAndDateFields({ status, date, onStatusChange, onDateChange, errors, validationErrors }: Props) {
    const [calendarOpen, setCalendarOpen] = useState(false);

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

    const getSelectedDate = (): Date | undefined => {
        return parseDate(date);
    };

    return (
        <>
            {/* Status Field */}
            <div className="rounded-lg border-l-4 border-l-teal-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="status" className="text-base font-semibold">
                        Status *
                    </Label>
                </div>
                <RadioGroup
                    value={status}
                    onValueChange={onStatusChange}
                    name="status"
                    options={[
                        { value: 'New', label: 'New' },
                        { value: 'Approved', label: 'Approved' },
                        { value: 'Undecided', label: 'Undecided' },
                        { value: 'Rejected', label: 'Rejected' },
                        { value: 'Pending', label: 'Pending' },
                    ]}
                />
                {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                {validationErrors.status && <p className="mt-1 text-sm text-red-600">{validationErrors.status}</p>}
            </div>

            {/* Date Field */}
            <div className="rounded-lg border-l-4 border-l-indigo-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="date" className="text-base font-semibold">
                        Date
                    </Label>
                </div>
                <div className="relative">
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen} modal={false}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className={`w-full justify-start text-left font-normal pr-8 ${!date && 'text-muted-foreground'}`}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date && getSelectedDate() ? format(getSelectedDate()!, 'PPP') : 'Pick a date'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="z-[60] w-auto p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
                            <Calendar
                                mode="single"
                                selected={getSelectedDate()}
                                onSelect={(selectedDate) => {
                                    if (selectedDate && isValid(selectedDate)) {
                                        onDateChange(format(selectedDate, 'yyyy-MM-dd'));
                                        setCalendarOpen(false);
                                    }
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    {date && (
                        <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-muted"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onDateChange('');
                                setCalendarOpen(false);
                            }}
                            aria-label="Clear date"
                        >
                            <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                    )}
                </div>
                {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
            </div>
        </>
    );
}
