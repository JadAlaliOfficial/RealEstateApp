// resources/js/hooks/usePermissions.ts
import { usePage } from '@inertiajs/react';
import type { PageProps, User } from '@/types/auth';

interface UsePermissionsReturn {
    hasPermission: (permission: string) => boolean;
    hasAnyPermission: (permissions: string | string[]) => boolean;
    hasAllPermissions: (permissions: string | string[]) => boolean;
    hasRole: (role: string) => boolean;
    hasAnyRole: (roles: string | string[]) => boolean;
    hasAllRoles: (roles: string | string[]) => boolean;
    user: User | null;
    permissions: string[];
    roles: string[];
    isAuthenticated: boolean;
}

export function usePermissions(): UsePermissionsReturn {
    const { auth } = usePage<PageProps>().props;

    const hasPermission = (permission: string): boolean => {
        if (!auth.user || !auth.user.permissions) {
            return false;
        }

        return auth.user.permissions.includes(permission);
    };

    const hasAnyPermission = (permissions: string | string[]): boolean => {
        if (typeof permissions === 'string') {
            return hasPermission(permissions);
        }

        return permissions.some(permission => hasPermission(permission));
    };

    const hasAllPermissions = (permissions: string | string[]): boolean => {
        if (typeof permissions === 'string') {
            return hasPermission(permissions);
        }

        return permissions.every(permission => hasPermission(permission));
    };

    const hasRole = (role: string): boolean => {
        if (!auth.user || !auth.user.roles) {
            return false;
        }

        return auth.user.roles.includes(role);
    };

    const hasAnyRole = (roles: string | string[]): boolean => {
        if (typeof roles === 'string') {
            return hasRole(roles);
        }

        return roles.some(role => hasRole(role));
    };

    const hasAllRoles = (roles: string | string[]): boolean => {
        if (typeof roles === 'string') {
            return hasRole(roles);
        }

        return roles.every(role => hasRole(role));
    };

    return {
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        hasAnyRole,
        hasAllRoles,
        user: auth.user,
        permissions: auth.user?.permissions || [],
        roles: auth.user?.roles || [],
        isAuthenticated: !!auth.user
    };
}
