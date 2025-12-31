<?php

namespace App\Services;

use App\Models\PropertyInfoWithoutInsurance;
use App\Models\Cities;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class PropertyInfoWithoutInsuranceService
{
    /**
     * Get all properties with pagination and filters
     */
    public function getAllPaginated(int $perPage = 100, array $filters = []): LengthAwarePaginator
    {
        $query = PropertyInfoWithoutInsurance::with('city');

        // Apply search filter
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('property_name', 'like', "%{$search}%")
                  ->orWhereHas('city', function ($cityQuery) use ($search) {
                      $cityQuery->where('city', 'like', "%{$search}%");
                  });
            });
        }

        // Apply city filter
        if (!empty($filters['city_filter'])) {
            $query->where('city_id', $filters['city_filter']);
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Create a new property
     */
    public function create(array $data): PropertyInfoWithoutInsurance
    {
        return PropertyInfoWithoutInsurance::create($data);
    }

    /**
     * Find property by ID
     */
    public function findById(int $id): PropertyInfoWithoutInsurance
    {
        return PropertyInfoWithoutInsurance::with('city')->findOrFail($id);
    }

    /**
     * Update property
     */
    public function update(PropertyInfoWithoutInsurance $property, array $data): PropertyInfoWithoutInsurance
    {
        $property->update($data);
        return $property->fresh(['city']);
    }

    /**
     * Delete property
     */
    public function delete(PropertyInfoWithoutInsurance $property): bool
    {
        return $property->archive();
    }

    /**
     * Get properties by city ID
     */
    public function getByCity(int $cityId): Collection
    {
        return PropertyInfoWithoutInsurance::where('city_id', $cityId)
            ->orderBy('property_name')
            ->get();
    }

    /**
     * Get all cities for dropdown
     */
    public function getAllCities(): Collection
    {
        return Cities::all();
    }

    /**
     * Get all available properties for dropdown selection
     * This method is used by PropertyInfoController for property selection
     */
    public function getAvailableProperties(): Collection
    {
        return PropertyInfoWithoutInsurance::with('city')
            ->orderBy('property_name')
            ->get();
    }

    /**
     * Get properties without city assigned
     */
    public function getPropertiesWithoutCity(): Collection
    {
        return PropertyInfoWithoutInsurance::whereNull('city_id')
            ->orderBy('property_name')
            ->get();
    }

    /**
     * Get statistics
     */
    public function getStatistics(): array
    {
        $total = PropertyInfoWithoutInsurance::count();
        $withCity = PropertyInfoWithoutInsurance::whereNotNull('city_id')->count();
        $withoutCity = PropertyInfoWithoutInsurance::whereNull('city_id')->count();

        return [
            'total' => $total,
            'with_city' => $withCity,
            'without_city' => $withoutCity,
        ];
    }

    /**
     * Bulk assign city to properties
     */
    public function bulkAssignCity(array $propertyIds, int $cityId): int
    {
        return PropertyInfoWithoutInsurance::whereIn('id', $propertyIds)
            ->update(['city_id' => $cityId]);
    }

    /**
     * Remove city assignment from properties
     */
    public function removeCityAssignment(array $propertyIds): int
    {
        return PropertyInfoWithoutInsurance::whereIn('id', $propertyIds)
            ->update(['city_id' => null]);
    }
}
