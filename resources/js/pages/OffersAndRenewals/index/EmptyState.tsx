import React from 'react';

export const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <p className="text-lg">No offers found.</p>
      <p className="text-sm">Try adjusting your search criteria.</p>
    </div>
  );
};
