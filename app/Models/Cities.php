<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Cities extends Model
{
    use HasFactory;
    
    protected $table = 'cities';

    protected $fillable = [
        'city',
        'is_archived',
    ];

    protected $casts = [
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
     * Get the properties without insurance for this city.
     */
    public function propertiesWithoutInsurance(): HasMany
    {
        return $this->hasMany(PropertyInfoWithoutInsurance::class, 'city_id');
    }

    /**
     * Get the vendors for this city.
     */
    public function vendors(): HasMany
    {
        return $this->hasMany(VendorInfo::class, 'city_id');
    }

    /**
     * Validation rules for the model
     */
    public static function validationRules(): array
    {
        return [
            'city' => 'required|string|max:255|unique:cities,city',
        ];
    }

    /**
     * Validation rules for updating the model
     */
    public static function updateValidationRules($id = null): array
    {
        return [
            'city' => 'sometimes|required|string|max:255|unique:cities,city,' . $id,
        ];
    }
}
