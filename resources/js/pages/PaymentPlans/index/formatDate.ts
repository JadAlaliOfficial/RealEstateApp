import { format } from 'date-fns';

/**
 * Always treat the value as a date-only (no time, no TZ).
 * Works for "YYYY-MM-DD" and for ISO strings by grabbing the first 10 chars.
 */
export const formatDateOnly = (value?: string | null, fallback = '-'): string => {
    if (!value) return fallback;

    // Grab YYYY-MM-DD from the front (works for "2025-10-01" and "2025-10-01T00:00:00Z")
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    if (!m) return fallback;

    const [, y, mo, d] = m;
    // Construct a local calendar date (no timezone shifting)
    const date = new Date(Number(y), Number(mo) - 1, Number(d));
    return format(date, 'P'); // localized short date (or use 'MM/dd/yyyy' if you want fixed format)
};
