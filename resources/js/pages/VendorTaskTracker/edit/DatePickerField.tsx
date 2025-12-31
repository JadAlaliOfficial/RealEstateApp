import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parse, isValid } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import React from 'react';
import FormSection from './FormSection';

interface DatePickerFieldProps {
    label: string;
    required?: boolean;
    borderColor: string;
    value: string;
    onChange: (date: string) => void;
    dateRef?: React.RefObject<HTMLButtonElement>;
    error?: string;
    validationError?: string;
    calendarOpen: boolean;
    onCalendarOpenChange: (open: boolean) => void;
    allowClear?: boolean;
}

// Helper function to safely parse dates
const safeParseDateString = (dateString: string | null | undefined): Date | undefined => {
    if (!dateString || dateString.trim() === '') {
        return undefined;
    }

    try {
        // Grab YYYY-MM-DD from the front (works for "2025-10-01" and "2025-10-01T00:00:00Z")
        const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateString);
        if (m) {
            const [, y, mo, d] = m;
            // Construct a local calendar date (no timezone shifting)
            const date = new Date(Number(y), Number(mo) - 1, Number(d));
            if (isValid(date)) {
                return date;
            }
        }
        
        // Fallback: Try parsing as YYYY-MM-DD format with date-fns
        const parsedDate = parse(dateString, 'yyyy-MM-dd', new Date(2000, 0, 1));
        if (isValid(parsedDate)) {
            return parsedDate;
        }
        
        return undefined;
    } catch (error) {
        console.warn('Failed to parse date:', dateString, error);
        return undefined;
    }
};

// Helper function to safely format dates for display
const safeFormatDate = (dateString: string | null | undefined): string => {
    const parsedDate = safeParseDateString(dateString);
    if (!parsedDate) {
        return 'Pick a date';
    }

    try {
        return format(parsedDate, 'PPP');
    } catch (error) {
        console.warn('Failed to format date:', dateString, error);
        return 'Pick a date';
    }
};

export default function DatePickerField({
    label,
    required = false,
    borderColor,
    value,
    onChange,
    dateRef,
    error,
    validationError,
    calendarOpen,
    onCalendarOpenChange,
    allowClear = false,
}: DatePickerFieldProps) {
    return (
        <FormSection
            label={label}
            required={required}
            borderColor={borderColor}
            error={error}
            validationError={validationError}
        >
            <Popover
                open={calendarOpen}
                onOpenChange={onCalendarOpenChange}
                modal={false}
            >
                <PopoverTrigger asChild>
                    <Button
                        ref={dateRef}
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${!value && 'text-muted-foreground'}`}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {safeFormatDate(value)}
                        {allowClear && !!value && (
                            <span
                                className="ml-auto inline-flex items-center rounded p-1 hover:bg-muted"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange('');
                                    onCalendarOpenChange(false);
                                }}
                                aria-label="Clear date"
                                role="button"
                            >
                                <X className="h-3.5 w-3.5 opacity-70 hover:opacity-100" />
                            </span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="z-[60] w-auto p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
                    <Calendar
                        mode="single"
                        selected={safeParseDateString(value)}
                        onSelect={(date) => {
                            if (date) {
                                onChange(format(date, 'yyyy-MM-dd'));
                                onCalendarOpenChange(false);
                            }
                        }}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </FormSection>
    );
}
