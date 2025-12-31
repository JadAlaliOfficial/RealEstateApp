import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, isValid, parse } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

interface DateFieldProps {
    data: any;
    handleDateChange: (date: Date | undefined) => void;
    calendarOpen: boolean;
    setCalendarOpen: (open: boolean) => void;
    dateRef: React.RefObject<HTMLButtonElement>;
    errors: any;
    dateValidationError: string;
}

export default function DateField({
    data,
    handleDateChange,
    calendarOpen,
    setCalendarOpen,
    dateRef,
    errors,
    dateValidationError,
}: DateFieldProps) {
    return (
        <div className="rounded-lg border-l-4 border-l-blue-500 p-4">
            <div className="mb-2">
                <Label htmlFor="date" className="text-base font-semibold">
                    Date *
                </Label>
            </div>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen} modal={false}>
                <PopoverTrigger asChild>
                    <Button
                        ref={dateRef}
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${!data.date && 'text-muted-foreground'}`}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {data.date
                            ? (() => {
                                  try {
                                      const parsedDate = parse(data.date, 'yyyy-MM-dd', new Date());
                                      return isValid(parsedDate) ? format(parsedDate, 'PPP') : 'Invalid date';
                                  } catch (error) {
                                      return 'Invalid date';
                                  }
                              })()
                            : 'Pick a date'}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="z-[60] w-auto p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
                    <Calendar
                        mode="single"
                        selected={(() => {
                            try {
                                if (!data.date) return undefined;
                                const parsedDate = parse(data.date, 'yyyy-MM-dd', new Date());
                                return isValid(parsedDate) ? parsedDate : undefined;
                            } catch (error) {
                                return undefined;
                            }
                        })()}
                        onSelect={handleDateChange}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
            {dateValidationError && <p className="mt-1 text-sm text-red-600">{dateValidationError}</p>}
        </div>
    );
}
