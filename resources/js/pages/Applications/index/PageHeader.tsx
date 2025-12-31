// resources/js/Pages/Applications/components/PageHeader.tsx
import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';

interface PageHeaderProps {
    onExport: () => void;
    onAddNew: () => void;
    isExporting: boolean;
    hasExportData: boolean;
    hasCreatePermission: boolean;
}

export default function PageHeader({
    onExport,
    onAddNew,
    isExporting,
    hasExportData,
    hasCreatePermission,
}: PageHeaderProps) {
    return (
        <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Applications</h1>
            <div className="flex items-center gap-2">
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
                {hasCreatePermission && (
                    <Button onClick={onAddNew}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Application
                    </Button>
                )}
            </div>
        </div>
    );
}
