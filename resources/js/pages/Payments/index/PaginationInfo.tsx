// components/PaginationInfo.tsx
import { Card, CardContent } from '@/components/ui/card';

interface PaginationInfoProps {
    meta: any;
}

export default function PaginationInfo({ meta }: PaginationInfoProps) {
    if (!meta) return null;

    return (
        <Card className="bg-card text-card-foreground shadow-lg mt-6">
            <CardContent>
                <div className="flex items-center justify-between border-t border-border pt-4">
                    <div className="text-sm text-muted-foreground">
                        Showing {meta.from || 0} to {meta.to || 0} of {meta.total || 0} results
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
