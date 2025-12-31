import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';

interface PageHeaderProps {
    hasActiveFilters: boolean;
    isExporting: boolean;
    hasData: boolean;
    hasCreatePermission: boolean;
    onExport: () => void;
    onCreateClick: () => void;
}

export default function PageHeader({
    hasActiveFilters,
    isExporting,
    hasData,
    hasCreatePermission,
    onExport,
    onCreateClick,
}: PageHeaderProps) {
    return (
        <div className="mb-6 flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Move-In Management</h1>
                {hasActiveFilters && (
                    <p className="text-sm text-muted-foreground mt-1">
                        Showing filtered results
                    </p>
                )}
            </div>
            <div className="flex items-center gap-2">
                {/* Export Button */}
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
                    <Button onClick={onCreateClick}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Move-In Record
                    </Button>
                )}
            </div>
        </div>
    );
}
