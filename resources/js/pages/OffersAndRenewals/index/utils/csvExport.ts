import { format } from 'date-fns';

const formatDateOnly = (value?: string | null, fallback = '-'): string => {
  if (!value) return fallback;

  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!m) return fallback;

  const [, y, mo, d] = m;
  const date = new Date(Number(y), Number(mo) - 1, Number(d));
  return format(date, 'P');
};

export const exportToCSV = (data: any[], activeTab: string, filename: string = 'offers-renewals.csv') => {
  try {
    const formatString = (value: string | null | undefined) => {
      if (value === null || value === undefined) return '';
      return String(value).replace(/"/g, '""');
    };

    let headers = ['ID', 'City', 'Property', 'Unit', 'Tenant'];

    if (activeTab === 'offers' || activeTab === 'both') {
      headers = headers.concat([
        'Date Sent Offer',
        'Status',
        'Date of Acceptance',
        'Offer Last Notice Sent',
        'Offer Notice Kind'
      ]);
    }

    if (activeTab === 'renewals' || activeTab === 'both') {
      headers = headers.concat([
        'Lease Sent',
        'Date Sent Lease',
        'Lease Signed',
        'Date Signed',
        'Renewal Last Notice Sent',
        'Renewal Notice Kind',
        'Notes'
      ]);
    }

    headers = headers.concat(['How Many Days Left', 'Expired', 'Other Tenants', 'Date of Decline']);

    const csvData = [
      headers.join(','),
      ...data.map(offer => {
        try {
          let row = [
            offer.id || '',
            `"${formatString(offer.city_name)}"`,
            `"${formatString(offer.property)}"`,
            `"${formatString(offer.unit)}"`,
            `"${formatString(offer.tenant)}"`
          ];

          if (activeTab === 'offers' || activeTab === 'both') {
            row = row.concat([
              `"${formatDateOnly(offer.date_sent_offer, '')}"`,
              `"${formatString(offer.status)}"`,
              `"${formatDateOnly(offer.date_of_acceptance, '')}"`,
              `"${formatDateOnly(offer.last_notice_sent, '')}"`,
              `"${formatString(offer.notice_kind)}"`
            ]);
          }

          if (activeTab === 'renewals' || activeTab === 'both') {
            row = row.concat([
              `"${formatString(offer.lease_sent)}"`,
              `"${formatDateOnly(offer.date_sent_lease, '')}"`,
              `"${formatString(offer.lease_signed)}"`,
              `"${formatDateOnly(offer.date_signed, '')}"`,
              `"${formatDateOnly(offer.last_notice_sent_2, '')}"`,
              `"${formatString(offer.notice_kind_2)}"`,
              `"${formatString(offer.notes)}"`
            ]);
          }

          row = row.concat([
            `"${formatString(String(offer.how_many_days_left))}"`,
            `"${formatString(offer.expired)}"`,
            `"${formatString(offer.other_tenants)}"`,
            `"${formatDateOnly(offer.date_of_decline, '')}"`
          ]);

          return row.join(',');
        } catch (rowError) {
          console.error('Error processing offer row:', offer, rowError);
          return '';
        }
      }).filter(row => row !== '')
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
