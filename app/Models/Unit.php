<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Unit extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'unit_name',
        'tenants',
        'lease_start',
        'lease_end',
        'count_beds',
        'count_baths',
        'lease_status',
        'is_new_lease',
        'monthly_rent',
        'recurring_transaction',
        'utility_status',
        'account_number',
        'insurance',
        'insurance_expiration_date',
        'vacant',
        'listed',
        'total_applications',
        'is_archived',
    ];

    protected $casts = [
        'lease_start' => 'date',
        'lease_end' => 'date',
        'insurance_expiration_date' => 'date',
        'monthly_rent' => 'decimal:2',
        'count_beds' => 'decimal:1',
        'count_baths' => 'decimal:1',
        'total_applications' => 'integer',
        'is_archived' => 'boolean',
        'property_id' => 'integer',
    ];

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::addGlobalScope('not_archived', function (Builder $builder) {
            $builder->where('is_archived', false);
        });

        static::saving(function ($unit) {
            $unit->calculateFields();

            // Ensure insurance expiration is null when insurance is 'No'
            if ($unit->insurance === 'No') {
                $unit->insurance_expiration_date = null;
            }
        });
    }

    /**
     * Scope to include archived records
     */
    public function scopeWithArchived(Builder $query): Builder
    {
        return $query->withoutGlobalScope('not_archived');
    }

    /**
     * Scope to get only archived records
     */
    public function scopeOnlyArchived(Builder $query): Builder
    {
        return $query->withoutGlobalScope('not_archived')->where('is_archived', true);
    }

    /**
     * Soft delete by setting is_archived to true
     */
    public function archive(): bool
    {
        // Archive all tenants belonging to this unit first
        $this->tenants()->withArchived()->where('is_archived', false)->each(function ($tenant) {
            $tenant->archive();
        });
        
        return $this->update(['is_archived' => true]);
    }

    /**
     * Get the property that owns this unit.
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(PropertyInfoWithoutInsurance::class, 'property_id');
    }

    /**
     * Get all applications for this unit.
     */
    public function applications(): HasMany
    {
        return $this->hasMany(Application::class, 'unit_id');
    }

    /**
     * Get all tenants for this unit.
     */
    public function tenants(): HasMany
    {
        return $this->hasMany(\App\Models\Tenant::class, 'unit_id');
    }

    /**
     * Get all move-outs for this unit.
     */
    public function moveOuts(): HasMany
    {
        return $this->hasMany(MoveOut::class, 'unit_id');
    }

    /**
     * Calculate computed fields for the unit
     */
    public function calculateFields()
    {
        // Calculate Vacant - if tenants field is empty or null, unit is vacant
        $this->vacant = empty($this->tenants) ? 'Yes' : 'No';

        // Calculate Listed - vacant units are typically listed
        $this->listed = $this->vacant === 'Yes' ? 'Yes' : 'No';

        // Calculate Total Applications - count applications for this unit
        if ($this->exists && $this->listed === 'Yes') {
            $this->total_applications = $this->applications()->where('is_archived', false)->count();
        } else {
            $this->total_applications = 0;
        }
    }

    /**
     * Static method to update all units' application counts
     */
    public static function updateAllApplicationCounts()
    {
        $units = static::withArchived()->get();
        foreach ($units as $unit) {
            $unit->calculateFields();
            $unit->saveQuietly(); // Use saveQuietly to avoid triggering boot again
        }
    }

    /**
     * Method to update application count for specific unit by ID
     */
    public static function updateApplicationCountForUnit($unitId)
    {
        $unit = static::withArchived()->find($unitId);
        if ($unit) {
            $unit->calculateFields();
            $unit->saveQuietly();
        }
    }

    /**
     * Accessor for formatted monthly rent
     */
    public function getFormattedMonthlyRentAttribute(): string
    {
        return $this->monthly_rent ? '$' . number_format($this->monthly_rent, 2) : 'N/A';
    }

    /**
     * Validation rules for the model
     */
    public static function validationRules(): array
    {
        return [
            'property_id' => 'nullable|integer|exists:property_info_without_insurance,id',
            'unit_name' => 'required|string|max:255',
            'tenants' => 'nullable|string|max:255',
            'lease_start' => 'nullable|date',
            'lease_end' => 'nullable|date|after_or_equal:lease_start',
            'count_beds' => 'nullable|numeric|min:0|max:99.9',
            'count_baths' => 'nullable|numeric|min:0|max:99.9',
            'lease_status' => 'nullable|string|max:255',
            'is_new_lease' => 'nullable|in:Yes,No',
            'monthly_rent' => 'nullable|numeric|min:0|max:999999999999.99',
            'recurring_transaction' => 'nullable|string|max:255',
            'utility_status' => 'nullable|string|max:255',
            'account_number' => 'nullable|string|max:255',
            'insurance' => 'nullable|in:Yes,No',
            'insurance_expiration_date' => 'nullable|date',
        ];
    }

    /**
     * Validation rules for updating the model
     */
    public static function updateValidationRules($id = null): array
    {
        return [
            'property_id' => 'sometimes|nullable|integer|exists:property_info_without_insurance,id',
            'unit_name' => 'sometimes|required|string|max:255',
            'tenants' => 'sometimes|nullable|string|max:255',
            'lease_start' => 'sometimes|nullable|date',
            'lease_end' => 'sometimes|nullable|date|after_or_equal:lease_start',
            'count_beds' => 'sometimes|nullable|numeric|min:0|max:99.9',
            'count_baths' => 'sometimes|nullable|numeric|min:0|max:99.9',
            'lease_status' => 'sometimes|nullable|string|max:255',
            'is_new_lease' => 'sometimes|nullable|in:Yes,No',
            'monthly_rent' => 'sometimes|nullable|numeric|min:0|max:999999999999.99',
            'recurring_transaction' => 'sometimes|nullable|string|max:255',
            'utility_status' => 'sometimes|nullable|string|max:255',
            'account_number' => 'sometimes|nullable|string|max:255',
            'insurance' => 'sometimes|nullable|in:Yes,No',
            'insurance_expiration_date' => 'sometimes|nullable|date',
        ];
    }
}
