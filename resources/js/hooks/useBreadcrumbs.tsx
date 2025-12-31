// resources/js/hooks/useBreadcrumbs.ts
import { usePage } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

export const useBreadcrumbs = (): BreadcrumbItem[] => {
    const { url } = usePage();

    const routeMap: Record<string, string> = {
        '/dashboard': 'Dashboard',
        '/tasks': 'Tasks',
        '/tasks/create': 'Create Task',
        '/projects': 'Projects',
        '/projects/create': 'Create Project',
        '/users': 'Users',
        '/users/create': 'Create User',
        // Add more routes as needed
    };

    // Handle root/dashboard case
    if (url === '/' || url === '/dashboard') {
        return [{ title: 'Dashboard' }];
    }

    const pathSegments = url.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Always start with dashboard (except if we're already on dashboard)
    breadcrumbs.push({
        title: 'Dashboard',
        href: '/dashboard'
    });

    // Build path progressively
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`;

        const title = routeMap[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1);

        // Don't add href to the last item (current page)
        const isLast = index === pathSegments.length - 1;

        breadcrumbs.push({
            title,
            href: isLast ? undefined : currentPath
        });
    });

    return breadcrumbs;
};
