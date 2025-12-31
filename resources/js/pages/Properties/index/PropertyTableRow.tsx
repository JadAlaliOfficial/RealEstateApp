// resources/js/Pages/Properties/index/PropertyTableRow.tsx
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Property } from '@/types/property';
import PropertyStatusBadge from './PropertyStatusBadge';
import PropertyDaysLeftBadge from './PropertyDaysLeftBadge';

interface PropertyTableRowProps {
    property: Property;
    onEdit: (property: Property) => void;
    onDelete: (property: Property) => void;
    onShow: (property: Property) => void;
    canEdit: boolean;
    canDelete: boolean;
    canShow: boolean;
    hasAnyActionPermission: boolean;
}

/**
 * Table row component for a single property
 * Displays property data and action buttons based on permissions
 */
export default function PropertyTableRow({
    property,
    onEdit,
    onDelete,
    onShow,
    canEdit,
    canDelete,
    canShow,
    hasAnyActionPermission,
}: PropertyTableRowProps) {
    /**
     * Calculate days left until expiration
     * Returns negative number if expired
     */
    const calculateDaysLeft = (expirationDate: string): number => {
        const today = new Date();
        const expDate = new Date(expirationDate);
        const diffTime = expDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    /**
     * Truncate text and append dots after a max length
     * Shows "N/A" when empty or undefined
     */
    const truncateText = (text?: string, max: number = 20): string => {
        if (!text) return 'N/A';
        const trimmed = text.trim();
        if (trimmed.length === 0) return 'N/A';
        return trimmed.length > max ? `${trimmed.slice(0, max)}...` : trimmed;
    };

    return (
        <TableRow className="hover:bg-muted/50 border-border">
            {/* City - first sticky column */}
            <TableCell className="text-center text-foreground border border-border bg-muted sticky left-0 z-20 min-w-[120px]">
                {property.property?.city?.city || 'N/A'}
            </TableCell>
            {/* Property Name - second sticky column for horizontal scrolling */}
            <TableCell className="font-medium text-center text-foreground border border-border bg-muted sticky left-[120px] z-10 min-w-[160px]">
                {property.property?.property_name || 'N/A'}
            </TableCell>
            
            {/* Insurance Company Name */}
            <TableCell className="text-center text-foreground border border-border">
                {property.insurance_company_name || 'N/A'}
            </TableCell>
            
            {/* Amount - formatted currency */}
            <TableCell className="text-center text-foreground border border-border">
                {property.formatted_amount || 'N/A'}
            </TableCell>
            
            {/* Effective Date */}
            <TableCell className="text-center text-foreground border border-border">
                {property.effective_date || 'N/A'}
            </TableCell>
            
            {/* Policy Number */}
            <TableCell className="text-center text-foreground border border-border">
                {property.policy_number || 'N/A'}
            </TableCell>
            
            {/* Expiration Date */}
            <TableCell className="text-center text-foreground border border-border">
                {property.expiration_date || 'N/A'}
            </TableCell>
            
            {/* Days Left - colored badge based on urgency */}
            <TableCell className="text-center border border-border">
                <PropertyDaysLeftBadge daysLeft={calculateDaysLeft(property.expiration_date)} />
            </TableCell>
            
            {/* Notes - optional text */}
            <TableCell className="text-left text-foreground border border-border max-w-[240px] break-words">
                {truncateText(property.notes)}
            </TableCell>
            
            {/* Status - Active/Expired badge */}
            <TableCell className="text-center border border-border">
                <PropertyStatusBadge status={property.status} />
            </TableCell>
            
            {/* Action Buttons - only shown if user has any permission */}
            {hasAnyActionPermission && (
                <TableCell className="text-center border border-border">
                    <div className="flex gap-1 justify-center">
                        {/* Show/View button */}
                        {canShow && (
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => onShow(property)}
                                title="View details"
                            >
                                <Eye className="h-4 w-4" />
                            </Button>
                        )}
                        
                        {/* Edit button */}
                        {canEdit && (
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => onEdit(property)}
                                title="Edit property"
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                        )}
                        
                        {/* Delete button */}
                        {canDelete && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onDelete(property)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                                title="Delete property"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </TableCell>
            )}
        </TableRow>
    );
}
