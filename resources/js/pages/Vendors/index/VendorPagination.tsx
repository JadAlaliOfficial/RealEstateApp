import { Link } from '@inertiajs/react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface VendorPaginationProps {
    links: PaginationLink[];
}

export default function VendorPagination({ links }: VendorPaginationProps) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="mt-6 flex justify-center">
            <div className="flex gap-2">
                {links.map((link, index) => (
                    <Link
                        key={index}
                        href={link.url || '#'}
                        className={`rounded px-3 py-2 text-sm ${
                            link.active ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </div>
    );
}
