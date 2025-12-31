import { PaymentPlan } from '@/types/PaymentPlan';
import { formatDateOnly } from './formatDate';

const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined || isNaN(amount)) return '0.00';
    return Number(amount).toFixed(2);
};

const formatString = (value: string | null | undefined) => {
    if (value === null || value === undefined) return '';
    return String(value).replace(/"/g, '""');
};

const formatDate = (dateStr: string | null | undefined) => {
    return formatDateOnly(dateStr, '');
};

export const exportToCSV = (data: PaymentPlan[], filename: string = 'payment-plans.csv') => {
    try {
        const headers = [
            'ID',
            'City',
            'Property',
            'Unit',
            'Tenant',
            'Amount',
            'Paid',
            'Left to Pay',
            'Status',
            'Date',
            'Notes'
        ];

        const csvData = [
            headers.join(','),
            ...data.map(plan => {
                try {
                    return [
                        plan.id || '',
                        `"${formatString(plan.city_name)}"`,
                        `"${formatString(plan.property)}"`,
                        `"${formatString(plan.unit)}"`,
                        `"${formatString(plan.tenant)}"`,
                        formatCurrency(plan.amount),
                        formatCurrency(plan.paid),
                        formatCurrency(plan.left_to_pay),
                        `"${formatString(plan.status)}"`,
                        `"${formatDate(plan.dates)}"`,
                        `"${formatString(plan.notes)}"`
                    ].join(',');
                } catch (rowError) {
                    console.error('Error processing payment plan row:', plan, rowError);
                    return ''; // Skip problematic rows
                }
            }).filter(row => row !== '') // Remove empty rows
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

        return true;
    } catch (error) {
        console.error('CSV Export Error:', error);
        throw error;
    }
};
