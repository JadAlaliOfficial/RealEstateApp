import { Badge } from '@/components/ui/badge';

interface YesNoBadgeProps {
    value: string | null;
}

export function YesNoBadge({ value }: YesNoBadgeProps) {
    if (!value || value === '-') return <Badge variant="outline">N/A</Badge>;
    
    return (
        <Badge
            variant={value === 'Yes' ? 'default' : 'secondary'}
            className={
                value === 'Yes'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
            }
        >
            {value}
        </Badge>
    );
}
