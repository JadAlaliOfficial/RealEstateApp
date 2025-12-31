import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';

interface PageHeaderProps {
    title: string;
    onExport: () => void;
    onAdd: () => void;
    isExporting: boolean;
    hasRecords: boolean;
    canCreate: boolean;
}

export function PageHeader({ title, onExport, onAdd, isExporting, hasRecords, canCreate }: PageHeaderProps) {
    return (
        <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <div className="flex items-center gap-2">
                {/* Export Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onExport}
                    disabled={isExporting || !hasRecords}
                    className="flex items-center"
                >
                    <Download className="mr-2 h-4 w-4" />
                    {isExporting ? 'Exporting...' : 'Export CSV'}
                </Button>

                {canCreate && (
                    <Button onClick={onAdd}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Record
                    </Button>
                )}
            </div>
        </div>
    );
}
