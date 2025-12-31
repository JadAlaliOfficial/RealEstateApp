import React from 'react';

interface TableFooterProps {
  filteredCount: number;
  totalCount: number;
}

export const TableFooter: React.FC<TableFooterProps> = ({ filteredCount, totalCount }) => {
  return (
    <div className="mt-6 flex justify-between items-center border-t border-border pt-4">
      <div className="text-sm text-muted-foreground">
        Showing {filteredCount} of {totalCount} offers
      </div>
    </div>
  );
};
