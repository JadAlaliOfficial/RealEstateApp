// components/PermanentBadge.tsx
import { Badge } from '@/components/ui/badge';

interface PermanentBadgeProps {
    permanent: string | null;
}

export default function PermanentBadge({ permanent }: PermanentBadgeProps) {
    if (!permanent) return <Badge variant="outline">N/A</Badge>;

    return (
        <Badge
            variant={permanent === 'Yes' ? 'default' : 'secondary'}
            className={
                permanent === 'Yes'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
            }
        >
            {permanent}
        </Badge>
    );
}
