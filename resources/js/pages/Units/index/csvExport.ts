import { Unit } from '@/types/unit';
import { format } from 'date-fns';

const formatDateOnly = (value?: string | null, fallback = '-'): string => {
    if (!value) return fallback;

    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    if (!m) return fallback;

    const [, y, mo, d] = m;
    const date = new Date(Number(y), Number(mo) - 1, Number(d));
    return format(date, 'P');
};

export const exportToCSV = (data: Unit[], filename: string = 'units.csv') => {
    const headers = [
        'ID',
        'City',
        'Property',
        'Unit Name',
        'Tenants',
        'Lease Start',
        'Lease End',
        'Beds',
        'Baths',
        'Lease Status',
        'Monthly Rent',
        'Recurring Transaction',
        'Utility Status',
        'Account Number',
        'Insurance',
        'Insurance Expiration',
        'Vacant',
        'Listed',
        'Applications',
    ];

    const csvData = [
        headers.join(','),
        ...data.map((unit) =>
            [
                unit.id,
                `"${unit.city}"`,
                `"${unit.property}"`,
                `"${unit.unit_name}"`,
                `"${unit.tenants || ''}"`,
                `"${formatDateOnly(unit.lease_start, '')}"`,
                `"${formatDateOnly(unit.lease_end, '')}"`,
                unit.count_beds || '',
                unit.count_baths || '',
                `"${unit.lease_status || ''}"`,
                `"${unit.formatted_monthly_rent || ''}"`,
                `"${(unit.recurring_transaction || '').replace(/"/g, '""')}"`,
                `"${(unit.utility_status || '').replace(/"/g, '""')}"`,
                `"${(unit.account_number || '').replace(/"/g, '""')}"`,
                `"${unit.insurance || ''}"`,
                `"${formatDateOnly(unit.insurance_expiration_date, '')}"`,
                `"${unit.vacant}"`,
                `"${unit.listed}"`,
                unit.total_applications || 0,
            ].join(',')
        ),
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
