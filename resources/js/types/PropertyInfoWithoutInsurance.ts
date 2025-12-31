// types/PropertyInfoWithoutInsurance.ts
import { City } from './City';

export interface PropertyInfoWithoutInsurance {
  id: number;
  city_id: number | null;
  property_name: string;
  created_at: string;
  updated_at: string;
  city?: City;
}

export interface PropertyInfoWithoutInsuranceFormData {
  city_id: number | null;
  property_name: string;
}

export interface PropertyInfoWithoutInsuranceFilters {
  search?: string;
  city_filter?: number | string;
  [key: string]: string | number | undefined;
}

export interface PaginatedPropertyInfoWithoutInsurance {
  data: PropertyInfoWithoutInsurance[];
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