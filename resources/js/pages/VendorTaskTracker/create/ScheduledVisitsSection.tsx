import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parse } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';

interface ScheduledVisitsSectionProps {
    scheduledVisits: string;
    calendarOpen: boolean;
    onCalendarOpenChange: (open: boolean) => void;
    onDateChange: (date: string) => void;
    errors: Partial<Record<string, string>>; // Changed from Record<string, string>

}

export default function ScheduledVisitsSection({
    scheduledVisits,
    calendarOpen,
    onCalendarOpenChange,
    onDateChange,
    errors
}: ScheduledVisitsSectionProps) {
    return (
        <div className="rounded-lg border-l-4 border-l-emerald-500 p-4">
            <div className="mb-2">
                <Label htmlFor="any_scheduled_visits" className="text-base font-semibold">
                    Any Scheduled Visits
                </Label>
            </div>
            <Popover
                open={calendarOpen}
                onOpenChange={onCalendarOpenChange}
                modal={false}
            >
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${!scheduledVisits && 'text-muted-foreground'}`}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {scheduledVisits
                            ? format(parse(scheduledVisits, 'yyyy-MM-dd', new Date()), 'PPP')
                            : 'Pick a date'}
                        {!!scheduledVisits && (
                            <span
                                className="ml-auto inline-flex items-center rounded p-1 hover:bg-muted"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDateChange('');
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
                        selected={scheduledVisits ? parse(scheduledVisits, 'yyyy-MM-dd', new Date()) : undefined}
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
            {errors.any_scheduled_visits && <p className="mt-1 text-sm text-red-600">{errors.any_scheduled_visits}</p>}
        </div>
    );
}
