import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, X } from 'lucide-react';

interface ImportStatsCardProps {
    stats: {
        success_count: number;
        error_count: number;
        skipped_count: number;
        total_processed: number;
    };
    onClose: () => void;
}

const ImportStatsCard: React.FC<ImportStatsCardProps> = ({ stats, onClose }) => {
    if (!stats) return null;

    return (
        <Card className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <CardTitle className="text-lg font-semibold text-green-800 dark:text-green-200">Import Completed Successfully</CardTitle>
                    </div>
                    <Button onClick={onClose} variant="ghost" size="sm" className="text-green-600 hover:text-green-800 dark:text-green-400">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.success_count}</div>
                        <div className="text-sm text-green-600 dark:text-green-400">Success</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.error_count}</div>
                        <div className="text-sm text-blue-600 dark:text-blue-400">Errors</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">{stats.skipped_count}</div>
                        <div className="text-sm text-orange-600 dark:text-orange-400">Skipped</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{stats.total_processed}</div>
                        <div className="text-sm text-purple-600 dark:text-purple-400">Total Processed</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ImportStatsCard;
