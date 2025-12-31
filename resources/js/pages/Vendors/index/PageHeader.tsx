import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';

interface PageHeaderProps {
    hasExportPermission: boolean;
    hasCreatePermissions: boolean;
    isExporting: boolean;
    onExport: () => void;
    onAddVendor: () => void;
}

export default function PageHeader({
    hasExportPermission,
    hasCreatePermissions,
    isExporting,
    onExport,
    onAddVendor,
}: PageHeaderProps) {
    return (
        <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Vendor List</h1>
            <div className="flex gap-2">
                {hasExportPermission && (
                    <Button onClick={onExport} disabled={isExporting} variant="outline" className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        {isExporting ? 'Exporting...' : 'Export CSV'}
                    </Button>
                )}
                {hasCreatePermissions && (
                    <Button onClick={onAddVendor} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Vendor
                    </Button>
                )}
            </div>
        </div>
    );
}
