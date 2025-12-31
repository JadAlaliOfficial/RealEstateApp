import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
    status: string | null;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    if (!status) return <Badge variant="outline">N/A</Badge>;

    switch (status) {
        case 'Paid':
            return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Paid</Badge>;
        case 'Paid Partly':
            return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Paid Partly</Badge>;
        case 'Over Paid':
            return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Over Paid</Badge>;
        case "Didn't Pay":
            return <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Didn't Pay</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
}
