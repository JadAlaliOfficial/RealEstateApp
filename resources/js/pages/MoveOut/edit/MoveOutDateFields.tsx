import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MoveOutFormData } from '@/types/move-out';
import { format, parse, isValid } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import  { useState } from 'react';

interface MoveOutDateFieldsProps {
    data: MoveOutFormData;
    errors: Partial<Record<keyof MoveOutFormData, string>>;
    onDataChange: <K extends keyof MoveOutFormData>(field: K, value: MoveOutFormData[K]) => void;
}

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

export function MoveOutDateFields({ data, errors, onDataChange }: MoveOutDateFieldsProps) {
    const [calendarStates, setCalendarStates] = useState({
        move_out_date: false,
        date_lease_ending_on_buildium: false,
        date_utility_put_under_our_name: false,
    });

    const handleCalendarToggle = (field: keyof typeof calendarStates) => {
        setCalendarStates(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleDateSelect = (date: Date | undefined, field: keyof MoveOutFormData) => {
        if (date && isValid(date)) {
            onDataChange(field, format(date, 'yyyy-MM-dd'));
            setCalendarStates(prev => ({
                ...prev,
                [field]: false
            }));
        }
    };

    return (
        <>
            {/* Move Out Date */}
            <div className="rounded-lg border-l-4 border-l-red-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="move_out_date" className="text-base font-semibold">
                        Move Out Date
                    </Label>
                </div>
                <div className="relative">
                    <Popover open={calendarStates.move_out_date} onOpenChange={() => handleCalendarToggle('move_out_date')}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {data.move_out_date && data.move_out_date.trim() !== ''
                                    ? (() => {
                                        const parsedDate = parseDate(data.move_out_date);
                                        return parsedDate ? format(parsedDate, 'PPP') : 'Pick a date';
                                    })()
                                    : 'Pick a date'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={parseDate(data.move_out_date)}
                                onSelect={(date) => handleDateSelect(date, 'move_out_date')}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    {data.move_out_date && data.move_out_date.trim() !== '' && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Clear date"
                            onClick={() => onDataChange('move_out_date', '')}
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                {errors.move_out_date && <p className="mt-1 text-sm text-red-600">{errors.move_out_date}</p>}
            </div>

            {/* Date Lease Ending on Buildium */}
            <div className="rounded-lg border-l-4 border-l-teal-500 p-4">
                <div className="mb-2">
                    <Label htmlFor="date_lease_ending_on_buildium" className="text-base font-semibold">
                        Date Lease Ending on Buildium
                    </Label>
                </div>
                <div className="relative">
                    <Popover open={calendarStates.date_lease_ending_on_buildium} onOpenChange={() => handleCalendarToggle('date_lease_ending_on_buildium')}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {data.date_lease_ending_on_buildium && data.date_lease_ending_on_buildium.trim() !== ''
                                    ? (() => {
                                        const parsedDate = parseDate(data.date_lease_ending_on_buildium);
                                        return parsedDate ? format(parsedDate, 'PPP') : 'Pick a date';
                                    })()
                                    : 'Pick a date'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={parseDate(data.date_lease_ending_on_buildium)}
                                onSelect={(date) => handleDateSelect(date, 'date_lease_ending_on_buildium')}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    {data.date_lease_ending_on_buildium && data.date_lease_ending_on_buildium.trim() !== '' && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Clear date"
                            onClick={() => onDataChange('date_lease_ending_on_buildium', '')}
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                {errors.date_lease_ending_on_buildium && <p className="mt-1 text-sm text-red-600">{errors.date_lease_ending_on_buildium}</p>}
            </div>

            
        </>
    );
}
