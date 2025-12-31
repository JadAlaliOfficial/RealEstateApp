import { AlertCircle } from 'lucide-react';

interface PaymentPlan {
    tenant: string;
    property: string;
    unit: string;
    city_name: string | null;
}

interface Props {
    paymentPlan: PaymentPlan;
}

export function OriginalPaymentInfo({ paymentPlan }: Props) {
    return (
        <div className="rounded-lg border border-muted bg-muted/20 p-4">
            <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Original Payment Plan</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <span className="font-medium">Tenant:</span> {paymentPlan.tenant}
                </div>
                <div>
                    <span className="font-medium">Property:</span> {paymentPlan.property}
                </div>
                <div>
                    <span className="font-medium">Unit:</span> {paymentPlan.unit}
                </div>
                <div>
                    <span className="font-medium">City:</span> {paymentPlan.city_name}
                </div>
            </div>
        </div>
    );
}
