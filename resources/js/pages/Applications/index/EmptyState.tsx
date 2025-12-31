// resources/js/Pages/Applications/components/EmptyState.tsx
export default function EmptyState() {
    return (
        <div className="py-8 text-center text-muted-foreground">
            <p className="text-lg">No applications found.</p>
            <p className="text-sm">Try adjusting your search criteria.</p>
        </div>
    );
}
