import DatePickerField from './DatePickerField';
import RadioGroupField from './RadioGroupField';

interface OfferInformationSectionProps {
    dateSentOffer: string | null;
    status: string;
    onDateSentOfferChange: (date: string | null) => void;
    onStatusChange: (value: string) => void;
    errors: {
        date_sent_offer?: string;
        status?: string;
    };
    validationErrors: {
        date_sent_offer?: string;
    };
    calendarOpen: boolean;
    onCalendarOpenChange: (open: boolean) => void;
}

export default function OfferInformationSection({
    dateSentOffer,
    status,
    onDateSentOfferChange,
    onStatusChange,
    errors,
    validationErrors,
    calendarOpen,
    onCalendarOpenChange,
}: OfferInformationSectionProps) {
    return (
        <>
            <DatePickerField
                label="Date Sent Offer"
                value={dateSentOffer}
                onChange={onDateSentOfferChange}
                error={errors.date_sent_offer || validationErrors.date_sent_offer}
                isOpen={calendarOpen}
                onOpenChange={onCalendarOpenChange}
                borderColor="border-l-orange-500"
                required
                allowClear={false}
            />

            <RadioGroupField
                label="Status"
                value={status}
                onChange={onStatusChange}
                options={[
                    { value: 'Accepted', label: 'Accepted' },
                    { value: "Didn't Accept", label: "Didn't Accept" },
                    { value: "Didn't respond", label: "Didn't respond" }
                ]}
                error={errors.status}
                borderColor="border-l-emerald-500"
                name="status"
            />
        </>
    );
}
