import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Unit } from '@/types/unit';
import { Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface UnitsTableProps {
    units: Unit[];
    hasEditPermission: boolean;
    hasDeletePermission: boolean;
    onEdit: (unit: Unit) => void;
    onDelete: (unit: Unit) => void;
}

const formatDateOnly = (value?: string | null, fallback = '-'): string => {
    if (!value) return fallback;

    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    if (!m) return fallback;

    const [, y, mo, d] = m;
    const date = new Date(Number(y), Number(mo) - 1, Number(d));
    return format(date, 'P');
};

const UnitsTable: React.FC<UnitsTableProps> = ({ units, hasEditPermission, hasDeletePermission, onEdit, onDelete }) => {
    const getVacantBadge = (vacant: string) => {
        if (!vacant) return <Badge variant="outline">-</Badge>;
        return <Badge variant={vacant === 'Yes' ? 'destructive' : 'default'}>{vacant}</Badge>;
    };

    const getListedBadge = (listed: string) => {
        if (!listed) return <Badge variant="outline">-</Badge>;
        return <Badge variant={listed === 'Yes' ? 'default' : 'secondary'}>{listed}</Badge>;
    };

    const getInsuranceBadge = (insurance: string | null) => {
        if (!insurance || insurance === '-') return <Badge variant="outline">N/A</Badge>;
        return <Badge variant={insurance === 'Yes' ? 'default' : 'destructive'}>{insurance}</Badge>;
    };

    return (
        <div className="relative overflow-x-auto">
            <Table className="border-collapse rounded-md border border-border">
                <TableHeader>
                    <TableRow className="border-border">
                        <TableHead className="sticky left-0 z-10 min-w-[120px] border border-border bg-muted text-muted-foreground">
                            City
                        </TableHead>
                        <TableHead className="sticky left-[120px] z-10 min-w-[120px] border border-border bg-muted text-muted-foreground">
                            Property
                        </TableHead>
                        <TableHead className="sticky left-[240px] z-10 min-w-[120px] border border-border bg-muted text-muted-foreground">
                            Unit Name
                        </TableHead>
                        <TableHead className="border border-border bg-muted text-muted-foreground">Tenants</TableHead>
                        <TableHead className="border border-border bg-muted text-muted-foreground">Lease Start</TableHead>
                        <TableHead className="border border-border bg-muted text-muted-foreground">Lease End</TableHead>
                        <TableHead className="border border-border bg-muted text-muted-foreground">Beds</TableHead>
                        <TableHead className="border border-border bg-muted text-muted-foreground">Baths</TableHead>
                        <TableHead className="border border-border bg-muted text-muted-foreground">Lease Status</TableHead>
                        <TableHead className="border border-border bg-muted text-muted-foreground">New Lease</TableHead>
                        <TableHead className="border border-border bg-muted text-muted-foreground">Monthly Rent</TableHead>
                        <TableHead className="border border-border bg-muted text-muted-foreground">
                            Recurring Transaction
                        </TableHead>
                        <TableHead className="border border-border bg-muted text-muted-foreground">Utility Status</TableHead>
                        <TableHead className="border border-border bg-muted text-muted-foreground">Account Number</TableHead>
                        <TableHead className="border border-border bg-muted text-muted-foreground">Insurance</TableHead>
                        <TableHead className="border border-border bg-muted text-muted-foreground">Insurance Exp.</TableHead>
                        <TableHead className="border border-border bg-muted text-muted-foreground">Vacant</TableHead>
                        <TableHead className="border border-border bg-muted text-muted-foreground">Listed</TableHead>
                        <TableHead className="border border-border bg-muted text-muted-foreground">Applications</TableHead>
                        {(hasEditPermission || hasDeletePermission) && (
                            <TableHead className="border border-border bg-muted text-muted-foreground">Actions</TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {units.map((unit) => (
                        <TableRow key={unit.id} className="border-border hover:bg-muted/50">
                            <TableCell className="sticky left-0 z-10 min-w-[120px] border border-border bg-muted text-center font-medium text-foreground">
                                {unit.city}
                            </TableCell>
                            <TableCell className="sticky left-[120px] z-10 min-w-[120px] border border-border bg-muted text-center font-medium text-foreground">
                                {unit.property}
                            </TableCell>
                            <TableCell className="sticky left-[240px] z-10 min-w-[120px] border border-border bg-muted text-center font-medium text-foreground">
                                {unit.unit_name}
                            </TableCell>
                            <TableCell className="border border-border text-center text-foreground">
                                {unit.tenants || '-'}
                            </TableCell>
                            <TableCell className="border border-border text-center text-foreground">
                                {formatDateOnly(unit.lease_start)}
                            </TableCell>
                            <TableCell className="border border-border text-center text-foreground">
                                {formatDateOnly(unit.lease_end)}
                            </TableCell>
                            <TableCell className="border border-border text-center text-foreground">
                                {unit.count_beds || '-'}
                            </TableCell>
                            <TableCell className="border border-border text-center text-foreground">
                                {unit.count_baths || '-'}
                            </TableCell>
                            <TableCell className="border border-border text-center text-foreground">
                                {unit.lease_status || '-'}
                            </TableCell>
                            <TableCell className="border border-border text-center text-foreground">
                                {unit.is_new_lease || '-'}
                            </TableCell>
                            <TableCell className="border border-border text-center text-foreground">
                                <span className="font-medium">{unit.formatted_monthly_rent}</span>
                            </TableCell>
                            <TableCell className="border border-border text-center text-foreground">
                                <div className="max-w-32 truncate" title={unit.recurring_transaction || ''}>
                                    {unit.recurring_transaction || '-'}
                                </div>
                            </TableCell>
                            <TableCell className="border border-border text-center text-foreground">
                                <div className="max-w-24 truncate" title={unit.utility_status || ''}>
                                    {unit.utility_status || '-'}
                                </div>
                            </TableCell>
                            <TableCell className="border border-border text-center text-foreground">
                                <div className="max-w-24 truncate" title={unit.account_number || ''}>
                                    {unit.account_number || '-'}
                                </div>
                            </TableCell>
                            <TableCell className="border border-border text-center">
                                {getInsuranceBadge(unit.insurance)}
                            </TableCell>
                            <TableCell className="border border-border text-center text-foreground">
                                {unit.insurance_expiration_date ? formatDateOnly(unit.insurance_expiration_date) : '-'}
                            </TableCell>
                            <TableCell className="border border-border text-center">{getVacantBadge(unit.vacant)}</TableCell>
                            <TableCell className="border border-border text-center">{getListedBadge(unit.listed)}</TableCell>
                            <TableCell className="border border-border text-center">
                                <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                                    {unit.total_applications}
                                </Badge>
                            </TableCell>
                            {(hasEditPermission || hasDeletePermission) && (
                                <TableCell className="border border-border text-center">
                                    <div className="flex gap-1">
                                        {hasEditPermission && (
                                            <Button variant="outline" size="sm" onClick={() => onEdit(unit)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        )}
                                        {hasDeletePermission && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onDelete(unit)}
                                                className="border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default UnitsTable;
