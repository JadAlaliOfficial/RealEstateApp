<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class PropertyInfoWithoutInsurance extends Model
{
    use HasFactory;

    protected $table = 'property_info_without_insurance';

    protected $fillable = [
        'city_id',
        'property_name',
        'is_archived',
    ];

    protected $casts = [
        'city_id' => 'integer',
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
     * Get the city that owns the property.
     */
    public function city(): BelongsTo
    {
        return $this->belongsTo(Cities::class, 'city_id');
    }

    /**
     * Get the units associated with this property.
     * This replaces the insuranceInfo relationship since units now reference this model
     */
    public function units(): HasMany
    {
        return $this->hasMany(Unit::class, 'property_id');
    }

    /**
     * Validation rules for the model
     */
    public static function validationRules(): array
    {
        return [
            'city_id' => 'nullable|integer|exists:cities,id',
            'property_name' => 'required|string|max:255|unique:property_info_without_insurance,property_name',
        ];
    }

    /**
     * Validation rules for updating the model
     */
    public static function updateValidationRules($id = null): array
    {
        return [
            'city_id' => 'sometimes|nullable|integer|exists:cities,id',
            'property_name' => 'sometimes|required|string|max:255|unique:property_info_without_insurance,property_name,' . $id,
        ];
    }
}
