<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tenant extends Model
{
    use HasFactory;

    protected $fillable = [
        'unit_id',
        'first_name',
        'last_name',
        'street_address_line',
        'login_email',
        'alternate_email',
        'mobile',
        'emergency_phone',
        'cash_or_check',
        'has_insurance',
        'sensitive_communication',
        'has_assistance',
        'assistance_amount',
        'assistance_company',
        'is_archived',
    ];

    protected $casts = [
        'unit_id' => 'integer',
        'assistance_amount' => 'decimal:2',
        'is_archived' => 'boolean',
    ];

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::addGlobalScope('not_archived', function (Builder $builder) {
            $builder->where('is_archived', false);
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
        return $this->update(['is_archived' => true]);
    }

    /**
     * Restore archived record
     */
    public function restore(): bool
    {
        return $this->update(['is_archived' => false]);
    }

    /**
     * Get the unit that this tenant belongs to.
     */
    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class, 'unit_id');
    }

    /**
     * Accessor for full name
     */
    public function getFullNameAttribute(): string
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }

    /**
     * Accessor for formatted assistance amount
     */
    public function getFormattedAssistanceAmountAttribute(): string
    {
        return $this->assistance_amount ? '$' . number_format($this->assistance_amount, 2) : 'N/A';
    }

    /**
     * Accessor to get unit name through relationship
     */
    public function getUnitNameAttribute(): ?string
    {
        return $this->unit ? $this->unit->unit_name : null;
    }

    /**
     * Accessor to get property name through relationships
     */
    public function getPropertyNameAttribute(): ?string
    {
        return $this->unit && $this->unit->property ? $this->unit->property->property_name : null;
    }

    /**
     * Accessor to get city name through relationships
     */
    public function getCityNameAttribute(): ?string
    {
        return $this->unit && $this->unit->property && $this->unit->property->city 
            ? $this->unit->property->city->city 
            : null;
    }
}
