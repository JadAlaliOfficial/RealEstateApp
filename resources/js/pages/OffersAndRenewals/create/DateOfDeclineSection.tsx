import DatePickerField from './DatePickerField';

interface DateOfDeclineSectionProps {
    dateOfDecline: string | null;
    onDateOfDeclineChange: (date: string | null) => void;
    errors: {
        date_of_decline?: string;
    };
    calendarOpen: boolean;
    onCalendarOpenChange: (open: boolean) => void;
}

export default function DateOfDeclineSection({
    dateOfDecline,
    onDateOfDeclineChange,
    errors,
    calendarOpen,
    onCalendarOpenChange,
}: DateOfDeclineSectionProps) {
    return (
        <DatePickerField
            label="Date of Decline"
            value={dateOfDecline}
            onChange={onDateOfDeclineChange}
            error={errors.date_of_decline}
            isOpen={calendarOpen}
            onOpenChange={onCalendarOpenChange}
            borderColor="border-l-red-500"
            required
        />
    );
}