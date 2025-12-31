// components/EmptyState.tsx
import { Card, CardContent } from '@/components/ui/card';

export default function EmptyState() {
    return (
        <Card className="bg-card text-card-foreground shadow-lg">
            <CardContent>
                <div className="py-8 text-center text-muted-foreground">
                    <p className="text-lg">No payments found.</p>
                    <p className="text-sm">Try adjusting your search criteria.</p>
                </div>
            </CardContent>
        </Card>
    );
}
