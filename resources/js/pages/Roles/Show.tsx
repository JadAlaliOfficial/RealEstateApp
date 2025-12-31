import React from 'react';
// import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SittingsLayout from '@/layouts/settings/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Key } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

interface Props {
    role: Role;
}

export default function ShowRole({ role }: Props) {
    const { hasAllPermissions } = usePermissions();

    // Group permissions by resource (e.g., users, roles, tenants, etc.)
    const groupedPermissions = React.useMemo(() => {
        const groups: { [key: string]: Permission[] } = {};

        role.permissions.forEach(permission => {
            const parts = permission.name.split('.');
            const resource = parts[0];

            if (!groups[resource]) {
                groups[resource] = [];
            }
            groups[resource].push(permission);
        });

        return groups;
    }, [role.permissions]);

    // Get display name for actions
    const getActionDisplayName = (action: string) => {
        const actionMap: { [key: string]: string } = {
            'index': 'View List',
            'show': 'View Details',
            'create': 'Create Form',
            'store': 'Create Action',
            'edit': 'Edit Form',
            'update': 'Update Action',
            'destroy': 'Delete'
        };
        return actionMap[action] || action;
    };

    // Get theme-aware badge colors for different action types
    const getActionBadgeProps = (action: string) => {
        const actionMap: { [key: string]: { variant: any; className?: string } } = {
            'index': { variant: 'secondary', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
            'show': { variant: 'default', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
            'create': { variant: 'secondary', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' },
            'store': { variant: 'secondary', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' },
            'edit': { variant: 'secondary', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
            'update': { variant: 'secondary', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
            'destroy': { variant: 'destructive' }
        };
        return actionMap[action] || { variant: 'outline' };
    };

    const isSuperAdmin = role.name === 'Super-Admin';

    // const { url } = usePage();
    // const searching = url.split('?')[1] ?? '';
    // const bcParam = new URLSearchParams(searching).get('bc');


    return (
        <AppLayout >
            <SittingsLayout>
                <Head title={`Role: ${role.name}`} />

                <div className="py-12 bg-background text-foreground transition-colors min-h-screen">
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                        <Card className="bg-card text-card-foreground shadow-lg">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-2xl flex items-center gap-2">
                                        {isSuperAdmin && <Shield className="h-6 w-6 text-destructive" />}
                                        {role.name}
                                    </CardTitle>
                                    <div className="flex gap-2">
                                        {hasAllPermissions(['roles.update','roles.edit']) && (
                                        <Link href={route('roles.edit', role.id)}>
                                            <Button disabled={isSuperAdmin} className={isSuperAdmin ? 'opacity-50 cursor-not-allowed' : ''}>
                                                Edit
                                            </Button>
                                        </Link>)}
                                        <Link href={route('roles.index')}>
                                            <Button variant="outline">Back to List</Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Basic Information */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                                            <Users className="h-5 w-5" />
                                            Basic Information
                                        </h3>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Role Name</p>
                                            <p className="font-medium text-foreground">{role.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Status</p>
                                            <div className="mt-1">
                                                <Badge
                                                    variant={isSuperAdmin ? "destructive" : "default"}
                                                    className={isSuperAdmin
                                                        ? undefined
                                                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                                    }
                                                >
                                                    {isSuperAdmin ? 'Protected' : 'Editable'}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Role ID</p>
                                            <p className="font-medium text-foreground">#{role.id}</p>
                                        </div>
                                    </div>

                                    {/* Permission Summary */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                                            <Key className="h-5 w-5" />
                                            Permission Summary
                                        </h3>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Total Permissions</p>
                                            <div className="mt-1">
                                                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                                    {role.permissions.length} permissions
                                                </Badge>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Resources Covered</p>
                                            <div className="mt-1">
                                                <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                                                    {Object.keys(groupedPermissions).length} resources
                                                </Badge>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Permission Types</p>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {Array.from(new Set(role.permissions.map(p => p.name.split('.')[1]))).map(action => {
                                                    const badgeProps = getActionBadgeProps(action);
                                                    return (
                                                        <Badge key={action} {...badgeProps}>
                                                            {getActionDisplayName(action)}
                                                        </Badge>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Special Note for Super-Admin */}
                                {isSuperAdmin && (
                                    <Card className="mt-8 border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
                                        <CardContent className="p-4">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0">
                                                    <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                                </div>
                                                <div className="ml-3">
                                                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                                        Protected Role
                                                    </h3>
                                                    <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                                                        <p>
                                                            The Super-Admin role is protected and automatically receives all permissions in the system.
                                                            This role cannot be deleted or have its permissions modified.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Detailed Permissions */}
                                <div className="mt-8 pt-6 border-t border-border">
                                    <h4 className="text-lg font-semibold mb-4 text-foreground">Detailed Permissions</h4>

                                    {Object.keys(groupedPermissions).length > 0 ? (
                                        <div className="space-y-6">
                                            {Object.entries(groupedPermissions).map(([resource, resourcePermissions]) => (
                                                <div key={resource} className="space-y-3">
                                                    <h5 className="font-medium text-foreground capitalize border-b border-border pb-2">
                                                        {resource.replace('-', ' ')}
                                                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                                                            ({resourcePermissions.length} permissions)
                                                        </span>
                                                    </h5>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 ml-4">
                                                        {resourcePermissions.map(permission => {
                                                            const action = permission.name.split('.')[1];
                                                            const badgeProps = getActionBadgeProps(action);
                                                            return (
                                                                <Card key={permission.id} className="p-3 bg-muted/50">
                                                                    <div className="flex flex-col space-y-1">
                                                                        <Badge {...badgeProps} className="w-fit">
                                                                            {getActionDisplayName(action)}
                                                                        </Badge>
                                                                        <span className="text-xs text-muted-foreground">
                                                                            {permission.name}
                                                                        </span>
                                                                    </div>
                                                                </Card>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <p className="text-lg">No permissions assigned.</p>
                                            <p className="text-sm mt-2">Edit this role to assign permissions.</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 pt-6 border-t border-border">
                                    <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                                        <div>
                                            <p>Role ID: #{role.id}</p>
                                        </div>
                                        <div>
                                            <p>Total Permissions: {role.permissions.length}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </SittingsLayout>
        </AppLayout>
    );
}
