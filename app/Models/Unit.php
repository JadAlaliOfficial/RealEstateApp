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
        'is_archived',
    ];

    protected $casts = [
        'lease_start' => 'date',
        'lease_end' => 'date',
        'insurance_expiration_date' => 'date',
        'monthly_rent' => 'decimal:2',
        'count_beds' => 'decimal:1',
        'count_baths' => 'decimal:1',
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
     * Get all tenants for this unit.
     */
    public function tenants(): HasMany
    {
        return $this->hasMany(\App\Models\Tenant::class, 'unit_id');
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
    }

    /**
     * Accessor for formatted monthly rent
     */
    public function getFormattedMonthlyRentAttribute(): string
    {
        return $this->monthly_rent ? '$' . number_format($this->monthly_rent, 2) : 'N/A';
    }
}
