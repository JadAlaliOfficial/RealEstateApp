import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/app-layout';
import SittingsLayout from '@/Layouts/settings/layout';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { usePermissions } from '@/hooks/usePermissions';
import { type BreadcrumbItem } from '@/types';
interface Role {
    id: number;
    name: string;
}

interface Permission {
    id: number;
    name: string;
}

interface Props {
    user: User & {
        roles: Role[];
        permissions: Permission[];
    };
    roles: Role[];
    permissions: Permission[];
    userRoles: string[];
    userPermissions: string[];
}

export default function Edit({ user, roles, permissions, userRoles, userPermissions }: Props) {
    const { hasPermission, hasAnyPermission, hasAllPermissions} = usePermissions();
    const [assignmentType, setAssignmentType] = useState('role');

    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        role: userRoles[0] || '',
        permissions: userPermissions || [],
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

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('users.update', user.id));
    };

    return (
        <AppLayout >
            <SittingsLayout>
            <Head title={`Edit User - ${user.name}`} />
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-2xl">
                                    Edit User - {user.name}
                                </CardTitle>
                                <div className="flex justify-between items-center gap-2">
                                    <div className="flex justify-between items-center gap-2">
                                        <Link href={route('users.index')}>
                                            <Button variant="outline">Back to List</Button>
                                        </Link>
                                        {hasPermission('roles.index')&&(
                                        <Link href={route('roles.index')}
                                        >
                                            <Button variant="outline">View Roles</Button>
                                        </Link>)}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* Note about password field */}
                            <div className="mb-6 p-4 bg-secondary border border-border rounded-lg">
                                <p className="text-sm text-secondary-foreground">
                                    <strong>Note:</strong> Leave password fields blank to keep the current password unchanged.
                                </p>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                {/* --- Basic Information --- */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="name">Name *</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            error={errors.name}
                                            required
                                        />
                                        {errors.name && (
                                            <p className="text-destructive text-sm mt-1">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="email">Email *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            error={errors.email}
                                            required
                                        />
                                        {errors.email && (
                                            <p className="text-destructive text-sm mt-1">{errors.email}</p>
                                        )}
                                    </div>
                                </div>

                                {/* --- Password Information --- */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="password">New Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Leave blank to keep current password"
                                            error={errors.password}
                                        />
                                        {errors.password && (
                                            <p className="text-destructive text-sm mt-1">{errors.password}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="password_confirmation">Confirm New Password</Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            placeholder="Confirm new password"
                                            error={errors.password_confirmation}
                                        />
                                        {errors.password_confirmation && (
                                            <p className="text-destructive text-sm mt-1">{errors.password_confirmation}</p>
                                        )}
                                    </div>
                                </div>

                                {/* --- Role/Permission Assignment --- */}
                                <div className="space-y-4">
                                    <Label>Assignment Type</Label>
                                    <Select value={assignmentType} onValueChange={setAssignmentType}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose assignment type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="role">Assign Role</SelectItem>
                                            <SelectItem value="permissions">Assign Individual Permissions</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {assignmentType === 'role' && (
                                        <div>
                                            <Label htmlFor="role">Select Role</Label>
                                            <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choose a role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {roles.map(role => (
                                                        <SelectItem key={role.id} value={role.name}>
                                                            {role.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.role && <p className="mt-1 text-sm text-destructive">{errors.role}</p>}
                                        </div>
                                    )}

                                    {assignmentType === 'permissions' && (
                                        <div>
                                            <Label>Select Permissions by Resource</Label>
                                            <div className="border border-border bg-card p-4 rounded space-y-6">
                                                {Object.entries(groupedPermissions).map(([resource, resourcePermissions]) => (
                                                    <div key={resource} className="space-y-3">
                                                        <h4 className="font-semibold text-card-foreground capitalize border-b border-border pb-2">
                                                            {resource.replace('-', ' ')}
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
                                                                        />
                                                                        <label
                                                                            htmlFor={`permission-${permission.id}`}
                                                                            className="text-sm font-medium leading-none text-card-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                                    )}

                                    {/* Current Assignments Display */}
                                    <div className="p-4 bg-muted border border-border rounded-lg">
                                        <h4 className="text-sm font-medium text-muted-foreground mb-3">Current Assignments:</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="font-medium text-foreground">Current Roles:</span>
                                                <div className="mt-1">
                                                    {userRoles.length > 0 ? (
                                                        userRoles.map(role => (
                                                            <span key={role} className="inline-block ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-primary text-primary-foreground mr-1">
                                                                {role}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="ml-2 text-muted-foreground">No roles assigned</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="font-medium text-foreground">Direct Permissions:</span>
                                                <div className="mt-1">
                                                    {userPermissions.length > 0 ? (
                                                        <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-chart-1 text-primary-foreground">
                                                            {userPermissions.length} permissions
                                                        </span>
                                                    ) : (
                                                        <span className="ml-2 text-muted-foreground">No direct permissions</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Information note */}
                                <div className="p-4 bg-secondary border border-border rounded-lg">
                                    <p className="text-sm text-secondary-foreground">
                                        <strong>Note:</strong> When selecting "Create" or "Edit" permissions, both the form and action permissions are automatically included.
                                    </p>
                                </div>

                                {/* Current user information display */}
                                <div className="p-4 bg-muted border border-border rounded-lg">
                                    <h4 className="text-sm font-medium text-muted-foreground mb-3">Current User Information:</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium text-foreground">User ID:</span>
                                            <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
                                                {user.id}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-foreground">Email Verified:</span>
                                            <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                                                user.email_verified_at ? 'bg-chart-1 text-primary-foreground' : 'bg-destructive text-destructive-foreground'
                                            }`}>
                                                {user.email_verified_at ? 'Yes' : 'No'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-foreground">Created:</span>
                                            <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-muted-foreground text-background">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-foreground">Last Updated:</span>
                                            <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-muted-foreground text-background">
                                                {new Date(user.updated_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* --- Action Buttons --- */}
                                <div className="flex justify-end gap-2">
                                    <Link href={route('users.index')}>
                                        <Button type="button" variant="outline">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Updating…' : 'Update User'}
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
