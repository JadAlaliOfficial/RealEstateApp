import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { NoticeAndEviction } from '@/types/NoticeAndEviction';
import { NoticeEvictionsTableRow } from './NoticeEvictionsTableRow';


interface NoticeEvictionsTableProps {
    records: NoticeAndEviction[];
    hasShowPermission: boolean;
    hasEditPermission: boolean;
    hasDeletePermission: boolean;
    hasAnyActionPermission: boolean;
    onEdit: (record: NoticeAndEviction) => void;
    onDelete: (record: NoticeAndEviction) => void;
    filterQueryString: string;
}


export function NoticeEvictionsTable({
    records,
    hasShowPermission,
    hasEditPermission,
    hasDeletePermission,
    hasAnyActionPermission,
    onEdit,
    onDelete,
    filterQueryString,
}: NoticeEvictionsTableProps) {
    return (
        <div className="relative overflow-x-auto">
            <Table className="border-collapse rounded-md border border-border">
                <TableHeader>
                    <TableRow className="border-border">
                        <TableHead className="sticky left-0 z-10 min-w-[120px] border border-border bg-muted text-muted-foreground">
                            City Name
                        </TableHead>
                        <TableHead className="sticky left-[120px] z-10 min-w-[150px] border border-border bg-muted text-muted-foreground">
                            Property Name
                        </TableHead>
                        <TableHead className="sticky left-[270px] z-10 min-w-[120px] border border-border bg-muted text-muted-foreground">
                            Unit Name
                        </TableHead>
                        <TableHead className="sticky left-[390px] z-10 min-w-[150px] border border-border bg-muted text-muted-foreground">
                            Tenants Name
                        </TableHead>
                        <TableHead className="text-muted-foreground border border-border bg-muted min-w-[150px]">
                            Other Tenants
                        </TableHead>
                        <TableHead className="text-muted-foreground border border-border bg-muted">Status</TableHead>
                        <TableHead className="text-muted-foreground border border-border bg-muted">Date</TableHead>
                        <TableHead className="text-muted-foreground border border-border bg-muted">Type of Notice</TableHead>
                        <TableHead className="text-muted-foreground border border-border bg-muted">Have An Exception?</TableHead>
                        <TableHead className="text-muted-foreground border border-border bg-muted">Note</TableHead>
                        <TableHead className="text-muted-foreground border border-border bg-muted">Evictions</TableHead>
                        <TableHead className="text-muted-foreground border border-border bg-muted">Sent to Attorney</TableHead>
                        <TableHead className="text-muted-foreground border border-border bg-muted">Hearing Dates</TableHead>
                        <TableHead className="text-muted-foreground border border-border bg-muted">Evicted/Payment Plan</TableHead>
                        <TableHead className="text-muted-foreground border border-border bg-muted">If Left?</TableHead>
                        <TableHead className="text-muted-foreground border border-border bg-muted">Writ Date</TableHead>
                        {hasAnyActionPermission && (
                            <TableHead className="text-muted-foreground border border-border bg-muted">Actions</TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {records.map((record) => (
                        <NoticeEvictionsTableRow
                            key={record.id}
                            record={record}
                            hasShowPermission={hasShowPermission}
                            hasEditPermission={hasEditPermission}
                            hasDeletePermission={hasDeletePermission}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            filterQueryString={filterQueryString}
                        />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
