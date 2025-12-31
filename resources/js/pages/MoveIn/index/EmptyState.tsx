interface EmptyStateProps {
    hasActiveFilters: boolean;
}

export default function EmptyState({ hasActiveFilters }: EmptyStateProps) {
    return (
        <div className="py-8 text-center text-muted-foreground">
            <p className="text-lg">No move-in records found.</p>
            <p className="text-sm">
                {hasActiveFilters
                    ? 'Try adjusting your search criteria.'
                    : 'Create your first move-in record to get started.'}
            </p>
        </div>
    );
}
