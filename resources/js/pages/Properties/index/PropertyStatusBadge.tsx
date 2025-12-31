import { Badge } from '@/components/ui/badge';

interface PropertyStatusBadgeProps {
    status: string;
}

export default function PropertyStatusBadge({ status }: PropertyStatusBadgeProps) {
    if (status === 'Expired') {
        return <Badge variant="destructive">Expired</Badge>;
    }
    return (
        <Badge 
            variant="default" 
            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
        >
            Active
        </Badge>
    );
}
