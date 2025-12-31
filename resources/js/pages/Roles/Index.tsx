// import React from 'react';
// import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SittingsLayout from '@/layouts/settings/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, Eye, Shield } from 'lucide-react';
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
    roles: Role[];
}

export default function RolesIndex({ roles }: Props) {
    const { delete: destroy } = useForm();
    const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

    const handleDelete = (roleId: number, roleName: string) => {
        if (confirm(`Are you sure you want to delete the role "${roleName}"?`)) {
            destroy(route('roles.destroy', roleId));
        }
    };

    const getPermissionsBadge = (permissionsCount: number) => {
        return (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                {permissionsCount} permissions
            </Badge>
        );
    };

    const getProtectionBadge = (roleName: string) => {
        const isProtected = roleName === 'Super-Admin';
        return (
            <Badge
                variant={isProtected ? "destructive" : "default"}
                className={isProtected
                    ? undefined
                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                }
            >
                {isProtected ? 'Protected' : 'Editable'}
            </Badge>
        );
    };

    // const { url } = usePage();
    // const searching = url.split('?')[1] ?? '';
    // const bcParam = new URLSearchParams(searching).get('bc');



    return (
        <AppLayout >
            <SittingsLayout>
                <Head title="Roles" />
                <div className="py-12 bg-background text-foreground transition-colors min-h-screen">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <Card className="bg-card text-card-foreground shadow-lg">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-2xl">Roles</CardTitle>
                                    <div className="flex items-center gap-2">
                                        {hasPermission('users.index') && (
                                        <Link href={route('users.index')}>
                                            <Button variant="outline">
                                                View Users
                                            </Button>
                                        </Link>)}
                                        {hasAllPermissions(['roles.store','roles.create']) && (
                                        <Link href={route('roles.create')}
                                        >
                                            <Button>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Create Role
                                            </Button>
                                        </Link>)}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-border">
                                                <TableHead className="text-muted-foreground">ID</TableHead>
                                                <TableHead className="text-muted-foreground">Role Name</TableHead>
                                                <TableHead className="text-muted-foreground">Permissions</TableHead>
                                                <TableHead className="text-muted-foreground">Protected</TableHead>
                                                {hasAnyPermission(['roles.show','roles.destroy','roles.update','roles.edit']) && (
                                                <TableHead className="text-muted-foreground">Actions</TableHead>)}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {roles.map((role) => (
                                                <TableRow key={role.id} className="hover:bg-muted/50 border-border">
                                                    <TableCell className="font-medium text-foreground">{role.id}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            {role.name === 'Super-Admin' && (
                                                                <Shield className="h-4 w-4 text-destructive" />
                                                            )}
                                                            <span className="font-medium text-foreground">{role.name}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {getPermissionsBadge(role.permissions.length)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {getProtectionBadge(role.name)}
                                                    </TableCell>
                                                    {hasAnyPermission(['roles.show','roles.destroy','roles.update','roles.edit']) && (
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            {hasPermission('roles.show') && (
                                                            <Link href={route('roles.show', role.id)} >
                                                                <Button variant="outline" size="sm" title="View Role">
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </Link>)}
                                                            {hasAllPermissions(['roles.update','roles.edit']) && (
                                                            <Link href={route('roles.edit', role.id)} >
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    title="Edit Role"
                                                                    disabled={role.name === 'Super-Admin'}
                                                                    className={role.name === 'Super-Admin' ? 'opacity-50 cursor-not-allowed' : ''}
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                            </Link>)}

                                                            {hasPermission('roles.destroy') && role.name !== 'Super-Admin' && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleDelete(role.id, role.name)}
                                                                className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                                                                title="Delete Role"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>)}
                                                        </div>
                                                    </TableCell>)}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    {roles.length === 0 && (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <p className="text-lg">No roles found.</p>
                                            <p className="text-sm mt-2">Create your first role to get started.</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </SittingsLayout>
        </AppLayout>
    );
}
