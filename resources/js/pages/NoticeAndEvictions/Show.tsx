import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { NoticeAndEviction } from '@/types/NoticeAndEviction';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, User, Home, Clock, FileText, AlertTriangle, Scale, Gavel, Bell, ChevronLeft, ChevronRight, Users } from 'lucide-react';


interface NavigationRecord {
    id: number;
    tenant_name: string;
    unit_name: string;
}

interface Navigation {
    previous: NavigationRecord | null;
    next: NavigationRecord | null;
    total_in_filter: number;
    current_position: number | null;
}

interface Props {
    record: NoticeAndEviction;
    navigation?: Navigation;
    filters?: Record<string, any>;
    filterQueryString?: string;
}


export default function Show({ record, navigation, filterQueryString = '' }: Props) {

    const getYesNoBadge = (value: string | null | undefined) => {
        if (!value || value === '-') return <Badge variant="outline" className="text-xs">N/A</Badge>;
        return (
            <Badge 
                variant={value === 'Yes' ? 'default' : 'secondary'} 
                className={`text-xs ${value === 'Yes' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}
            >
                {value}
            </Badge>
        );
    };

    const formatDate = (date: string | null | undefined) => {
        if (!date) return 'Not Set';
        try {
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return 'Invalid Date';
        }
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

    return (
        <AppLayout>
            <Head title={`Notice & Eviction Details #${record.id}`} />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Notice & Eviction Record #{record.id}</h1>
                                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                    <MapPin className="h-4 w-4" />
                                    <span>{record.city_name || 'N/A'} • {record.property_name || 'N/A'}</span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Link href={`/notice_and_evictions${filterQueryString}`}>
                                    <Button variant="outline">Back to List</Button>
                                </Link>
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
                                    value={record.city_name || 'N/A'}
                                    className="bg-blue-50/50"
                                />
                                <InfoItem
                                    icon={Home}
                                    label="Property"
                                    value={record.property_name || 'N/A'}
                                    className="bg-green-50/50"
                                />
                                <InfoItem
                                    icon={Home}
                                    label="Unit"
                                    value={record.unit_name || 'N/A'}
                                    className="bg-purple-50/50"
                                />
                                <InfoItem
                                    icon={User}
                                    label="Tenant"
                                    value={record.tenants_name || 'N/A'}
                                    className="bg-orange-50/50"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Important Information Section */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <AlertTriangle className="h-5 w-5" />
                                Notice & Status Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="h-4 w-4 text-red-600" />
                                        <p className="text-sm font-medium text-red-800">Notice Date</p>
                                    </div>
                                    <p className="text-lg font-bold text-red-900">
                                        {formatDate(record.date)}
                                    </p>
                                </div>
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Bell className="h-4 w-4 text-blue-600" />
                                        <p className="text-sm font-medium text-blue-800">Type of Notice</p>
                                    </div>
                                    <p className="text-lg font-bold text-blue-900">
                                        {record.type_of_notice || 'N/A'}
                                    </p>
                                </div>
                                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileText className="h-4 w-4 text-green-600" />
                                        <p className="text-sm font-medium text-green-800">Status</p>
                                    </div>
                                    <div className="mt-1">
                                        <Badge variant="default" className="text-sm">
                                            {record.status || 'N/A'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Information Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Notice Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Bell className="h-5 w-5" />
                                    Notice Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <InfoItem
                                        icon={AlertTriangle}
                                        label="Have An Exception"
                                        value={getYesNoBadge(record.have_an_exception)}
                                    />
                                    <InfoItem
                                        icon={FileText}
                                        label="Evictions"
                                        value={record.evictions || 'N/A'}
                                    />
                                    <InfoItem
                                        icon={Scale}
                                        label="Sent to Attorney"
                                        value={getYesNoBadge(record.sent_to_atorney)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Legal Process */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Gavel className="h-5 w-5" />
                                    Legal Process
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <InfoItem
                                        icon={Calendar}
                                        label="Hearing Dates"
                                        value={formatDate(record.hearing_dates)}
                                    />
                                    <InfoItem
                                        icon={FileText}
                                        label="Evicted/Payment Plan"
                                        value={record.evected_or_payment_plan || 'N/A'}
                                    />
                                    <InfoItem
                                        icon={Home}
                                        label="If Left"
                                        value={getYesNoBadge(record.if_left)}
                                    />
                                    <InfoItem
                                        icon={Calendar}
                                        label="Writ Date"
                                        value={formatDate(record.writ_date)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Other Tenants Section */}
                    {record.other_tenants && (
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Users className="h-5 w-5" />
                                    Other Tenants
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700">
                                        {record.other_tenants}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Notes Section */}
                    {record.note && (
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <FileText className="h-5 w-5" />
                                    Additional Notes
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                        {record.note}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Footer Section */}
                    <Card className="mt-8 bg-gray-50">
                        <CardContent className="pt-6">
                            <Separator className="mb-4" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>Created: {record.created_at ? new Date(record.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) : 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>Last Updated: {record.updated_at ? new Date(record.updated_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) : 'N/A'}</span>
                                </div>
                            </div>

                            <Separator className="mb-6" />

                            {/* Navigation Section */}
                            {navigation && (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="flex items-center justify-center gap-4 w-full flex-wrap">
                                        {/* Previous Button */}
                                        {navigation.previous ? (
                                            <Link href={`/notice_and_evictions/${navigation.previous.id}${filterQueryString}`}>
                                                <Button variant="outline" className="gap-2">
                                                    <ChevronLeft className="h-4 w-4" />
                                                    Previous
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Button variant="outline" disabled className="gap-2">
                                                <ChevronLeft className="h-4 w-4" />
                                                Previous
                                            </Button>
                                        )}

                                        {/* Position Indicator */}
                                        <div className="px-4 py-2 bg-gray-100 rounded-lg border border-gray-300 text-center min-w-[150px]">
                                            <p className="text-sm font-medium text-gray-700">
                                                Record <span className="font-bold">{navigation.current_position || '?'}</span> of <span className="font-bold">{navigation.total_in_filter}</span>
                                            </p>
                                        </div>

                                        {/* Next Button */}
                                        {navigation.next ? (
                                            <Link href={`/notice_and_evictions/${navigation.next.id}${filterQueryString}`}>
                                                <Button variant="outline" className="gap-2">
                                                    Next
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Button variant="outline" disabled className="gap-2">
                                                Next
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>

                                    {/* Navigation Info */}
                                    <div className="text-xs text-gray-500 text-center">
                                        {navigation.previous && (
                                            <p>← {navigation.previous.tenant_name} ({navigation.previous.unit_name})</p>
                                        )}
                                        {navigation.next && (
                                            <p>{navigation.next.tenant_name} ({navigation.next.unit_name}) →</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
