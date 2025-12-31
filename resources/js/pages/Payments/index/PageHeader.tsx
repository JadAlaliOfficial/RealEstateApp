import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';


interface Statistics {
    total: number;
    paid: number;
    didnt_pay: number;
    paid_partly: number;
    overpaid: number;
}


interface PageHeaderProps {
    onExport: () => void;
    onAddPayment: () => void;
    isExporting: boolean;
    hasData: boolean;
    canCreate: boolean;
    statistics?: Statistics;
}


export default function PageHeader({ 
    onExport, 
    onAddPayment, 
    isExporting, 
    hasData, 
    canCreate,
    statistics
}: PageHeaderProps) {
    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">Payments Management</h1>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onExport}
                        disabled={isExporting || !hasData}
                        className="flex items-center"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        {isExporting ? 'Exporting...' : 'Export CSV'}
                    </Button>

                    {canCreate && (
                        <Button onClick={onAddPayment} className="bg-primary text-background">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Payment
                        </Button>
                    )}
                </div>
            </div>

            {statistics && (
                <Card className="bg-card text-card-foreground shadow-lg mb-6">
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-5 pt-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-foreground">{statistics.total}</div>
                                <div className="text-sm text-muted-foreground">Total</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{statistics.paid}</div>
                                <div className="text-sm text-muted-foreground">Paid</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{statistics.paid_partly}</div>
                                <div className="text-sm text-muted-foreground">Paid Partly</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{statistics.didnt_pay}</div>
                                <div className="text-sm text-muted-foreground">Didn't Pay</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{statistics.overpaid}</div>
                                <div className="text-sm text-muted-foreground">Overpaid</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </>
    );
}
