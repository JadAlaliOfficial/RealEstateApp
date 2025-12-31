// resources/js/types/property.ts

// Interface for the property without insurance data
export interface PropertyWithoutInsurance {
    id: number;
    city_id: number | null;
    property_name: string;
    is_archived: boolean;
    created_at: string;
    updated_at: string;
    // Optional city relationship data
    city?: {
        id: number;
        city: string;
        created_at: string;
        updated_at: string;
    };
}

// Updated main Property interface (PropertyInfo model)
export interface Property {
    id: number;
    property_id: number;  // Foreign key reference to PropertyInfoWithoutInsurance
    insurance_company_name: string;
    amount: number;
    policy_number: string;
    effective_date: string;
    expiration_date: string;
    notes?: string;  // Added notes field
    status: 'Active' | 'Expired';
    formatted_amount: string;
    is_archived: boolean;
    is_expired: boolean;
    is_expiring_soon: boolean;
    days_left: number;
    created_at: string;
    updated_at: string;
    
    // Relationship - optional property reference
    property?: PropertyWithoutInsurance;
}

// Add these to your existing property types

export interface PaginatedProperties {
    current_page: number;
    data: Property[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}


// Updated form data interface to match request validation
export interface PropertyFormData {
    property_id: number;  // Changed from property_name to property_id
    insurance_company_name: string;
    amount: string;
    policy_number: string;
    effective_date: string;
    expiration_date: string;
    notes?: string;  // Added notes field
}

// Updated filters interface - keeping property_name for UI filtering
export interface PropertyFilters {
    property_name?: string;  // Keep property_name for filtering by name in UI
    property_id?: number;    // Add property_id for internal filtering
    insurance_company_name?: string;
    policy_number?: string;
    status?: 'Active' | 'Expired';
}

// Keep existing interfaces unchanged
export interface PropertyStatistics {
    total: number;
    active: number;
    expired: number;
}

export interface PaginatedProperties {
    data: Property[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}
