import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { PaymentPlan } from '@/types/PaymentPlan';
import { exportToCSV } from './csvExport';

interface PageHeaderProps {
    paymentPlans: { data: PaymentPlan[] };
    onAddClick: () => void;
}

export default function PageHeader({ paymentPlans, onAddClick }: PageHeaderProps) {
    const { hasAllPermissions } = usePermissions();
    const [isExporting, setIsExporting] = useState(false);

    const handleCSVExport = () => {
        if (!paymentPlans || !paymentPlans.data || paymentPlans.data.length === 0) {
            alert('No data to export');
            return;
        }

        setIsExporting(true);

        try {
            console.log('Exporting payment plans data:', paymentPlans.data);
            const filename = `payment-plans-${new Date().toISOString().split('T')[0]}.csv`;
            exportToCSV(paymentPlans.data, filename);

            console.log('Export completed successfully');
        } catch (error) {
            console.error('Export failed:', error);
            alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please check the console for details.`);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Payment Plans Management</h1>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCSVExport}
                    disabled={isExporting || !paymentPlans?.data || paymentPlans.data.length === 0}
                    className="flex items-center"
                >
                    <Download className="mr-2 h-4 w-4" />
                    {isExporting ? 'Exporting...' : 'Export CSV'}
                </Button>

                {hasAllPermissions(['payment-plans.create', 'payment-plans.store']) && (
                    <Button onClick={onAddClick}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Payment Plan
                    </Button>
                )}
            </div>
        </div>
    );
}
