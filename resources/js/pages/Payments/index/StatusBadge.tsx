import { Badge } from '@/components/ui/badge';


interface StatusBadgeProps {
    status: string | null;
}


export default function StatusBadge({ status }: StatusBadgeProps) {
    if (!status) return <Badge variant="outline">N/A</Badge>;

    if (status === 'Paid') {
        return (
            <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                {status}
            </Badge>
        );
    } else if (status === 'Overpaid') {
        return (
            <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                {status}
            </Badge>
        );
    } else if (status === 'Paid Partly') {
        return (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                {status}
            </Badge>
        );
    } else if (status === "Didn't Pay") {
        return (
            <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                {status}
            </Badge>
        );
    } else {
        return <Badge variant="outline">{status}</Badge>;
    }
}
