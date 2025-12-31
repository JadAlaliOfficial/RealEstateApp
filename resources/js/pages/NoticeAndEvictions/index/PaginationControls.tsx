import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface PaginationControlsProps {
    currentPage: number;
    lastPage: number;
    perPage: number | string;
    onPageChange: (page: number) => void;
    onPerPageChange: (value: number | string) => void;
}

export function PaginationControls({
    currentPage,
    lastPage,
    perPage,
    onPageChange,
    onPerPageChange,
}: PaginationControlsProps) {
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const showEllipsisThreshold = 3;

        if (lastPage <= 7) {
            for (let i = 1; i <= lastPage; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (currentPage > showEllipsisThreshold + 1) {
                pages.push('...');
            }

            const rangeStart = Math.max(2, currentPage - 1);
            const rangeEnd = Math.min(lastPage - 1, currentPage + 1);

            for (let i = rangeStart; i <= rangeEnd; i++) {
                if (!pages.includes(i)) {
                    pages.push(i);
                }
            }

            if (currentPage < lastPage - showEllipsisThreshold) {
                pages.push('...');
            }

            pages.push(lastPage);
        }

        return pages;
    };

    return (
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:gap-6">
            {/* Per Page Selector */}
            <div className="flex items-center gap-3">
                <label htmlFor="per-page" className="text-sm font-medium text-foreground">
                    Per page:
                </label>
                <Select
                    value={String(perPage)}
                    onValueChange={(value) => {
                        onPerPageChange(value === 'all' ? 'all' : parseInt(value));
                    }}
                >
                    <SelectTrigger className="w-24">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="15">15</SelectItem>
                        <SelectItem value="30">30</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="all">All</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Page Navigation */}
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {getPageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                        {page === '...' ? (
                            <span className="px-2 text-muted-foreground">...</span>
                        ) : (
                            <Button
                                variant={currentPage === page ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => onPageChange(Number(page))}
                                className="min-w-10"
                            >
                                {page}
                            </Button>
                        )}
                    </React.Fragment>
                ))}

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === lastPage}
                    className="flex items-center"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
