import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parse } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React from 'react';

interface TaskSubmissionDateSectionProps {
    taskSubmissionDate: string;
    calendarOpen: boolean;
    onCalendarOpenChange: (open: boolean) => void;
    onDateChange: (date: string) => void;
    taskSubmissionDateRef: React.RefObject<HTMLButtonElement>;
    errors: Partial<Record<string, string>>; // Changed from Record<string, string>

    validationError: string;
}

export default function TaskSubmissionDateSection({
    taskSubmissionDate,
    calendarOpen,
    onCalendarOpenChange,
    onDateChange,
    taskSubmissionDateRef,
    errors,
    validationError
}: TaskSubmissionDateSectionProps) {
    return (
        <div className="rounded-lg border-l-4 border-l-orange-500 p-4">
            <div className="mb-2">
                <Label htmlFor="task_submission_date" className="text-base font-semibold">
                    Task Submission Date *
                </Label>
            </div>
            <Popover
                open={calendarOpen}
                onOpenChange={onCalendarOpenChange}
                modal={false}
            >
                <PopoverTrigger asChild>
                    <Button
                        ref={taskSubmissionDateRef}
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${!taskSubmissionDate && 'text-muted-foreground'}`}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {taskSubmissionDate
                            ? format(parse(taskSubmissionDate, 'yyyy-MM-dd', new Date()), 'PPP')
                            : 'Pick a date'}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="z-[60] w-auto p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
                    <Calendar
                        mode="single"
                        selected={taskSubmissionDate ? parse(taskSubmissionDate, 'yyyy-MM-dd', new Date()) : undefined}
                        onSelect={(date) => {
                            if (date) {
                                onDateChange(format(date, 'yyyy-MM-dd'));
                                onCalendarOpenChange(false);
                            }
                        }}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            {errors.task_submission_date && <p className="mt-1 text-sm text-red-600">{errors.task_submission_date}</p>}
            {validationError && <p className="mt-1 text-sm text-red-600">{validationError}</p>}
        </div>
    );
}
