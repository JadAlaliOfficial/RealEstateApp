import React from 'react';
// import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { MoveOut } from '@/types/move-out';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
// import { usePermissions } from '@/hooks/usePermissions';
import { Calendar, MapPin, User, Home, Clock, Key, Wrench, FileText, AlertTriangle } from 'lucide-react';

interface Props {
    moveOut: MoveOut;
    filters?: { city?: string | null; property?: string | null; unit?: string | null };
    prevId?: number | null;
    nextId?: number | null;
    perPage?: string;
}

export default function Show({ moveOut, filters, prevId, nextId, perPage }: Props) {
    // const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

    const getYesNoBadge = (value: 'Yes' | 'No' | null) => {
        if (value === null) return <Badge variant="outline" className="text-xs">N/A</Badge>;
        return (
            <Badge 
                variant={value === 'Yes' ? 'default' : 'secondary'} 
                className={`text-xs ${value === 'Yes' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}
            >
                {value}
            </Badge>
        );
    };

    const getCleaningBadge = (value: 'cleaned' | 'uncleaned' | null) => {
        if (value === null) return <Badge variant="outline" className="text-xs">N/A</Badge>;
        return (
            <Badge 
                variant={value === 'cleaned' ? 'default' : 'secondary'}
                className={`text-xs capitalize ${value === 'cleaned' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-orange-100 text-orange-800 border-orange-200'}`}
            >
                {value}
            </Badge>
        );
    };

    const getFormBadge = (value: 'filled' | 'not filled' | null) => {
        if (value === null) return <Badge variant="outline" className="text-xs">N/A</Badge>;
        return (
            <Badge 
                variant={value === 'filled' ? 'default' : 'secondary'}
                className={`text-xs capitalize ${value === 'filled' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}
            >
                {value}
            </Badge>
        );
    };

    const formatDate = (date: string | null) => {
        if (!date) return 'Not Set';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const InfoItem = ({ icon: Icon, label, value, className = "" }: {
        icon: any;
        label: string;
        value: React.ReactNode;
        className?: string;
    }) => (
        <div className={`flex items-start gap-3 p-3 rounded-lg bg-gray-50/50 ${className}`}>
            <Icon className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
            <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
                <div className="text-sm font-semibold text-gray-900 mt-1">{value}</div>
            </div>
        </div>
    );

    const isPrevDisabled = !prevId || prevId === moveOut.id;
    const isNextDisabled = !nextId || nextId === moveOut.id;

    return (
        <AppLayout>
            <Head title={`Move-Out Details #${moveOut.id}`} />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Move-Out Record #{moveOut.id}</h1>
                                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                    <MapPin className="h-4 w-4" />
                                    <span>{moveOut.city_name || 'N/A'} • {moveOut.property_name || 'N/A'}</span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                {/* {hasAllPermissions(['move-out.edit','move-out.update']) && (
                                    <Link href={route('move-out.edit', moveOut.id)}>
                                        <Button className="bg-blue-600 hover:bg-blue-700">
                                            Edit Record
                                        </Button>
                                    </Link>
                                )} */}
                                <Link href={route('move-out.index')} data={{
                                    city: filters?.city ?? undefined,
                                    property: filters?.property ?? undefined,
                                    unit: filters?.unit ?? undefined,
                                    perPage: perPage ?? undefined,
                                }}>
                                    <Button variant="outline">Back to List</Button>
                                </Link>
                                <div className="flex gap-2">
                                    {isPrevDisabled ? (
                                        <Button variant="outline" disabled>Previous</Button>
                                    ) : (
                                        <Link
                                            href={route('move-out.show', prevId!)}
                                            data={{
                                                city: filters?.city ?? undefined,
                                                property: filters?.property ?? undefined,
                                                unit: filters?.unit ?? undefined,
                                                perPage: perPage ?? undefined,
                                            }}
                                            preserveScroll
                                        >
                                            <Button variant="outline">Previous</Button>
                                        </Link>
                                    )}
                                    {isNextDisabled ? (
                                        <Button variant="outline" disabled>Next</Button>
                                    ) : (
                                        <Link
                                            href={route('move-out.show', nextId!)}
                                            data={{
                                                city: filters?.city ?? undefined,
                                                property: filters?.property ?? undefined,
                                                unit: filters?.unit ?? undefined,
                                                perPage: perPage ?? undefined,
                                            }}
                                            preserveScroll
                                        >
                                            <Button variant="outline">Next</Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Property Hierarchy Card */}
                    <Card className="mb-6 border-l-4 border-l-blue-500">
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <InfoItem
                                    icon={MapPin}
                                    label="City"
                                    value={moveOut.city_name || 'N/A'}
                                    className="bg-blue-50/50"
                                />
                                <InfoItem
                                    icon={Home}
                                    label="Property"
                                    value={moveOut.property_name || 'N/A'}
                                    className="bg-green-50/50"
                                />
                                <InfoItem
                                    icon={Home}
                                    label="Unit"
                                    value={moveOut.unit_name || 'N/A'}
                                    className="bg-purple-50/50"
                                />
                                <InfoItem
                                    icon={User}
                                    label="Tenants"
                                    value={moveOut.tenants || 'N/A'}
                                    className="bg-orange-50/50"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Important Dates Section */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Calendar className="h-5 w-5" />
                                Important Dates
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertTriangle className="h-4 w-4 text-red-600" />
                                        <p className="text-sm font-medium text-red-800">Move-Out Date</p>
                                    </div>
                                    <p className="text-lg font-bold text-red-900">
                                        {formatDate(moveOut.move_out_date)}
                                    </p>
                                </div>
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileText className="h-4 w-4 text-blue-600" />
                                        <p className="text-sm font-medium text-blue-800">Lease Ending (Buildium)</p>
                                    </div>
                                    <p className="text-lg font-bold text-blue-900">
                                        {formatDate(moveOut.date_lease_ending_on_buildium)}
                                    </p>
                                </div>
                                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className="h-4 w-4 text-green-600" />
                                        <p className="text-sm font-medium text-green-800">Utility Transfer Date</p>
                                    </div>
                                    <p className="text-lg font-bold text-green-900">
                                        {formatDate(moveOut.date_utility_put_under_our_name)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Information Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Property & Lease Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Home className="h-5 w-5" />
                                    Property & Lease Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <InfoItem
                                        icon={FileText}
                                        label="Lease Status"
                                        value={moveOut.lease_status || 'N/A'}
                                    />
                                    <InfoItem
                                        icon={Key}
                                        label="Keys Location"
                                        value={moveOut.keys_location || 'N/A'}
                                    />
                                    <InfoItem
                                        icon={FileText}
                                        label="List the Unit"
                                        value={moveOut.list_the_unit || 'N/A'}
                                    />
                                    <InfoItem
                                        icon={User}
                                        label="Renter"
                                        value={getYesNoBadge(moveOut.renter as 'Yes' | 'No' | null)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Status & Utilities */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Wrench className="h-5 w-5" />
                                    Status & Utilities
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <InfoItem
                                        icon={Clock}
                                        label="Utilities Under Our Name"
                                        value={getYesNoBadge(moveOut.utilities_under_our_name)}
                                    />
                                    <InfoItem
                                        icon={FileText}
                                        label="Utility Type"
                                        value={moveOut.utility_type || 'N/A'}
                                    />
                                    <InfoItem
                                        icon={Wrench}
                                        label="Cleaning Status"
                                        value={getCleaningBadge(moveOut.cleaning)}
                                    />
                                    <InfoItem
                                        icon={FileText}
                                        label="Move-Out Form"
                                        value={getFormBadge(moveOut.move_out_form)}
                                    />
                                    <InfoItem
                                        icon={FileText}
                                        label="All The Devices Are Off"
                                        value={getYesNoBadge(moveOut.all_the_devices_are_off as 'Yes' | 'No' | null)}
                                    />
                                    <InfoItem
                                        icon={FileText}
                                        label="Security Deposit Return"
                                        value={moveOut.send_back_security_deposit || 'N/A'}
                                    />
                                    <InfoItem
                                        icon={User}
                                        label="Walkthrough"
                                        value={getYesNoBadge(moveOut.walkthrough as 'Yes' | 'No' | null)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Detailed Information Section */}
                    <div className="space-y-6">
                        {/* Utility Type Section */}
                        {moveOut.utility_type && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Wrench className="h-5 w-5" />
                                        Utility Type Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                            {moveOut.utility_type}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Repairs Section */}
                        {moveOut.repairs && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Wrench className="h-5 w-5" />
                                        Repairs Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                            {moveOut.repairs}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Notes Section */}
                        {moveOut.notes && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <FileText className="h-5 w-5" />
                                        Additional Notes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                            {moveOut.notes}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Footer Section */}
                    <Card className="mt-8 bg-gray-50">
                        <CardContent className="pt-6">
                            <Separator className="mb-4" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>Created: {new Date(moveOut.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>Last Updated: {new Date(moveOut.updated_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
