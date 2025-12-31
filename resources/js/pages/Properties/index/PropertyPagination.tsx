// resources/js/Pages/Properties/index/PropertyPagination.tsx
import { router } from '@inertiajs/react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { PaginatedProperties } from '@/types/property';

interface PropertyPaginationProps {
    paginatedData: PaginatedProperties;
    currentPerPage: number | 'all';
    onPerPageChange: (perPage: number | 'all') => void;
}

/**
 * Pagination component for property list
 * Handles page navigation and per-page selection
 * Preserves filters and state during navigation
 */
export default function PropertyPagination({
    paginatedData,
    currentPerPage,
    onPerPageChange,
}: PropertyPaginationProps) {
    const { current_page, last_page, links, from, to, total } = paginatedData;

    /**
     * Handle page link click
     * Navigates to selected page while preserving filters and per_page
     */
    const handlePageClick = (url: string | null) => {
        if (!url) return;

        router.get(url, {}, {
            preserveState: true,  // Preserve component state
            preserveScroll: false, // Scroll to top on page change
        });
    };

    /**
     * Generate page numbers to display
     * Shows first page, last page, current page, and pages around current
     */
    const getPageNumbers = () => {
        const pages: (number | 'ellipsis')[] = [];
        
        if (last_page <= 7) {
            // Show all pages if total is 7 or less
            for (let i = 1; i <= last_page; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);
            
            // Calculate range around current page
            const startPage = Math.max(2, current_page - 1);
            const endPage = Math.min(last_page - 1, current_page + 1);
            
            // Add ellipsis after first page if needed
            if (startPage > 2) {
                pages.push('ellipsis');
            }
            
            // Add pages around current page
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
            
            // Add ellipsis before last page if needed
            if (endPage < last_page - 1) {
                pages.push('ellipsis');
            }
            
            // Always show last page
            pages.push(last_page);
        }
        
        return pages;
    };

    return (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Per page selector */}
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show:</span>
                <Select
                    value={currentPerPage.toString()}
                    onValueChange={(value) => {
                        if (value === 'all') {
                            onPerPageChange('all');
                        } else {
                            onPerPageChange(parseInt(value));
                        }
                    }}
                >
                    <SelectTrigger className="w-[100px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="15">15</SelectItem>
                        <SelectItem value="30">30</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="all">All</SelectItem>
                    </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">
                    per page
                </span>
            </div>

            {/* Page info */}
            <div className="text-sm text-muted-foreground">
                Showing {from} to {to} of {total} results
            </div>

            {/* Pagination controls */}
            <Pagination>
                <PaginationContent>
                    {/* Previous button - FIX: Added size prop */}
                    <PaginationItem>
                        <PaginationPrevious
                            size="sm"
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handlePageClick(links[0]?.url);
                            }}
                            className={
                                !links[0]?.url
                                    ? 'pointer-events-none opacity-50'
                                    : 'cursor-pointer'
                            }
                        />
                    </PaginationItem>

                    {/* Page numbers - FIX: Added size prop to PaginationLink */}
                    {getPageNumbers().map((page, index) => (
                        <PaginationItem key={index}>
                            {page === 'ellipsis' ? (
                                <PaginationEllipsis />
                            ) : (
                                <PaginationLink
                                    size="sm"
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const link = links.find((l) => l.label === page.toString());
                                        if (link) handlePageClick(link.url);
                                    }}
                                    isActive={current_page === page}
                                    className="cursor-pointer"
                                >
                                    {page}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}

                    {/* Next button - FIX: Added size prop */}
                    <PaginationItem>
                        <PaginationNext
                            size="sm"
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handlePageClick(links[links.length - 1]?.url);
                            }}
                            className={
                                !links[links.length - 1]?.url
                                    ? 'pointer-events-none opacity-50'
                                    : 'cursor-pointer'
                            }
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
