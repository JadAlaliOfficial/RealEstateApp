// resources/js/types/unit.ts

export interface Unit {
    id: number;
    property_id: number; // Add property_id as foreign key
    city: string; // Keep for display purposes (comes from transformed data)
    property: string; // Keep for display purposes (comes from transformed data)
    unit_name: string;
    tenants: string | null;
    lease_start: string | null;
    lease_end: string | null;
    count_beds: number | null;
    count_baths: number | null;
    lease_status: string | null;
    is_new_lease: 'Yes' | 'No' | null;
    monthly_rent: number | null;
    recurring_transaction: string | null;
    utility_status: string | null;
    account_number: string | null;
    insurance: 'Yes' | 'No' | null;
    insurance_expiration_date: string | null;
    vacant: string;
    listed: string;
    total_applications: number;
    is_archived?: boolean; // Add is_archived field
    formatted_monthly_rent: string;
    created_at: string;
    updated_at: string;
    
    // Optional relationship data (when eager loaded)
    property_relation?: {
        id: number;
        property_name: string;
        city_id: number;
        city?: {
            id: number;
            city: string;
        };
    };
}

export interface UnitFormData {
    property_id: string; // Changed from city and property to property_id
    unit_name: string;
    tenants: string;
    lease_start: string;
    lease_end: string;
    count_beds: string;
    count_baths: string;
    lease_status: string;
    monthly_rent: string;
    recurring_transaction: string;
    utility_status: string;
    account_number: string;
    insurance: string;
    insurance_expiration_date: string;
}

// Keep UnitFilters unchanged since filtering still works by names
export interface UnitFilters {
    city?: string;
    property?: string;
    unit_name?: string;
    vacant?: string;
    listed?: string;
    insurance?: string;
    is_new_lease?: string;
}

export interface UnitStatistics {
    total: number;
    vacant: number;
    occupied: number;
    listed: number;
    total_applications: number;
    city_stats: Record<string, number>;
}

export interface PaginatedUnits {
    data: Unit[];
    current_page: number;
    last_page: number;
    per_page: number | string;
    total: number;
    from: number;
    to: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

export interface PageProps {
    auth: {
        user: any; // Replace with your user type
    };
    cities?: Array<{ id: number; city: string }>;
    properties?: Array<{
        id: number;
        property_name: string;
        city_id: number | null;
        city?: {
            id: number;
            city: string;
        };
    }>; // Add properties to PageProps
}

// Additional interfaces for better type safety
export interface CreateUnitData {
    property_id: number;
    unit_name: string;
    tenants?: string | null;
    lease_start?: string | null;
    lease_end?: string | null;
    count_beds?: number | null;
    count_baths?: number | null;
    lease_status?: string | null;
    monthly_rent?: number | null;
    recurring_transaction?: string | null;
    utility_status?: string | null;
    account_number?: string | null;
    insurance?: 'Yes' | 'No' | null;
    insurance_expiration_date?: string | null;
    is_archived?: boolean;
}

export interface UpdateUnitData extends CreateUnitData {
    // Same as CreateUnitData but for updates
}

// For import/export operations
export interface UnitImportData {
    PropertyName: string;
    number: string;
    BedBath: string;
    Residents: string;
    LeaseStartRaw: string;
    LeaseEndRaw: string;
    rent: string;
    recurringCharges: string;
}

export interface UnitImportResult {
    success: boolean;
    message: string;
    errors?: string[];
    warnings?: string[];
    statistics?: {
        success_count: number;
        error_count: number;
        skipped_count: number;
        total_processed: number;
    };
}
