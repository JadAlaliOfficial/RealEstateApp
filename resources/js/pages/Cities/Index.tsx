// Cities/Index.tsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { City } from '@/types/City';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
    Trash2, 
    Plus, 
    X, 
    Search, 
    MapPin, 
    Building2,
    AlertCircle,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';

interface Props {
    cities: City[];
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

// Separate form component for better organization
const CityForm: React.FC<{
    onSubmit: (cityName: string) => void;
    onCancel: () => void;
    isLoading: boolean;
    error?: string;
}> = ({ onSubmit, onCancel, isLoading, error }) => {
    const [cityName, setCityName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (cityName.trim()) {
            onSubmit(cityName.trim());
            setCityName('');
        }
    };

    return (
        <Card className="bg-card text-card-foreground shadow-lg border-primary/10">
            <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        <CardTitle className="text-xl font-semibold">Add New City</CardTitle>
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
                {error && (
                    <Alert  className="mb-4 text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-destructive">{error}</AlertDescription>
                    </Alert>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-medium">
                            City Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="city"
                            type="text"
                            value={cityName}
                            onChange={(e) => setCityName(e.target.value)}
                            placeholder="Enter city name (e.g., New York, London)"
                            className="transition-colors focus:border-primary"
                            disabled={isLoading}
                            autoComplete="off"
                        />
                    </div>
                    <div className="flex gap-2 pt-2">
                        <Button 
                            type="submit" 
                            disabled={isLoading || !cityName.trim()}
                            className="flex-1"
                        >
                            {isLoading ? (
                                <>
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add City
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

// Separate table component for better organization
const CitiesTable: React.FC<{
    cities: City[];
    onDelete: (id: number) => void;
    canDelete: boolean;
    searchTerm: string;
}> = ({ cities, onDelete, canDelete, searchTerm }) => {
    const filteredCities = useMemo(() => {
        if (!searchTerm) return cities;
        return cities.filter(city => 
            city.city.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [cities, searchTerm]);

    const handleDelete = useCallback((id: number, cityName: string) => {
        if (window.confirm(`Are you sure you want to delete "${cityName}"? This action cannot be undone.`)) {
            onDelete(id);
        }
    }, [onDelete]);

    if (filteredCities.length === 0 && searchTerm) {
        return (
            <div className="text-center py-12">
                <Search className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">No cities found</h3>
                <p className="text-muted-foreground">
                    No cities match your search for "{searchTerm}"
                </p>
            </div>
        );
    }

    if (cities.length === 0) {
        return (
            <div className="text-center py-12">
                <MapPin className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">No cities yet</h3>
                <p className="text-muted-foreground">
                    Get started by adding your first city
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
                                    <MapPin className="h-4 w-4" />
                                    City Name
                                </div>
                            </TableHead>
                            {canDelete && (
                                <TableHead className="font-semibold text-foreground w-24">
                                    Actions
                                </TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCities.map((city) => (
                            <TableRow 
                                key={city.id} 
                                className="hover:bg-muted/30 transition-colors group"
                            >
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-primary/60" />
                                        <span className="text-foreground">{city.city}</span>
                                    </div>
                                </TableCell>
                                {canDelete && (
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(city.id, city.city)}
                                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Delete {city.city}</span>
                                        </Button>
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
                        {filteredCities.length}
                    </Badge>
                    <span>
                        {filteredCities.length === 1 ? 'city' : 'cities'}
                        {searchTerm && ` matching "${searchTerm}"`}
                    </span>
                </div>
                {cities.length !== filteredCities.length && (
                    <span className="text-xs">
                        {cities.length} total
                    </span>
                )}
            </div>
        </>
    );
};

const Index: React.FC<Props> = ({ cities }) => {
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { notification, showNotification, hideNotification } = useNotification();
    const {  processing, errors, reset } = useForm({
        city: '',
    });

    const { hasPermission, hasAllPermissions } = usePermissions();

    const canCreate = hasAllPermissions(['cities.store', 'cities.create']);
    const canDelete = hasPermission('cities.destroy');

    const handleSubmit = useCallback((cityName: string) => {
  router.post('/cities', { city: cityName }, {
    onSuccess: () => {
      reset();                // ok to keep if you want to clear the form
      setShowForm(false);
      showNotification('success', `City "${cityName}" has been added successfully!`);
    },
    onError: () => {
      showNotification('error', 'Failed to add city. Please try again.');
    }
  });
}, [reset, showNotification]);

    const handleDelete = useCallback((id: number) => {
        const cityToDelete = cities.find(city => city.id === id);
        const cityName = cityToDelete?.city || 'Unknown';
        
        router.delete(`/cities/${id}`, {
            onSuccess: () => {
                showNotification('success', `City "${cityName}" has been deleted successfully!`);
            },
            onError: () => {
                showNotification('error', 'Failed to delete city. Please try again.');
            }
        });
    }, [cities, showNotification]);

    return (
        <AppLayout>
            <Head title="Cities Management" />

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
                                    <Building2 className="h-8 w-8 text-primary" />
                                    Cities Management
                                </h1>
                                <p className="text-muted-foreground mt-2">
                                    Manage your cities database with ease
                                </p>
                            </div>
                            {canCreate && (
                                <Button
                                    onClick={() => setShowForm(!showForm)}
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
                                            Add City
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Form Section */}
                        {showForm && canCreate && (
                            <div className="lg:col-span-4">
                                <CityForm
                                    onSubmit={handleSubmit}
                                    onCancel={() => setShowForm(false)}
                                    isLoading={processing}
                                    error={errors.city}
                                />
                            </div>
                        )}

                        {/* Table Section */}
                        <div className={`${showForm && canCreate ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
                            <Card className="bg-card text-card-foreground shadow-lg">
                                <CardHeader className="pb-4">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <CardTitle className="text-xl font-semibold">
                                            Cities Directory
                                        </CardTitle>
                                        {cities.length > 0 && (
                                            <div className="relative max-w-sm">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Search cities..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-10 bg-background"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <CitiesTable
                                        cities={cities}
                                        onDelete={handleDelete}
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
