import React from 'react';
import { router } from '@inertiajs/react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: PaginationLink[];
    currentPage: number;
    lastPage: number;
    from?: number | null;
    to?: number | null;
    total?: number | null;
    perPage: number | string;
    onPerPageChange: (value: string) => void;
}

const Pagination: React.FC<PaginationProps> = ({ links, lastPage, from, to, total, perPage, onPerPageChange }) => {
    return (
        <div className="mt-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-muted-foreground">
                Showing {from ?? 0} to {to ?? (total ?? 0)} of {total ?? 0} units
            </div>

            <div className="flex items-center gap-3">
                <label className="text-sm text-muted-foreground">Rows per page:</label>
                <select
                    value={String(perPage)}
                    onChange={(e) => onPerPageChange(e.target.value)}
                    className="flex h-9 w-[120px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                >
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="50">50</option>
                    <option value="all">All</option>
                </select>
            </div>

            {lastPage > 1 && (
                <nav className="flex space-x-2">
                    {links.map((link, index) => (
                        <button
                            key={index}
                            onClick={() => link.url && router.get(link.url)}
                            disabled={!link.url}
                            className={`rounded px-3 py-2 text-sm transition-colors ${
                                link.active
                                    ? 'bg-primary text-primary-foreground'
                                    : link.url
                                      ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                      : 'cursor-not-allowed bg-muted text-muted-foreground'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </nav>
            )}
        </div>
    );
};

export default Pagination;
