<?php

namespace App\Services;

use App\Models\Tenant;
use App\Models\Unit;
use App\Models\Cities;
use App\Models\PropertyInfoWithoutInsurance;
use Illuminate\Pagination\LengthAwarePaginator;

class TenantService
{
    /**
     * Base query with relationships and ordering.
     */
    public function buildTenantQuery(array $filters = [])
    {
        $query = Tenant::with(['unit', 'unit.property.city'])
            // Exclude tenants whose related unit is archived by requiring an active unit
            ->whereHas('unit');

        // Apply city filter by joining with properties and cities
        if (!empty($filters['city'])) {
            $query->whereHas('unit.property.city', function ($cityQuery) use ($filters) {
                $cityQuery->where('city', 'like', "%{$filters['city']}%");
            });
        }

        // Apply property filter
        if (!empty($filters['property'])) {
            $query->whereHas('unit.property', function ($propertyQuery) use ($filters) {
                $propertyQuery->where('property_name', 'like', "%{$filters['property']}%");
            });
        }

        // Apply unit name filter
        if (!empty($filters['unit_name'])) {
            $query->whereHas('unit', function ($unitQuery) use ($filters) {
                $unitQuery->where('unit_name', 'like', "%{$filters['unit_name']}%");
            });
        }

        // Apply general search filter: only first_name and last_name
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('first_name', 'like', "%{$filters['search']}%")
                  ->orWhere('last_name', 'like', "%{$filters['search']}%");
            });
        }

        // Consistent ordering: by unit_name then created_at desc
        return $query
            ->orderBy(Unit::select('unit_name')->whereColumn('units.id', 'tenants.unit_id'), 'asc')
            ->orderBy('created_at', 'desc');
    }

    public function getAllTenants(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->buildTenantQuery()->get();
    }

    public function getPaginatedTenants(int $perPage = 10): LengthAwarePaginator
    {
        return $this->buildTenantQuery()->paginate($perPage);
    }

    public function createTenant(array $data): Tenant
    {
        $data = $this->validateAssistanceFields($data);
        $tenant = Tenant::create($data);
        
        // Update unit calculations after creating tenant
        Unit::updateApplicationCountForUnit($data['unit_id']);
        
        // After creating a tenant, update the associated unit:
        // - Append tenant full name to `tenants` string (comma-separated)
        // - Set `is_new_lease` to 'Yes'
        // - If `vacant` was 'Yes', set it to null
        $unit = Unit::withArchived()->find($data['unit_id'] ?? null);
        if ($unit) {
            $fullName = trim(($data['first_name'] ?? '') . ' ' . ($data['last_name'] ?? ''));
            if ($fullName !== '') {
                $existing = trim((string) $unit->tenants);
                $unit->tenants = $existing !== ''
                    ? $existing . ', ' . $fullName
                    : $fullName;
            }

            $unit->is_new_lease = 'Yes';

            if ($unit->vacant === 'Yes') {
                $unit->vacant = 'No';
                if ($unit->listed === 'Yes') {
                    $unit->listed = 'No';
                }
            }

            // Save quietly to avoid triggering calculateFields() which would override `vacant`
            $unit->saveQuietly();
        }
        
        return $tenant;
    }

    public function updateTenant(Tenant $tenant, array $data): Tenant
    {
        $data = $this->validateAssistanceFields($data);
        $oldUnitId = $tenant->unit_id;
        
        $tenant->update($data);
        
        // Update calculations for both old and new units if unit changed
        if ($oldUnitId !== $data['unit_id']) {
            Unit::updateApplicationCountForUnit($oldUnitId);
            Unit::updateApplicationCountForUnit($data['unit_id']);
        } else {
            Unit::updateApplicationCountForUnit($data['unit_id']);
        }
        
        return $tenant->fresh(['unit.property.city']);
    }

    /**
     * Validate assistance fields and set them to null if has_assistance is "No"
     */
    private function validateAssistanceFields(array $data): array
    {
        if (isset($data['has_assistance']) && $data['has_assistance'] === 'No') {
            $data['assistance_amount'] = null;
            $data['assistance_company'] = null;
        }
        
        return $data;
    }

    public function deleteTenant(Tenant $tenant): bool
    {
        $unitId = $tenant->unit_id;
        $result = $tenant->archive();
        
        // Update unit calculations after archiving tenant
        if ($result) {
            Unit::updateApplicationCountForUnit($unitId);
        }
        
        return $result;
    }

    public function findTenant(int $id): ?Tenant
    {
        return Tenant::with(['unit' => function ($query) {
                $query->withArchived();
            }, 'unit.property.city'])->find($id);
    }

    public function filterTenants(array $filters): \Illuminate\Database\Eloquent\Collection
    {
        return $this->buildTenantQuery($filters)->get();
    }

    /**
     * Get paginated tenants with filters applied.
     */
    public function getTenantsPaginated(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        return $this->buildTenantQuery($filters)->paginate($perPage);
    }

    /**
     * Get all city names (unique, sorted) for filters.
     */
    public function getAllCityNames(): array
    {
        return Cities::orderBy('city')->pluck('city')->toArray();
    }

    /**
     * Get all property names (unique, sorted) for filters.
     */
    public function getAllPropertyNames(): array
    {
        return PropertyInfoWithoutInsurance::orderBy('property_name')->pluck('property_name')->toArray();
    }

    /**
     * Get all unit names (unique, sorted, including archived units) for filters.
     */
    public function getAllUnitNames(): array
    {
        return Unit::select('unit_name')
            ->distinct()
            ->orderBy('unit_name')
            ->pluck('unit_name')
            ->toArray();
    }
}
