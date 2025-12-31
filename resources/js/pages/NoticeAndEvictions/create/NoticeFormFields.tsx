import DateField from './DateField';
import EvectedOrPaymentPlanField from './EvectedOrPaymentPlanField';
import EvictionsField from './EvictionsField';
import HaveAnExceptionField from './HaveAnExceptionField';
import HearingDatesField from './HearingDatesField';
import IfLeftField from './IfLeftField';
import NoteField from './NoteField';
import OtherTenantsField from './OtherTenantsField';
import SentToAttorneyField from './SentToAttorneyField';
import StatusField from './StatusField';
import TypeOfNoticeField from './TypeOfNoticeField';
import WritDateField from './WritDateField';

interface Notice {
    id: number;
    notice_name: string;
}

interface Tenant {
    id: number;
    first_name: string;
    last_name: string;
}

interface FormData {
    status: string;
    date: string;
    type_of_notice: string;
    have_an_exception: string;
    note: string;
    evictions: string;
    sent_to_atorney: string;
    hearing_dates: string;
    evected_or_payment_plan: string;
    if_left: string;
    writ_date: string;
    other_tenants: string;
}

interface Props {
    data: FormData;
    setData: (key: string, value: string | number | null) => void;
    errors: { [key: string]: string };
    notices: Notice[];
    filteredTenants?: Tenant[];
    selectedUnitId?: number | null;
    otherTenantsValue?: string;
    onOtherTenantsChange?: (value: string) => void;
}

export default function NoticeFormFields({
    data,
    setData,
    errors,
    notices,
    filteredTenants = [],
    selectedUnitId = null,
    otherTenantsValue = '',
    onOtherTenantsChange,
}: Props) {
    return (
        <>
            <OtherTenantsField
                value={otherTenantsValue}
                onChange={onOtherTenantsChange || ((value) => setData('other_tenants', value))}
                error={errors.other_tenants}
                tenants={filteredTenants}
                disabled={!selectedUnitId}
            />

            <StatusField value={data.status} onChange={(value) => setData('status', value)} error={errors.status} />

            <DateField value={data.date} onChange={(value) => setData('date', value)} error={errors.date} />

            <TypeOfNoticeField
                value={data.type_of_notice}
                onChange={(value) => setData('type_of_notice', value)}
                error={errors.type_of_notice}
                notices={notices}
            />

            <HaveAnExceptionField
                value={data.have_an_exception}
                onChange={(value) => setData('have_an_exception', value)}
                error={errors.have_an_exception}
            />

            <NoteField value={data.note} onChange={(value) => setData('note', value)} error={errors.note} />

            <EvictionsField value={data.evictions} onChange={(value) => setData('evictions', value)} error={errors.evictions} />

            <SentToAttorneyField
                value={data.sent_to_atorney}
                onChange={(value) => setData('sent_to_atorney', value)}
                error={errors.sent_to_atorney}
            />

            <HearingDatesField value={data.hearing_dates} onChange={(value) => setData('hearing_dates', value)} error={errors.hearing_dates} />

            <EvectedOrPaymentPlanField
                value={data.evected_or_payment_plan}
                onChange={(value) => setData('evected_or_payment_plan', value)}
                error={errors.evected_or_payment_plan}
            />

            <IfLeftField value={data.if_left} onChange={(value) => setData('if_left', value)} error={errors.if_left} />

            <WritDateField value={data.writ_date} onChange={(value) => setData('writ_date', value)} error={errors.writ_date} />
        </>
    );
}
