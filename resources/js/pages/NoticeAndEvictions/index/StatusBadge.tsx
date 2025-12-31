import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
    status: string | null;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    if (!status) return <Badge variant="outline">N/A</Badge>;

    switch (status.toLowerCase()) {
        case 'active':
            return (
                <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    {status}
                </Badge>
            );
        case 'pending':
            return (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                    {status}
                </Badge>
            );
        case 'closed':
            return (
                <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                    {status}
                </Badge>
            );
        default:
            return <Badge variant="default">{status}</Badge>;
    }
}
