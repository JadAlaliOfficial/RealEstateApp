import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';

interface PropertyPageHeaderProps {
    onExport: () => void;
    onAddProperty: () => void;
    isExporting: boolean;
    hasExportData: boolean;
    canCreate: boolean;
}

export default function PropertyPageHeader({
    onExport,
    onAddProperty,
    isExporting,
    hasExportData,
    canCreate,
}: PropertyPageHeaderProps) {
    return (
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-foreground">Property Insurance List</h1>
            <div className="flex gap-2 items-center">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onExport}
                    disabled={isExporting || !hasExportData}
                    className="flex items-center"
                >
                    <Download className="h-4 w-4 mr-2" />
                    {isExporting ? 'Exporting...' : 'Export CSV'}
                </Button>

                {canCreate && (
                    <Button onClick={onAddProperty}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Property
                    </Button>
                )}
            </div>
        </div>
    );
}
