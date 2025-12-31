import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React from 'react';

interface TableHeaderProps {
    activeTab: 'offers' | 'renewals' | 'both';
    hasPermissions: boolean;
}

export const OffersTableHeader: React.FC<TableHeaderProps> = ({ activeTab, hasPermissions }) => {
    return (
        <TableHeader>
            <TableRow className="border-border">
                <TableHead className="sticky left-0 z-10 min-w-[120px] border border-border bg-muted text-muted-foreground text-center">City</TableHead>
                <TableHead className="sticky left-[120px] z-10 min-w-[150px] border border-border bg-muted text-muted-foreground text-center">Property</TableHead>
                <TableHead className="sticky left-[270px] z-10 min-w-[120px] border border-border bg-muted text-muted-foreground text-center">Unit</TableHead>
                <TableHead className="sticky left-[390px] z-10 min-w-[150px] border border-border bg-muted text-muted-foreground text-center">Tenant</TableHead>
                {(activeTab === 'offers' || activeTab === 'both') && (
                    <>
                        <TableHead className="border border-border bg-muted text-muted-foreground text-center">Other Tenants</TableHead>
                        <TableHead className="border border-border bg-muted text-muted-foreground text-center">Date of Decline</TableHead>
                        <TableHead className="border border-border bg-muted text-muted-foreground text-center">Date Sent Offer</TableHead>
                        <TableHead className="border border-border bg-muted text-muted-foreground text-center">Status</TableHead>
                        <TableHead className="border border-border bg-muted text-muted-foreground text-center">Date of Acceptance</TableHead>
                        <TableHead className="border border-border bg-muted text-muted-foreground text-center">Offer Last Notice Sent</TableHead>
                        <TableHead className="border border-border bg-muted text-muted-foreground text-center">Offer Notice Kind</TableHead>
                    </>
                )}
                {(activeTab === 'renewals' || activeTab === 'both') && (
                    <>
                        <TableHead className="border border-border bg-muted text-muted-foreground text-center">Lease Sent?</TableHead>
                        <TableHead className="border border-border bg-muted text-muted-foreground text-center">Date Sent Lease</TableHead>
                        <TableHead className="border border-border bg-muted text-muted-foreground text-center">Lease Signed?</TableHead>
                        <TableHead className="border border-border bg-muted text-muted-foreground text-center">Date Signed</TableHead>
                        <TableHead className="border border-border bg-muted text-muted-foreground text-center">Renewal Last Notice Sent</TableHead>
                        <TableHead className="border border-border bg-muted text-muted-foreground text-center">Renewal Notice Kind</TableHead>
                        <TableHead className="border border-border bg-muted text-muted-foreground text-center">Notes</TableHead>
                    </>
                )}

                <TableHead className="border border-border bg-muted text-muted-foreground text-center">How Many Days Left</TableHead>
                <TableHead className="border border-border bg-muted text-muted-foreground text-center">Expired</TableHead>
                {hasPermissions && <TableHead className="border border-border bg-muted text-muted-foreground text-center">Actions</TableHead>}
            </TableRow>
        </TableHeader>
    );
};
