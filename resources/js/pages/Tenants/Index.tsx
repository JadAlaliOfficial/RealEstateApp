import { Card, CardContent } from '@/components/ui/card';
import { usePermissions } from '@/hooks/usePermissions';
import AppLayout from '@/layouts/app-layout';
import { City } from '@/types/City';
import { PropertyInfoWithoutInsurance } from '@/types/PropertyInfoWithoutInsurance';
import { Tenant } from '@/types/tenant';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import TenantCreateDrawer from './TenantCreateDrawer';
import TenantEditDrawer from './TenantEditDrawer';
import { FlashMessages } from './index/FlashMessages';
import { ImportModal } from './index/ImportModal';
import { ImportStatsCard } from './index/ImportStatsCard';
import { Notification } from './index/Notification';
import { TenantFilters, FilterState } from './index/TenantFilters';
import { TenantPageHeader } from './index/TenantPageHeader';
import { TenantTable } from './index/TenantTable';
import { useNotification } from './index/useNotification';

// CSV Export utility function
const exportToCSV = (data: Tenant[], filename: string = 'tenants.csv') => {
    const headers = [
        'ID',
        'City',
        'Property Name',
        'Unit Number',
        'First Name',
        'Last Name',
        'Street Address',
        'Login Email',
        'Alternate Email',
        'Mobile',
        'Emergency Phone',
        'Payment Method',
        'Has Insurance',
        'Sensitive Communication',
        'Has Assistance',
        'Assistance Amount',
        'Assistance Company',
    ];

    const csvData = [
        headers.join(','),
        ...data.map((tenant) =>
            [
                tenant.id,
                `"${tenant.city_name || ''}"`,
                `"${tenant.property_name || ''}"`,
                `"${tenant.unit_number || ''}"`,
                `"${tenant.first_name || ''}"`,
                `"${tenant.last_name || ''}"`,
                `"${(tenant.street_address_line || '').replace(/"/g, '""')}"`,
                `"${tenant.login_email || ''}"`,
                `"${tenant.alternate_email || ''}"`,
                `"${tenant.mobile || ''}"`,
                `"${tenant.emergency_phone || ''}"`,
                `"${tenant.cash_or_check || ''}"`,
                `"${tenant.has_insurance || ''}"`,
                `"${tenant.sensitive_communication || ''}"`,
                `"${tenant.has_assistance || ''}"`,
                `"${tenant.assistance_amount || ''}"`,
                `"${(tenant.assistance_company || '').replace(/"/g, '""')}"`,
            ].join(',')
        ),
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

interface PaginationMeta {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
}

interface Props {
    tenants: Tenant[];
    search?: string;
    cities: City[];
    properties: PropertyInfoWithoutInsurance[];
    unitsByProperty: Record<string, Array<{ id: number; unit_name: string }>>;
    allCities: string[];
    allProperties: string[];
    allUnitNames: string[];
    pagination?: PaginationMeta | null;
    importStats?: {
        total_processed: number;
        successful_imports: number;
        errors: number;
        duplicates: number;
    };
}

export default function Index({ tenants, search, cities, properties, unitsByProperty, allCities, allProperties, allUnitNames, importStats, pagination }: Props) {
    const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();
    const [isExporting, setIsExporting] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showImportStats, setShowImportStats] = useState(!!importStats);
    const [showCreateDrawer, setShowCreateDrawer] = useState(false);
    const [showEditDrawer, setShowEditDrawer] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
    const { flash } = usePage().props;

    const { notification, showNotification, hideNotification } = useNotification();

    const importForm = useForm({
        file: null as File | null,
        skip_duplicates: false as boolean,
    });

    // Pagination state
    const [page, setPage] = useState<number>(pagination?.current_page ?? 1);
    const [perPage, setPerPage] = useState<number | 'all'>(pagination ? pagination.per_page : 15);

    // Track current filters to preserve across pagination changes
    const [currentFilters, setCurrentFilters] = useState<FilterState>({
        city: '',
        property: '',
        unitName: '',
        search: search || '',
    });

    useEffect(() => {
        // Sync pagination state when backend sends changes
        if (pagination) {
            setPage(pagination.current_page);
            setPerPage(pagination.per_page);
        } else {
            setPerPage('all');
            setPage(1);
        }
    }, [pagination]);

    const handleSearch = (filters: FilterState) => {
        setCurrentFilters(filters);
        router.get(
            route('tenants.index'),
            {
                search: filters.search,
                city: filters.city,
                property: filters.property,
                unit_name: filters.unitName,
                perPage: perPage,
                page: 1,
            },
            { preserveState: true }
        );
    };

    const handleClearFilters = () => {
        setCurrentFilters({ city: '', property: '', unitName: '', search: '' });
        setPage(1);
        router.get(
            route('tenants.index'),
            { perPage: perPage, page: 1 },
            { preserveState: false, replace: true }
        );
    };

    const handleDelete = (tenant: Tenant) => {
        if (
            confirm(
                `Are you sure you want to archive ${tenant.first_name} ${tenant.last_name}? This will hide them from the main list but they can be restored later.`
            )
        ) {
            router.patch(
                route('tenants.archive', tenant.id),
                {
                    // Preserve current filters and pagination on server redirect
                    search: currentFilters.search,
                    city: currentFilters.city,
                    property: currentFilters.property,
                    unit_name: currentFilters.unitName,
                    perPage: perPage,
                    page: page,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        showNotification('success', 'Tenant archived successfully!');
                    },
                    onError: () => {
                        showNotification('error', 'Failed to archive tenant. Please try again.');
                    },
                }
            );
        }
    };

    const handleEdit = (tenant: Tenant) => {
        setSelectedTenant(tenant);
        setShowEditDrawer(true);
    };

    const handleEditSuccess = () => {
        showNotification('success', 'Tenant updated successfully!');
        setSelectedTenant(null);
    };

    const handleCSVExport = () => {
        if (tenants.length === 0) {
            alert('No data to export');
            return;
        }

        setIsExporting(true);
        try {
            const filename = `tenants-${new Date().toISOString().split('T')[0]}.csv`;
            exportToCSV(tenants, filename);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    const handleImport = useCallback(
        (file: File, skipDuplicates: boolean) => {
            importForm.setData({
                file: file,
                skip_duplicates: skipDuplicates,
            });

            router.post(
                route('tenants.import.process'),
                {
                    file: file,
                    skip_duplicates: skipDuplicates,
                },
                {
                    forceFormData: true,
                    onSuccess: () => {
                        setShowImportModal(false);
                        importForm.reset();
                        showNotification('success', 'CSV file imported successfully!');
                    },
                    onError: (errors) => {
                        const errorMessage = errors.file || errors.import || 'Failed to import CSV file. Please try again.';
                        showNotification('error', errorMessage);
                    },
                    onFinish: () => {
                        importForm.clearErrors();
                    },
                }
            );
        },
        [importForm, showNotification]
    );

    // Use server-provided unique names for filters (strings only)
    const uniqueUnitNames = allUnitNames || [];

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        router.get(
            route('tenants.index'),
            {
                search: currentFilters.search,
                city: currentFilters.city,
                property: currentFilters.property,
                unit_name: currentFilters.unitName,
                perPage: perPage,
                page: newPage,
            },
            { preserveState: true }
        );
    };

    const handlePerPageChange = (value: string) => {
        const selected: number | 'all' = value === 'all' ? 'all' : parseInt(value, 10);
        setPerPage(selected);
        setPage(1);
        router.get(
            route('tenants.index'),
            {
                search: currentFilters.search,
                city: currentFilters.city,
                property: currentFilters.property,
                unit_name: currentFilters.unitName,
                perPage: selected,
                page: 1,
            },
            { preserveState: true }
        );
    };

    return (
        <AppLayout>
            <Head title="Tenants" />

            {notification && <Notification type={notification.type} message={notification.message} onClose={hideNotification} />}

            <ImportModal isOpen={showImportModal} onClose={() => setShowImportModal(false)} onSubmit={handleImport} isLoading={importForm.processing} />

            <TenantCreateDrawer
                open={showCreateDrawer}
                onOpenChange={() => setShowCreateDrawer(false)}
                cities={cities}
                properties={properties}
                unitsByProperty={unitsByProperty}
                currentFilters={currentFilters}
                page={page}
                perPage={perPage}
                onSuccess={() => showNotification('success', 'Tenant created successfully!')}
            />

            <div className="min-h-screen bg-background py-12 text-foreground transition-colors">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <FlashMessages success={(flash as any)?.success} error={(flash as any)?.error} />

                    {showImportStats && importStats && <ImportStatsCard stats={importStats} onClose={() => setShowImportStats(false)} />}

                    <TenantPageHeader
                        onExport={handleCSVExport}
                        onImport={() => setShowImportModal(true)}
                        onAddNew={() => setShowCreateDrawer(true)}
                        isExporting={isExporting}
                        hasExportData={tenants.length > 0}
                        canImport={hasPermission('tenants.import')}
                        canCreate={hasAllPermissions(['tenants.create', 'tenants.store'])}
                    />

                    {/* Filters Card */}
                    <Card className="bg-card text-card-foreground shadow-lg mb-6">
                        <CardContent className="p-6 overflow-visible">
                            <TenantFilters
                                cities={allCities}
                                properties={allProperties}
                                uniqueUnitNames={uniqueUnitNames}
                                onSearch={handleSearch}
                                onClear={handleClearFilters}
                                initialFilters={{
                                    city: '',
                                    property: '',
                                    unitName: '',
                                    search: search || '',
                                }}
                            />
                        </CardContent>
                    </Card>

                    {/* Table Card */}
                    <Card className="bg-card text-card-foreground shadow-lg">
                        <CardContent className="p-6">
                            <TenantTable
                                tenants={tenants}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                canEdit={hasAllPermissions(['tenants.edit', 'tenants.update'])}
                                canDelete={hasPermission('tenants.destroy')}
                                showActions={hasAnyPermission(['tenants.show', 'tenants.edit', 'tenants.update', 'tenants.destroy'])}
                            />
                            {tenants.length === 0 && (
                                <div className="py-8 text-center text-muted-foreground">
                                    <p className="text-lg">No tenants found.</p>
                                    <p className="text-sm">Try adjusting your search criteria.</p>
                                </div>
                            )}
                            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                                <div className="text-sm text-muted-foreground">
                                    {pagination ? (
                                        <>
                                            Showing {tenants.length} of {pagination.total} tenant{pagination.total !== 1 ? 's' : ''}
                                            {search && ` matching "${search}"`}
                                        </>
                                    ) : (
                                        <>
                                            Showing {tenants.length} tenant{tenants.length !== 1 ? 's' : ''} (all)
                                            {search && ` matching "${search}"`}
                                        </>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <label className="text-sm text-muted-foreground">Rows per page</label>
                                    <select
                                        className="rounded-md border bg-background px-2 py-1 text-sm"
                                        value={perPage === 'all' ? 'all' : String(perPage)}
                                        onChange={(e) => handlePerPageChange(e.target.value)}
                                    >
                                        <option value="15">15</option>
                                        <option value="30">30</option>
                                        <option value="50">50</option>
                                        <option value="all">All</option>
                                    </select>
                                    {perPage !== 'all' && pagination && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
                                                onClick={() => handlePageChange(Math.max(1, page - 1))}
                                                disabled={page <= 1}
                                            >
                                                Prev
                                            </button>
                                            <span className="text-sm text-muted-foreground">
                                                Page {page} of {pagination.last_page}
                                            </span>
                                            <button
                                                className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
                                                onClick={() => handlePageChange(Math.min(pagination.last_page, page + 1))}
                                                disabled={page >= pagination.last_page}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {selectedTenant && (
                <TenantEditDrawer
                    open={showEditDrawer}
                    onOpenChange={() => {
                        setShowEditDrawer(false);
                        setSelectedTenant(null);
                    }}
                    tenant={selectedTenant}
                    cities={cities}
                    properties={properties}
                    unitsByProperty={unitsByProperty}
                    currentFilters={currentFilters}
                    page={page}
                    perPage={perPage}
                    onSuccess={handleEditSuccess}
                />
            )}
        </AppLayout>
    );
}
