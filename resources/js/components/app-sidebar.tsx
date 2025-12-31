import { NavMainCategorized } from '@/components/nav-main-categorized';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavCategory } from '@/types';
import { Link } from '@inertiajs/react';
import { usePermissions } from '@/hooks/usePermissions';
import {
    LayoutGrid,
    Home,
    Map,
    Building,
    Users,
    Wrench,
    ArrowRightLeft,
    Settings,
    ClipboardList,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavCategories: NavCategory[] = [
    {
        title: 'Overview',
        icon: Home,
        items: [
            {
                title: 'Dashboard',
                href: '/dashboard',
                icon: LayoutGrid,
            },
        ],
    },
    {
        title: 'Property Management',
        icon: Building,
        items: [
            {
                title: 'Cities',
                href: '/cities',
                icon: Map,
                permission: 'cities.index'
            },
            {
                title: 'Properties',
                href: '/all-properties',
                icon: Building,
                permission: 'all-properties.index'
            },
            {
                title: 'Units',
                href: '/units',
                icon: LayoutGrid,
                permission: 'units.index'
            },
        ],
        permissions: ['cities.index','properties.index','units.index']
    },
    {
        title: 'People',
        icon: Users,
        items: [
            {
                title: 'Tenants',
                href: '/tenants',
                icon: Users,
                permission: 'tenants.index'
            },
            {
                title: 'Vendors',
                href: '/vendors',
                icon: Wrench,
                permission: 'vendors.index'
            },
        ],
        permissions: ['tenants.index','vendors.index']
    },
    {
        title: 'Operations',
        icon: Settings,
        items: [
            {
                title: 'Move In',
                href: '/move-in',
                icon: ArrowRightLeft,
                permission: 'move-in.index'
            },
            {
                title: 'Tasks',
                href: '/vendor-task-tracker',
                icon: ClipboardList,
                permission: 'vendor-task-tracker.index'
            },
        ],
        permissions: ['move-in.index','move-out.index','vendor-task-tracker.index']
    },
];

export function AppSidebar() {
    const { hasAnyPermission, hasPermission } = usePermissions();
    const filteredNavCategories = mainNavCategories.filter(category => {
        // If category has permissions array, check if user has ANY of them (OR logic)
        if (category.permissions && category.permissions.length > 0) {
            return hasAnyPermission(category.permissions);
        }
        // If no permissions specified for category, show it
        return true;
    }).map(category => ({
        ...category,
        // Filter items within each category
        items: category.items.filter(item => {
            if (item.permission) {
                return hasPermission(item.permission);
            }
            // If no permission specified for item, show it
            return true;
        })
    })).filter(category =>
        // Remove categories that have no items after filtering
        category.items.length > 0
    );


    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMainCategorized categories={filteredNavCategories} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
