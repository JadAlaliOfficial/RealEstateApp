import { Badge } from '@/components/ui/badge';

interface PropertyDaysLeftBadgeProps {
    daysLeft: number;
}

export default function PropertyDaysLeftBadge({ daysLeft }: PropertyDaysLeftBadgeProps) {
    if (daysLeft < 0) {
        return (
            <Badge variant="destructive">
                {Math.abs(daysLeft)} days overdue
            </Badge>
        );
    } else if (daysLeft <= 30) {
        return (
            <Badge 
                variant="secondary" 
                className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
            >
                {daysLeft} days left
            </Badge>
        );
    } else {
        return (
            <Badge 
                variant="default" 
                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
            >
                {daysLeft} days left
            </Badge>
        );
    }
}
