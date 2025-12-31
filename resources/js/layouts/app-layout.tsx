// resources/js/layouts/app-layout.tsx
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[]; // Keep as optional for manual override
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    // Use automatic breadcrumbs if no manual breadcrumbs provided
    const autoBreadcrumbs = useBreadcrumbs();
    const finalBreadcrumbs = breadcrumbs || autoBreadcrumbs;

    return (
        <AppLayoutTemplate breadcrumbs={finalBreadcrumbs} {...props}>
            {children}
        </AppLayoutTemplate>
    );
};
