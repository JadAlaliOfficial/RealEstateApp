import React from 'react';
// import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SittingsLayout from '@/layouts/settings/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
}

interface Props {
    role: Role;
    permissions: Permission[];
    rolePermissions: string[];
}

export default function EditRole({ role, permissions, rolePermissions }: Props) {
    const {  hasAnyPermission } = usePermissions();

    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        permissions: rolePermissions
    });

    // Group permissions by resource (e.g., users, roles, tenants, etc.)
    const groupedPermissions = React.useMemo(() => {
        const groups: { [key: string]: Permission[] } = {};
        permissions.forEach(permission => {
            const parts = permission.name.split('.');
            const resource = parts[0];
            if (!groups[resource]) {
                groups[resource] = [];
            }
            groups[resource].push(permission);
        });
        return groups;
    }, [permissions]);

    // Smart permission handler - handles create/store and edit/update pairing
    const handleSmartPermissionChange = (resourceName: string, action: string, checked: boolean) => {
        const permissionsToToggle = [`${resourceName}.${action}`];
        // Smart pairing logic
        if (action === 'create') {
            permissionsToToggle.push(`${resourceName}.store`);
        } else if (action === 'store') {
            permissionsToToggle.push(`${resourceName}.create`);
        } else if (action === 'edit') {
            permissionsToToggle.push(`${resourceName}.update`);
        } else if (action === 'update') {
            permissionsToToggle.push(`${resourceName}.edit`);
        }

        if (checked) {
            // Add permissions
            const newPermissions = [...data.permissions];
            permissionsToToggle.forEach(perm => {
                if (!newPermissions.includes(perm)) {
                    newPermissions.push(perm);
                }
            });
            setData('permissions', newPermissions);
        } else {
            // Remove permissions
            const newPermissions = data.permissions.filter(p => !permissionsToToggle.includes(p));
            setData('permissions', newPermissions);
        }
    };

    // Check if permission is selected (considering smart pairing)
    const isPermissionSelected = (permissionName: string) => {
        return data.permissions.includes(permissionName);
    };

    // Get display name for actions
    const getActionDisplayName = (action: string) => {
        const actionMap: { [key: string]: string } = {
            'index': 'View List',
            'show': 'View Details',
            'create': 'Create',
            'store': 'Create', // Hidden - paired with create
            'edit': 'Edit',
            'update': 'Edit', // Hidden - paired with edit
            'destroy': 'Delete'
        };
        return actionMap[action] || action;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('roles.update', role.id));
    };

    const isSuperAdmin = role.name === 'Super-Admin';
// const { url } = usePage();
    // const searching = url.split('?')[1] ?? '';
    // const bcParam = new URLSearchPar/ams(searching).get('bc');


    return (
        <AppLayout >
            <SittingsLayout>
                <Head title={`Edit Role - ${role.name}`} />
                <div className="py-12 bg-background text-foreground transition-colors min-h-screen">
                    <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                        <Card className="bg-card text-card-foreground shadow-lg">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-2xl">
                                        Edit Role - {role.name}
                                    </CardTitle>
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex justify-between items-center gap-2">
                                            <Link href={route('roles.index')}>
                                                <Button variant="outline">Back to List</Button>
                                            </Link>
                                            {hasAnyPermission('users.index') && (
                                            <Link href={route('users.index')}>
                                                <Button variant="outline">View Users</Button>
                                            </Link>)}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* Super Admin Warning */}
                                {isSuperAdmin && (
                                    <Alert className="mb-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
                                        <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                                        <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                                            <strong>Protected Role:</strong> The Super-Admin role is protected and cannot be modified. It automatically has all permissions.
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* --- Basic Information --- */}
                                    <div className="grid gap-4">
                                        {/* Role Name */}
                                        <div>
                                            <Label htmlFor="name">Role Name *</Label>
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="Enter role name"
                                                className={errors.name ? "bg-input text-input-foreground border-destructive" : "bg-input text-input-foreground"}
                                                required
                                                disabled={isSuperAdmin}
                                            />
                                            {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name}</p>}
                                        </div>
                                    </div>

                                    {/* --- Permission Statistics --- */}
                                    <Card className="bg-muted/50">
                                        <CardContent className="p-4">
                                            <h4 className="text-sm font-medium text-foreground mb-3">Permission Overview:</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-foreground">Current Permissions:</span>
                                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                                        {data.permissions.length} selected
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-foreground">Total Available:</span>
                                                    <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                                        {permissions.length} permissions
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* --- Permission Assignment --- */}
                                    <div className="space-y-4">
                                        <Label>Select Permissions by Resource</Label>
                                        <div className="max-h-96 overflow-y-auto border border-border p-4 rounded bg-muted/30 space-y-6">
                                            {Object.entries(groupedPermissions).map(([resource, resourcePermissions]) => (
                                                <div key={resource} className="space-y-3">
                                                    <h4 className="font-semibold text-foreground capitalize border-b border-border pb-2 flex items-center justify-between">
                                                        <span>{resource.replace('-', ' ')}</span>
                                                        <Badge variant="outline" className="text-xs">
                                                            {resourcePermissions.filter(p => data.permissions.includes(p.name)).length}/{resourcePermissions.length} selected
                                                        </Badge>
                                                    </h4>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 ml-4">
                                                        {resourcePermissions.map(permission => {
                                                            const action = permission.name.split('.')[1];
                                                            // Skip store and update as they're paired with create and edit
                                                            if (action === 'store' || action === 'update') return null;
                                                            return (
                                                                <div key={permission.id} className="flex items-center space-x-2">
                                                                    <Checkbox
                                                                        id={`permission-${permission.id}`}
                                                                        checked={isPermissionSelected(permission.name)}
                                                                        onCheckedChange={(checked) =>
                                                                            handleSmartPermissionChange(resource, action, checked as boolean)
                                                                        }
                                                                        disabled={isSuperAdmin}
                                                                    />
                                                                    <label
                                                                        htmlFor={`permission-${permission.id}`}
                                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
                                                                    >
                                                                        {getActionDisplayName(action)}
                                                                    </label>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {errors.permissions && <p className="mt-1 text-sm text-destructive">{errors.permissions}</p>}
                                    </div>

                                    {/* Information note */}
                                    <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
                                        <CardContent className="p-4">
                                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                                <strong>Smart Permissions:</strong> When you select "Create" or "Edit", both form access and action permissions are automatically included (e.g., selecting "Create" adds both "create" and "store" permissions).
                                            </p>
                                        </CardContent>
                                    </Card>

                                    {/* Current role information display */}
                                    <Card className="bg-muted/50">
                                        <CardContent className="p-4">
                                            <h4 className="text-sm font-medium text-foreground mb-3">Current Role Information:</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-foreground">Role ID:</span>
                                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                                        {role.id}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-foreground">Role Type:</span>
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
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-foreground">Original Permissions:</span>
                                                    <Badge variant="outline">
                                                        {rolePermissions.length} permissions
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-foreground">Status:</span>
                                                    <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                                        Active
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* --- Action Buttons --- */}
                                    <div className="flex justify-end gap-2">
                                        <Link href={route('roles.index')}>
                                            <Button type="button" variant="outline">
                                                Cancel
                                            </Button>
                                        </Link>
                                        <Button
                                            type="submit"
                                            disabled={processing || isSuperAdmin}
                                            className={isSuperAdmin ? 'opacity-50 cursor-not-allowed' : ''}
                                        >
                                            {processing ? 'Updating...' : 'Update Role'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </SittingsLayout>
        </AppLayout>
    );
}
