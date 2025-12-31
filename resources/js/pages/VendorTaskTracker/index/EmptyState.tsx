export default function EmptyState() {
    return (
        <div className="py-8 text-center text-muted-foreground">
            <p className="text-lg">No tasks found matching your criteria.</p>
            <p className="text-sm">Try adjusting your search filters or clearing them to see all tasks.</p>
        </div>
    );
}
