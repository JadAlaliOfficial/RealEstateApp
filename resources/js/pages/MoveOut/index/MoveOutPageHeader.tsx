import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';

interface MoveOutPageHeaderProps {
    hasCreatePermission: boolean;
    isExporting: boolean;
    hasData: boolean;
    onExport: () => void;
    onAddNew: () => void;
}

export default function MoveOutPageHeader({
    hasCreatePermission,
    isExporting,
    hasData,
    onExport,
    onAddNew,
}: MoveOutPageHeaderProps) {
    return (
        <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Move-Out Management</h1>
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

                {hasCreatePermission && (
                    <Button onClick={onAddNew}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Move-Out Record
                    </Button>
                )}
            </div>
        </div>
    );
}
