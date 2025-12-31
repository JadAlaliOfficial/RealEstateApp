interface PaginationInfoProps {
    from: number;
    to: number;
    total: number;
    hasActiveFilters: boolean;
}

export default function PaginationInfo({ from, to, total, hasActiveFilters }: PaginationInfoProps) {
    return (
        <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            <div className="text-sm text-muted-foreground">
                Showing {from || 0} to {to || 0} of {total || 0} results
                {hasActiveFilters && <span className="ml-2 text-xs">(filtered)</span>}
            </div>
        </div>
    );
}
