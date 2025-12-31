// Notices/Index.tsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Notice } from '@/types/Notice';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
// import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
    Trash2, 
    Plus, 
    X, 
    Search, 
    Bell, 
    Calendar,
    AlertCircle,
    CheckCircle,
    XCircle,
    Edit
} from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';

interface Props {
    notices: Notice[];
    search?: string;
}

// Custom Notification Component
interface NotificationProps {
    type: 'success' | 'error' | 'info';
    message: string;
    onClose: () => void;
    duration?: number;
}

const Notification: React.FC<NotificationProps> = ({ 
    type, 
    message, 
    onClose, 
    duration = 4000 
}) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'error':
                return <XCircle className="h-5 w-5 text-red-500" />;
            case 'info':
                return <AlertCircle className="h-5 w-5 text-blue-500" />;
            default:
                return <AlertCircle className="h-5 w-5 text-blue-500" />;
        }
    };

    const getBgColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800';
            case 'error':
                return 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800';
            case 'info':
                return 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800';
            default:
                return 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800';
        }
    };

    return (
        <div className={`fixed top-4 right-4 z-50 min-w-80 max-w-md p-4 rounded-lg border shadow-lg transform transition-all duration-300 ease-in-out ${getBgColor()}`}>
            <div className="flex items-start gap-3">
                {getIcon()}
                <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{message}</p>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

// Custom hook for notifications
const useNotification = () => {
    const [notification, setNotification] = useState<{
        type: 'success' | 'error' | 'info';
        message: string;
    } | null>(null);

    const showNotification = useCallback((type: 'success' | 'error' | 'info', message: string) => {
        setNotification({ type, message });
    }, []);

    const hideNotification = useCallback(() => {
        setNotification(null);
    }, []);

    return {
        notification,
        showNotification,
        hideNotification
    };
};

// Notice Form Component for Create/Edit
const NoticeForm: React.FC<{
    notice?: Notice;
    onSubmit: (data: { notice_name: string; days: number }) => void;
    onCancel: () => void;
    isLoading: boolean;
    errors?: any;
}> = ({ notice, onSubmit, onCancel, isLoading, errors }) => {
    const [noticeName, setNoticeName] = useState(notice?.notice_name || '');
    const [days, setDays] = useState(notice?.days?.toString() || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (noticeName.trim() && days.trim()) {
            onSubmit({
                notice_name: noticeName.trim(),
                days: Number(days)
            });
        }
    };

    const isEdit = !!notice;

    return (
        <Card className="bg-card text-card-foreground shadow-lg border-primary/10">
            <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-primary" />
                        <CardTitle className="text-xl font-semibold">
                            {isEdit ? `Edit Notice - ${notice.notice_name}` : 'Add New Notice'}
                        </CardTitle>
                    </div>
                    <Button 
                        onClick={onCancel} 
                        variant="ghost" 
                        size="sm"
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Notice Name */}
                        <div className="space-y-2">
                            <Label htmlFor="notice_name" className="text-sm font-medium">
                                Notice Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="notice_name"
                                type="text"
                                value={noticeName}
                                onChange={(e) => setNoticeName(e.target.value)}
                                placeholder="Enter notice name"
                                className="transition-colors focus:border-primary"
                                disabled={isLoading}
                                autoComplete="off"
                            />
                            {errors?.notice_name && (
                                <p className="text-red-600 text-sm mt-1">{errors.notice_name}</p>
                            )}
                        </div>

                        {/* Days */}
                        <div className="space-y-2">
                            <Label htmlFor="days" className="text-sm font-medium">
                                Days <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="days"
                                type="number"
                                min="0"
                                value={days}
                                onChange={(e) => setDays(e.target.value)}
                                placeholder="Enter number of days"
                                className="transition-colors focus:border-primary"
                                disabled={isLoading}
                                autoComplete="off"
                            />
                            {errors?.days && (
                                <p className="text-red-600 text-sm mt-1">{errors.days}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button 
                            type="submit" 
                            disabled={isLoading || !noticeName.trim() || !days.trim()}
                            className="flex-1"
                        >
                            {isLoading ? (
                                <>
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                                    {isEdit ? 'Updating...' : 'Creating...'}
                                </>
                            ) : (
                                <>
                                    {isEdit ? (
                                        <>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Update Notice
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Create Notice
                                        </>
                                    )}
                                </>
                            )}
                        </Button>
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={onCancel}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

// Notices Table Component
const NoticesTable: React.FC<{
    notices: Notice[];
    onEdit: (notice: Notice) => void;
    onDelete: (id: number) => void;
    canEdit: boolean;
    canDelete: boolean;
    searchTerm: string;
}> = ({ notices, onEdit, onDelete, canEdit, canDelete, searchTerm }) => {
    const filteredNotices = useMemo(() => {
        if (!searchTerm) return notices;
        return notices.filter(notice => 
            notice.notice_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [notices, searchTerm]);

    const handleDelete = useCallback((notice: Notice) => {
        if (window.confirm(`Are you sure you want to archive "${notice.notice_name}"? This will hide it from the active notices list but it can be restored later.`)) {
            onDelete(notice.id);
        }
    }, [onDelete]);

    const getDaysBadge = (days: number) => {
        if (days <= 3) {
            return <Badge variant="destructive">{days} days</Badge>;
        } else if (days <= 7) {
            return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">{days} days</Badge>;
        } else {
            return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">{days} days</Badge>;
        }
    };

    if (filteredNotices.length === 0 && searchTerm) {
        return (
            <div className="text-center py-12">
                <Search className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">No notices found</h3>
                <p className="text-muted-foreground">
                    No notices match your search for "{searchTerm}"
                </p>
            </div>
        );
    }

    if (notices.length === 0) {
        return (
            <div className="text-center py-12">
                <Bell className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">No notices yet</h3>
                <p className="text-muted-foreground">
                    Get started by adding your first notice
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="overflow-hidden rounded-lg border border-border">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                            <TableHead className="font-semibold text-foreground">
                                <div className="flex items-center gap-2">
                                    <Bell className="h-4 w-4" />
                                    Notice Name
                                </div>
                            </TableHead>
                            <TableHead className="font-semibold text-foreground">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Days
                                </div>
                            </TableHead>
                            {(canEdit || canDelete) && (
                                <TableHead className="font-semibold text-foreground w-32">
                                    Actions
                                </TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredNotices.map((notice) => (
                            <TableRow 
                                key={notice.id} 
                                className="hover:bg-muted/30 transition-colors group"
                            >
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-primary/60" />
                                        <span className="text-foreground">{notice.notice_name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {getDaysBadge(notice.days)}
                                </TableCell>
                                {(canEdit || canDelete) && (
                                    <TableCell>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {canEdit && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onEdit(notice)}
                                                    className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                    <span className="sr-only">Edit {notice.notice_name}</span>
                                                </Button>
                                            )}
                                            {canDelete && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(notice)}
                                                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Archive {notice.notice_name}</span>
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            
            <div className="flex items-center justify-between pt-4 text-sm text-muted-foreground border-t border-border">
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono">
                        {filteredNotices.length}
                    </Badge>
                    <span>
                        {filteredNotices.length === 1 ? 'notice' : 'notices'}
                        {searchTerm && ` matching "${searchTerm}"`}
                    </span>
                </div>
                {notices.length !== filteredNotices.length && (
                    <span className="text-xs">
                        {notices.length} total
                    </span>
                )}
            </div>
        </>
    );
};

const Index: React.FC<Props> = ({ notices, search }) => {
    const [showForm, setShowForm] = useState(false);
    const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
    const [searchTerm, setSearchTerm] = useState(search || '');
    const { notification, showNotification, hideNotification } = useNotification();
    const {  processing, errors } = useForm({
        notice_name: '',
        days: '',
    });

    const { hasPermission, hasAllPermissions } = usePermissions();

    const canCreate = hasAllPermissions(['notices.create', 'notices.store']);
    const canEdit = hasAllPermissions(['notices.edit', 'notices.update']);
    const canDelete = hasPermission('notices.destroy');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('notices.index'), { search: searchTerm }, { preserveState: true });
    };

    const handleCreate = useCallback((formData: { notice_name: string; days: number }) => {
        router.post('/notices', formData, {
            onSuccess: () => {
                setShowForm(false);
                showNotification('success', `Notice "${formData.notice_name}" has been created successfully!`);
            },
            onError: () => {
                showNotification('error', 'Failed to create notice. Please try again.');
            }
        });
    }, [showNotification]);

    const handleUpdate = useCallback((formData: { notice_name: string; days: number }) => {
        if (!editingNotice) return;
        
        router.put(`/notices/${editingNotice.id}`, formData, {
            onSuccess: () => {
                setEditingNotice(null);
                showNotification('success', `Notice "${formData.notice_name}" has been updated successfully!`);
            },
            onError: () => {
                showNotification('error', 'Failed to update notice. Please try again.');
            }
        });
    }, [editingNotice, showNotification]);

    const handleEdit = useCallback((notice: Notice) => {
        setEditingNotice(notice);
        setShowForm(false);
    }, []);

    const handleDelete = useCallback((id: number) => {
        const noticeToDelete = notices.find(notice => notice.id === id);
        const noticeName = noticeToDelete?.notice_name || 'Unknown';
        
        router.delete(`/notices/${id}`, {
            onSuccess: () => {
                showNotification('success', `Notice "${noticeName}" has been archived successfully!`);
            },
            onError: () => {
                showNotification('error', 'Failed to archive notice. Please try again.');
            }
        });
    }, [notices, showNotification]);

    const handleCancel = useCallback(() => {
        setShowForm(false);
        setEditingNotice(null);
    }, []);

    return (
        <AppLayout>
            <Head title="Notices" />

            {/* Custom Notification */}
            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={hideNotification}
                />
            )}

            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                                    <Bell className="h-8 w-8 text-primary" />
                                    Notices Management
                                </h1>
                                <p className="text-muted-foreground mt-2">
                                    Manage your notices with different day periods
                                </p>
                            </div>
                            {canCreate && (
                                <Button
                                    onClick={() => {
                                        setShowForm(!showForm);
                                        setEditingNotice(null);
                                    }}
                                    variant={showForm ? "outline" : "default"}
                                    size="lg"
                                    className="shadow-lg"
                                >
                                    {showForm ? (
                                        <>
                                            <X className="h-4 w-4 mr-2" />
                                            Cancel
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Notice
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Form Section */}
                        {(showForm || editingNotice) && canCreate && (
                            <div className="lg:col-span-4">
                                <NoticeForm
                                    notice={editingNotice || undefined}
                                    onSubmit={editingNotice ? handleUpdate : handleCreate}
                                    onCancel={handleCancel}
                                    isLoading={processing}
                                    errors={errors}
                                />
                            </div>
                        )}

                        {/* Table Section */}
                        <div className={`${(showForm || editingNotice) && canCreate ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
                            <Card className="bg-card text-card-foreground shadow-lg">
                                <CardHeader className="pb-4">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <CardTitle className="text-xl font-semibold">
                                            Notices Directory
                                        </CardTitle>
                                        {notices.length > 0 && (
                                            <form onSubmit={handleSearch} className="flex gap-2">
                                                <div className="relative max-w-sm">
                                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        placeholder="Search notices..."
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="pl-10 bg-background"
                                                    />
                                                </div>
                                                <Button type="submit">
                                                    <Search className="h-4 w-4" />
                                                </Button>
                                            </form>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <NoticesTable
                                        notices={notices}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        canEdit={canEdit}
                                        canDelete={canDelete}
                                        searchTerm={searchTerm}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Index;
