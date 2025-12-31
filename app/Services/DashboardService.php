<?php

namespace App\Services;

use App\Models\Cities;
use App\Models\PropertyInfoWithoutInsurance;
use App\Models\Unit;
use App\Models\Tenant;
use App\Models\MoveIn;
use App\Models\VendorTaskTracker;
use Illuminate\Database\Eloquent\Collection;

class DashboardService
{
    /**
     * Get all cities
     */
    public function getAllCities(): Collection
    {
        return Cities::select('id', 'city')
            ->orderBy('city')
            ->get();
    }

    /**
     * Get properties by city ID
     */
    public function getPropertiesByCity(int $cityId): Collection
    {
        return PropertyInfoWithoutInsurance::select('id', 'property_name', 'city_id')
            ->where('city_id', $cityId)
            ->orderBy('property_name')
            ->get();
    }

    public function getAllProperties(): Collection
    {
        return PropertyInfoWithoutInsurance::select('id', 'property_name', 'city_id')
            ->orderBy('property_name')
            ->get();
    }

    /**
     * Get units by property ID
     */
    public function getUnitsByProperty(int $propertyId): Collection
    {
        return Unit::select('id', 'unit_name', 'property_id', 'vacant', 'monthly_rent')
            ->where('property_id', $propertyId)
            ->orderBy('unit_name')
            ->get();
    }

    /**
     * Get detailed unit information
     */
    public function getUnitInfo(int $unitId): ?Unit
    {
        $unit = Unit::with(['property.city'])
            ->find($unitId);

        if ($unit) {
            // Add formatted monthly rent
            $unit->formatted_monthly_rent = $unit->monthly_rent
                ? '$' . number_format((float) $unit->monthly_rent, 2)
                : null;

            // Format dates for display
            $unit->lease_start_formatted = $unit->lease_start
                ? $unit->lease_start->format('M d, Y')
                : null;
            $unit->lease_end_formatted = $unit->lease_end
                ? $unit->lease_end->format('M d, Y')
                : null;
            $unit->insurance_expiration_date_formatted = $unit->insurance_expiration_date
                ? $unit->insurance_expiration_date->format('M d, Y')
                : null;
        }

        return $unit;
    }

    /**
     * Get complete tenant information by unit ID
     */
    public function getAllTenantInfoByUnit(int $unitId): Collection
    {
        return Tenant::with([
            'unit.property.city',
        ])
            ->where('unit_id', $unitId)
            ->orderBy('first_name')
            ->orderBy('last_name')
            ->get()
            ->map(function ($tenant) {
                // Add computed attributes
                $tenant->full_name = trim($tenant->first_name . ' ' . $tenant->last_name);
                $tenant->formatted_assistance_amount = $tenant->assistance_amount
                    ? '$' . number_format($tenant->assistance_amount, 2)
                    : null;
                $tenant->unit_name = $tenant->unit ? $tenant->unit->unit_name : null;
                $tenant->property_name = $tenant->unit && $tenant->unit->property
                    ? $tenant->unit->property->property_name : null;
                $tenant->city_name = $tenant->unit && $tenant->unit->property && $tenant->unit->property->city
                    ? $tenant->unit->property->city->city : null;

                // Format dates
                $tenant->created_at_formatted = $tenant->created_at
                    ? $tenant->created_at->format('M d, Y') : null;
                $tenant->updated_at_formatted = $tenant->updated_at
                    ? $tenant->updated_at->format('M d, Y') : null;

                return $tenant;
            });
    }

    /**
     * Get all move-in information by unit ID
     */
    public function getAllMoveInInfoByUnit(int $unitId): Collection
    {
        return MoveIn::with(['unit.property.city'])
            ->where('unit_id', $unitId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($moveIn) {
                // Format dates
                $moveIn->lease_signing_date_formatted = $moveIn->lease_signing_date
                    ? $moveIn->lease_signing_date->format('M d, Y') : null;
                $moveIn->move_in_date_formatted = $moveIn->move_in_date
                    ? $moveIn->move_in_date->format('M d, Y') : null;
                $moveIn->scheduled_paid_time_formatted = $moveIn->scheduled_paid_time
                    ? $moveIn->scheduled_paid_time->format('M d, Y') : null;
                $moveIn->move_in_form_sent_date_formatted = $moveIn->move_in_form_sent_date
                    ? $moveIn->move_in_form_sent_date->format('M d, Y') : null;
                $moveIn->date_of_move_in_form_filled_formatted = $moveIn->date_of_move_in_form_filled
                    ? $moveIn->date_of_move_in_form_filled->format('M d, Y') : null;
                $moveIn->date_of_insurance_expiration_formatted = $moveIn->date_of_insurance_expiration
                    ? $moveIn->date_of_insurance_expiration->format('M d, Y') : null;
                $moveIn->created_at_formatted = $moveIn->created_at
                    ? $moveIn->created_at->format('M d, Y') : null;
                $moveIn->updated_at_formatted = $moveIn->updated_at
                    ? $moveIn->updated_at->format('M d, Y') : null;

                // Add property information
                $moveIn->unit_name = $moveIn->unit ? $moveIn->unit->unit_name : null;
                $moveIn->property_name = $moveIn->unit && $moveIn->unit->property
                    ? $moveIn->unit->property->property_name : null;
                $moveIn->city_name = $moveIn->unit && $moveIn->unit->property && $moveIn->unit->property->city
                    ? $moveIn->unit->property->city->city : null;

                return $moveIn;
            });
    }

    /**
     * Get all vendor task information by unit ID
     */
    public function getAllVendorTaskInfoByUnit(int $unitId): Collection
    {
        return VendorTaskTracker::with(['vendor.city', 'unit.property.city'])
            ->where('unit_id', $unitId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($vendorTask) {
                // Format dates
                $vendorTask->task_submission_date_formatted = $vendorTask->task_submission_date
                    ? $vendorTask->task_submission_date->format('M d, Y') : null;
                $vendorTask->any_scheduled_visits_formatted = $vendorTask->any_scheduled_visits
                    ? $vendorTask->any_scheduled_visits->format('M d, Y') : null;
                $vendorTask->task_ending_date_formatted = $vendorTask->task_ending_date
                    ? $vendorTask->task_ending_date->format('M d, Y') : null;
                $vendorTask->created_at_formatted = $vendorTask->created_at
                    ? $vendorTask->created_at->format('M d, Y') : null;
                $vendorTask->updated_at_formatted = $vendorTask->updated_at
                    ? $vendorTask->updated_at->format('M d, Y') : null;

                // Add vendor and property information
                $vendorTask->vendor_name = $vendorTask->vendor ? $vendorTask->vendor->vendor_name : null;
                $vendorTask->vendor_email = $vendorTask->vendor ? $vendorTask->vendor->email : null;
                $vendorTask->vendor_number = $vendorTask->vendor ? $vendorTask->vendor->number : null;
                $vendorTask->vendor_service_type = $vendorTask->vendor ? $vendorTask->vendor->service_type : null;
                $vendorTask->vendor_city_name = $vendorTask->vendor && $vendorTask->vendor->city
                    ? $vendorTask->vendor->city->city : null;
                $vendorTask->unit_name = $vendorTask->unit ? $vendorTask->unit->unit_name : null;
                $vendorTask->property_name = $vendorTask->unit && $vendorTask->unit->property
                    ? $vendorTask->unit->property->property_name : null;
                $vendorTask->unit_city_name = $vendorTask->unit && $vendorTask->unit->property && $vendorTask->unit->property->city
                    ? $vendorTask->unit->property->city->city : null;

                return $vendorTask;
            });
    }
}
