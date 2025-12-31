import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';

interface PageHeaderProps {
    onExport: () => void;
    onAddTask: () => void;
    isExporting: boolean;
    hasExportData: boolean;
    canCreate: boolean;
}

export default function PageHeader({
    onExport,
    onAddTask,
    isExporting,
    hasExportData,
    canCreate,
}: PageHeaderProps) {
    return (
        <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Vendor Task Tracker</h1>
            <div className="flex items-center gap-2">
                {/* Export Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onExport}
                    disabled={isExporting || !hasExportData}
                    className="flex items-center"
                >
                    <Download className="mr-2 h-4 w-4" />
                    {isExporting ? 'Exporting...' : 'Export CSV'}
                </Button>

                {canCreate && (
                    <Button onClick={onAddTask}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Task
                    </Button>
                )}
            </div>
        </div>
    );
}
