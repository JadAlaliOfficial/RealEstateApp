import DatePickerField from './DatePickerField';
import RadioGroupField from './RadioGroupField';

interface AcceptanceSectionProps {
    dateOfAcceptance: string | null;
    lastNoticeSent: string | null;
    noticeKind: string;
    onDateOfAcceptanceChange: (date: string | null) => void;
    onLastNoticeSentChange: (date: string | null) => void;
    onNoticeKindChange: (value: string) => void;
    errors: {
        date_of_acceptance?: string;
        last_notice_sent?: string;
        notice_kind?: string;
    };
    calendarStates: {
        date_of_acceptance: boolean;
        last_notice_sent: boolean;
    };
    onCalendarOpenChange: (field: 'date_of_acceptance' | 'last_notice_sent', open: boolean) => void;
}

export default function AcceptanceSection({
    dateOfAcceptance,
    lastNoticeSent,
    noticeKind,
    onDateOfAcceptanceChange,
    onLastNoticeSentChange,
    onNoticeKindChange,
    errors,
    calendarStates,
    onCalendarOpenChange,
}: AcceptanceSectionProps) {
    return (
        <>
            <DatePickerField
                label="Date of Acceptance"
                value={dateOfAcceptance}
                onChange={onDateOfAcceptanceChange}
                error={errors.date_of_acceptance}
                isOpen={calendarStates.date_of_acceptance}
                onOpenChange={(open) => onCalendarOpenChange('date_of_acceptance', open)}
                borderColor="border-l-teal-500"
            />

            <DatePickerField
                label="Offer Last Notice Sent"
                value={lastNoticeSent}
                onChange={onLastNoticeSentChange}
                error={errors.last_notice_sent}
                isOpen={calendarStates.last_notice_sent}
                onOpenChange={(open) => onCalendarOpenChange('last_notice_sent', open)}
                borderColor="border-l-indigo-500"
            />

            <RadioGroupField
                label="Offer Notice Kind"
                value={noticeKind}
                onChange={onNoticeKindChange}
                options={[
                    { value: 'Email', label: 'Email' },
                    { value: 'Call', label: 'Call' },
                    { value: 'Messages', label: 'Messages' }
                ]}
                error={errors.notice_kind}
                borderColor="border-l-pink-500"
                name="notice_kind"
            />
        </>
    );
}
