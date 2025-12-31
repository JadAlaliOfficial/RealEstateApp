import DatePickerField from './DatePickerField';
import RadioGroupField from './RadioGroupField';

interface RenewalInformationSectionProps {
    lastNoticeSent2: string | null;
    noticeKind2: string;
    onLastNoticeSent2Change: (date: string | null) => void;
    onNoticeKind2Change: (value: string) => void;
    errors: {
        last_notice_sent_2?: string;
        notice_kind_2?: string;
    };
    calendarOpen: boolean;
    onCalendarOpenChange: (open: boolean) => void;
}

export default function RenewalInformationSection({
    lastNoticeSent2,
    noticeKind2,
    onLastNoticeSent2Change,
    onNoticeKind2Change,
    errors,
    calendarOpen,
    onCalendarOpenChange,
}: RenewalInformationSectionProps) {
    return (
        <>
            <DatePickerField
                label="Renewal Last Notice Sent"
                value={lastNoticeSent2}
                onChange={onLastNoticeSent2Change}
                error={errors.last_notice_sent_2}
                isOpen={calendarOpen}
                onOpenChange={onCalendarOpenChange}
                borderColor="border-l-rose-500"
            />

            <RadioGroupField
                label="Renewal Notice Kind"
                value={noticeKind2}
                onChange={onNoticeKind2Change}
                options={[
                    { value: 'Email', label: 'Email' },
                    { value: 'Call', label: 'Call' },
                    { value: 'Messages', label: 'Messages' }
                ]}
                error={errors.notice_kind_2}
                borderColor="border-l-amber-500"
                name="notice_kind_2"
            />
        </>
    );
}
