import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Plus, Upload } from 'lucide-react';

interface TenantPageHeaderProps {
    onExport: () => void;
    onImport: () => void;
    onAddNew: () => void;
    isExporting: boolean;
    hasExportData: boolean;
    canImport: boolean;
    canCreate: boolean;
}

export const TenantPageHeader: React.FC<TenantPageHeaderProps> = ({
    onExport,
    onImport,
    onAddNew,
    isExporting,
    hasExportData,
    canImport,
    canCreate,
}) => {
    return (
        <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">Tenants</h1>
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

                {/* Import Button */}
                {canImport && (
                    <Button onClick={onImport} variant="outline" size="sm" className="flex items-center">
                        <Upload className="mr-2 h-4 w-4" />
                        Import CSV
                    </Button>
                )}

                {canCreate && (
                    <Button onClick={onAddNew}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Tenant
                    </Button>
                )}
            </div>
        </div>
    );
};
