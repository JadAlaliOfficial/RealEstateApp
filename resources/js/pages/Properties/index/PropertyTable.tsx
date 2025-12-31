// resources/js/Pages/Properties/index/PropertyTable.tsx
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Property } from '@/types/property';
import PropertyTableRow from './PropertyTableRow';

interface PropertyTableProps {
    properties: Property[];
    onEdit: (property: Property) => void;
    onDelete: (property: Property) => void;
    onShow: (property: Property) => void;
    canEdit: boolean;
    canDelete: boolean;
    canShow: boolean;
    hasAnyActionPermission: boolean;
}

/**
 * Table component for displaying property list
 * Renders table header and rows with action buttons
 */
export default function PropertyTable({
    properties,
    onEdit,
    onDelete,
    onShow,
    canEdit,
    canDelete,
    canShow,
    hasAnyActionPermission,
}: PropertyTableProps) {
    return (
        <div className="overflow-x-auto relative">
            <Table className="border-collapse border border-border rounded-md">
                <TableHeader>
                    <TableRow className="border-border">
                        {/* Sticky City column at the start */}
                        <TableHead className="text-muted-foreground border border-border bg-muted sticky left-0 z-20 min-w-[120px]">
                            City
                        </TableHead>
                        {/* Property Name becomes the second sticky column */}
                        <TableHead className="text-muted-foreground border border-border bg-muted sticky left-[120px] z-10 min-w-[160px]">
                            Property Name
                        </TableHead>
                        <TableHead className="text-muted-foreground border border-border bg-muted">
                            Insurance Company
                        </TableHead>
                        <TableHead className="text-muted-foreground border border-border bg-muted">
                            Amount
                        </TableHead>
                        <TableHead className="text-muted-foreground border border-border bg-muted">
                            Effective Date
                        </TableHead>
                        <TableHead className="text-muted-foreground border border-border bg-muted">
                            Policy Number
                        </TableHead>
                        <TableHead className="text-muted-foreground border border-border bg-muted">
                            Expiration Date
                        </TableHead>
                        <TableHead className="text-muted-foreground border border-border bg-muted">
                            Days Left
                        </TableHead>
                        <TableHead className="text-muted-foreground border border-border bg-muted">
                            Notes
                        </TableHead>
                        <TableHead className="text-muted-foreground border border-border bg-muted">
                            Status
                        </TableHead>
                        {/* Only show Actions column if user has any action permission */}
                        {hasAnyActionPermission && (
                            <TableHead className="text-muted-foreground border border-border bg-muted">
                                Actions
                            </TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {properties.map((property) => (
                        <PropertyTableRow
                            key={property.id}
                            property={property}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onShow={onShow}
                            canEdit={canEdit}
                            canDelete={canDelete}
                            canShow={canShow}
                            hasAnyActionPermission={hasAnyActionPermission}
                        />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
