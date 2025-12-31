import React from 'react';
import { type BreadcrumbItem } from '@/types';import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/app-layout';
import SittingsLayout from '@/Layouts/settings/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePermissions } from '@/hooks/usePermissions';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Edit, Trash2, Plus } from 'lucide-react';
import { User } from '@/types';

interface Role {
    id: number;
    name: string;
}

interface Permission {
    id: number;
    name: string;
}

interface UserWithRolesPermissions extends User {
    roles: Role[];
    permissions: Permission[];
}

interface Props {
    users: UserWithRolesPermissions[];
}

export default function Index({ users }: Props) {
    const { hasPermission, hasAnyPermission, hasAllPermissions} = usePermissions();
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            destroy(route('users.destroy', id));
        }
    };

    // Function to get different badge colors for roles
    const getRoleBadgeColor = (roleId: number) => {
        const colors = [
            'bg-primary text-primary-foreground',
            'bg-secondary text-secondary-foreground',
            'bg-chart-1 text-primary-foreground',
            'bg-chart-2 text-secondary-foreground',
            'bg-chart-3 text-foreground',
            'bg-chart-4 text-secondary-foreground',
            'bg-chart-5 text-primary-foreground',
            'bg-accent text-accent-foreground',
        ];

        return colors[roleId % colors.length];
    };


    return (
        <AppLayout >
            <SittingsLayout>
            <Head title="Users" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-2xl">Users</CardTitle>
                                {hasAllPermissions(['users.create','users.store'])&&(
                                <Link href={route('users.create')}>
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create User
                                    </Button>
                                </Link>)}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Roles</TableHead>
                                            <TableHead>Permissions</TableHead>
                                            {hasAnyPermission(['users.edit','users.update','users.destroy'])&&(
                                            <TableHead>Actions</TableHead>)}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map((user) => (
                                            <TableRow key={user.id} className="hover:bg-muted/50">
                                                <TableCell className="font-medium">{user.id}</TableCell>
                                                <TableCell>{user.name}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {user.roles && user.roles.length > 0 ? (
                                                            user.roles.map(role => (
                                                                <span key={role.id} className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(role.id)}`}>
                                                                    {role.name}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-muted-foreground text-sm">No roles</span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {user.permissions && user.permissions.length > 0 ? (
                                                            <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-chart-1 text-primary-foreground">
                                                                {user.permissions.length} direct permissions
                                                            </span>
                                                        ) : (
                                                            <span className="text-muted-foreground text-sm">No direct permissions</span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                {hasAnyPermission(['users.edit','users.update','users.destroy'])&&(
                                                    <TableCell>
                                                    <div className="flex gap-2">
                                                        {hasAllPermissions('users.edit','users.update')&&(
                                                        <Link href={route('users.edit', user.id)}>
                                                            <Button variant="outline" size="sm">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        )}
                                                        {hasPermission('users.destroy')&&(
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDelete(user.id)}
                                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                        )}
                                                    </div>
                                                </TableCell>)}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                {users.length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <p className="text-lg">No users found.</p>
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
