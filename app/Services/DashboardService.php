<?php

namespace App\Services;

use App\Models\Cities;
use App\Models\PropertyInfoWithoutInsurance;
use App\Models\Unit;
use App\Models\Tenant;
use App\Models\MoveIn;
use App\Models\MoveOut;
use App\Models\VendorTaskTracker;
use App\Models\Payment;
use App\Models\PaymentPlan;
use App\Models\Application;
use App\Models\OffersAndRenewal;
use App\Models\NoticeAndEviction;
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
        $unit = Unit::with(['property.city', 'applications'])
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
            'noticesAndEvictions' => function ($query) {
                $query->orderBy('created_at', 'desc')->limit(5);
            },
            'offersAndRenewals' => function ($query) {
                $query->orderBy('created_at', 'desc')->limit(5);
            }
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
     * Get all move-out information by unit ID
     */
    public function getAllMoveOutInfoByUnit(int $unitId): Collection
    {
        return MoveOut::with(['unit.property.city'])
            ->where('unit_id', $unitId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($moveOut) {
                // Format dates
                $moveOut->move_out_date_formatted = $moveOut->move_out_date
                    ? $moveOut->move_out_date->format('M d, Y') : null;
                $moveOut->date_lease_ending_on_buildium_formatted = $moveOut->date_lease_ending_on_buildium
                    ? $moveOut->date_lease_ending_on_buildium->format('M d, Y') : null;
                $moveOut->date_utility_put_under_our_name_formatted = $moveOut->date_utility_put_under_our_name
                    ? $moveOut->date_utility_put_under_our_name->format('M d, Y') : null;
                $moveOut->created_at_formatted = $moveOut->created_at
                    ? $moveOut->created_at->format('M d, Y') : null;
                $moveOut->updated_at_formatted = $moveOut->updated_at
                    ? $moveOut->updated_at->format('M d, Y') : null;

                // Add tenant name from string column and property information
                $moveOut->tenant_name = $moveOut->tenants; // Now a string column
                $moveOut->unit_name = $moveOut->unit ? $moveOut->unit->unit_name : null;
                $moveOut->property_name = $moveOut->unit && $moveOut->unit->property
                    ? $moveOut->unit->property->property_name : null;
                $moveOut->city_name = $moveOut->unit && $moveOut->unit->property && $moveOut->unit->property->city
                    ? $moveOut->unit->property->city->city : null;

                return $moveOut;
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

    /**
     * Get all payment information by unit ID
     */
    public function getAllPaymentInfoByUnit(int $unitId): Collection
    {
        return Payment::with(['unit.property.city'])
            ->where('unit_id', $unitId)
            ->orderBy('date', 'desc')
            ->get()
            ->map(function ($payment) {
                // Format dates
                $payment->date_formatted = $payment->date
                    ? $payment->date->format('M d, Y') : null;
                $payment->created_at_formatted = $payment->created_at
                    ? $payment->created_at->format('M d, Y') : null;
                $payment->updated_at_formatted = $payment->updated_at
                    ? $payment->updated_at->format('M d, Y') : null;

                // Add formatted amounts (using model accessors)
                $payment->formatted_owes = $payment->formatted_owes;
                $payment->formatted_paid = $payment->formatted_paid;
                $payment->formatted_left_to_pay = $payment->formatted_left_to_pay;

                // Add unit and property information
                $payment->unit_name = $payment->unit ? $payment->unit->unit_name : null;
                $payment->property_name = $payment->unit && $payment->unit->property
                    ? $payment->unit->property->property_name : null;
                $payment->city_name = $payment->unit && $payment->unit->property && $payment->unit->property->city
                    ? $payment->unit->property->city->city : null;

                return $payment;
            });
    }

    /**
     * Get all payment plan information by unit ID
     */
    public function getAllPaymentPlanInfoByUnit(int $unitId): Collection
    {
        return PaymentPlan::with(['tenant.unit.property.city'])
            ->whereHas('tenant', function ($query) use ($unitId) {
                $query->where('unit_id', $unitId);
            })
            ->orderBy('dates', 'desc')
            ->get()
            ->map(function ($paymentPlan) {
                // Format dates
                $paymentPlan->dates_formatted = $paymentPlan->dates
                    ? $paymentPlan->dates->format('M d, Y') : null;
                $paymentPlan->created_at_formatted = $paymentPlan->created_at
                    ? $paymentPlan->created_at->format('M d, Y') : null;
                $paymentPlan->updated_at_formatted = $paymentPlan->updated_at
                    ? $paymentPlan->updated_at->format('M d, Y') : null;

                // Add formatted amounts
                $paymentPlan->formatted_amount = '$' . number_format((float) ($paymentPlan->amount ?? 0), 2);
                $paymentPlan->formatted_paid = '$' . number_format((float) ($paymentPlan->paid ?? 0), 2);
                $paymentPlan->formatted_left_to_pay = '$' . number_format((float) ($paymentPlan->left_to_pay ?? 0), 2);

                // Add tenant and property information
                $paymentPlan->tenant_name = $paymentPlan->tenant ? $paymentPlan->tenant->full_name : null;
                $paymentPlan->unit_name = $paymentPlan->tenant && $paymentPlan->tenant->unit
                    ? $paymentPlan->tenant->unit->unit_name : null;
                $paymentPlan->property_name = $paymentPlan->tenant && $paymentPlan->tenant->unit && $paymentPlan->tenant->unit->property
                    ? $paymentPlan->tenant->unit->property->property_name : null;
                $paymentPlan->city_name = $paymentPlan->tenant && $paymentPlan->tenant->unit && $paymentPlan->tenant->unit->property && $paymentPlan->tenant->unit->property->city
                    ? $paymentPlan->tenant->unit->property->city->city : null;

                return $paymentPlan;
            });
    }

    /**
     * Get all application information by unit ID
     */
    public function getAllApplicationInfoByUnit(int $unitId): Collection
    {
        return Application::with(['unit.property.city'])
            ->where('unit_id', $unitId)
            ->orderBy('date', 'desc')
            ->get()
            ->map(function ($application) {
                // Format dates
                $application->date_formatted = $application->date
                    ? $application->date->format('M d, Y') : null;
                $application->created_at_formatted = $application->created_at
                    ? $application->created_at->format('M d, Y') : null;
                $application->updated_at_formatted = $application->updated_at
                    ? $application->updated_at->format('M d, Y') : null;

                // ✅ NEW: Handle multiple attachments (now arrays)
                $names = $application->attachment_name ?? [];
                $paths = $application->attachment_path ?? [];
                $attachments = [];

                foreach ($names as $index => $name) {
                    if (isset($paths[$index])) {
                        $attachments[] = [
                            'index' => $index,
                            'name' => $name,
                            'path' => $paths[$index],
                            'url' => asset('storage/' . $paths[$index]),
                            'download_url' => route('applications.download', [
                                'application' => $application->id,
                                'index' => $index
                            ]),
                        ];
                    }
                }

                $application->attachments = $attachments;
                $application->has_attachment = count($attachments) > 0;

                // Add unit and property information
                $application->unit_name = $application->unit ? $application->unit->unit_name : null;
                $application->property_name = $application->unit && $application->unit->property
                    ? $application->unit->property->property_name : null;
                $application->city_name = $application->unit && $application->unit->property && $application->unit->property->city
                    ? $application->unit->property->city->city : null;

                return $application;
            });
    }


    /**
     * Get all offers and renewals information by unit ID
     */
    public function getAllOffersAndRenewalsInfoByUnit(int $unitId): Collection
    {
        return OffersAndRenewal::with(['tenant.unit.property.city'])
            ->whereHas('tenant', function ($query) use ($unitId) {
                $query->where('unit_id', $unitId);
            })
            ->orderBy('date_sent_offer', 'desc')
            ->get()
            ->map(function ($offersAndRenewal) {
                // Format dates
                $offersAndRenewal->date_sent_offer_formatted = $offersAndRenewal->date_sent_offer
                    ? $offersAndRenewal->date_sent_offer->format('M d, Y') : null;
                $offersAndRenewal->date_offer_expires_formatted = $offersAndRenewal->date_offer_expires
                    ? $offersAndRenewal->date_offer_expires->format('M d, Y') : null;
                $offersAndRenewal->date_of_acceptance_formatted = $offersAndRenewal->date_of_acceptance
                    ? $offersAndRenewal->date_of_acceptance->format('M d, Y') : null;
                $offersAndRenewal->last_notice_sent_formatted = $offersAndRenewal->last_notice_sent
                    ? $offersAndRenewal->last_notice_sent->format('M d, Y') : null;
                $offersAndRenewal->date_sent_lease_formatted = $offersAndRenewal->date_sent_lease
                    ? $offersAndRenewal->date_sent_lease->format('M d, Y') : null;
                $offersAndRenewal->lease_expires_formatted = $offersAndRenewal->lease_expires
                    ? $offersAndRenewal->lease_expires->format('M d, Y') : null;
                $offersAndRenewal->date_signed_formatted = $offersAndRenewal->date_signed
                    ? $offersAndRenewal->date_signed->format('M d, Y') : null;
                $offersAndRenewal->last_notice_sent_2_formatted = $offersAndRenewal->last_notice_sent_2
                    ? $offersAndRenewal->last_notice_sent_2->format('M d, Y') : null;
                $offersAndRenewal->created_at_formatted = $offersAndRenewal->created_at
                    ? $offersAndRenewal->created_at->format('M d, Y') : null;
                $offersAndRenewal->updated_at_formatted = $offersAndRenewal->updated_at
                    ? $offersAndRenewal->updated_at->format('M d, Y') : null;

                // Add tenant and property information
                $offersAndRenewal->tenant_name = $offersAndRenewal->tenant ? $offersAndRenewal->tenant->full_name : null;
                $offersAndRenewal->unit_name = $offersAndRenewal->tenant && $offersAndRenewal->tenant->unit
                    ? $offersAndRenewal->tenant->unit->unit_name : null;
                $offersAndRenewal->property_name = $offersAndRenewal->tenant && $offersAndRenewal->tenant->unit && $offersAndRenewal->tenant->unit->property
                    ? $offersAndRenewal->tenant->unit->property->property_name : null;
                $offersAndRenewal->city_name = $offersAndRenewal->tenant && $offersAndRenewal->tenant->unit && $offersAndRenewal->tenant->unit->property && $offersAndRenewal->tenant->unit->property->city
                    ? $offersAndRenewal->tenant->unit->property->city->city : null;

                return $offersAndRenewal;
            });
    }

    /**
     * Get all notices and evictions information by unit ID
     */
    public function getAllNoticesAndEvictionsInfoByUnit(int $unitId): Collection
    {
        return NoticeAndEviction::with(['tenant.unit.property.city'])
            ->whereHas('tenant', function ($query) use ($unitId) {
                $query->where('unit_id', $unitId);
            })
            ->orderBy('date', 'desc')
            ->get()
            ->map(function ($noticeAndEviction) {
                // Format dates
                $noticeAndEviction->date_formatted = $noticeAndEviction->date
                    ? $noticeAndEviction->date->format('M d, Y') : null;
                $noticeAndEviction->hearing_dates_formatted = $noticeAndEviction->hearing_dates
                    ? $noticeAndEviction->hearing_dates->format('M d, Y') : null;
                $noticeAndEviction->writ_date_formatted = $noticeAndEviction->writ_date
                    ? $noticeAndEviction->writ_date->format('M d, Y') : null;
                $noticeAndEviction->created_at_formatted = $noticeAndEviction->created_at
                    ? $noticeAndEviction->created_at->format('M d, Y') : null;
                $noticeAndEviction->updated_at_formatted = $noticeAndEviction->updated_at
                    ? $noticeAndEviction->updated_at->format('M d, Y') : null;

                // Add tenant and property information
                $noticeAndEviction->tenant_name = $noticeAndEviction->tenant ? $noticeAndEviction->tenant->full_name : null;
                $noticeAndEviction->unit_name = $noticeAndEviction->tenant && $noticeAndEviction->tenant->unit
                    ? $noticeAndEviction->tenant->unit->unit_name : null;
                $noticeAndEviction->property_name = $noticeAndEviction->tenant && $noticeAndEviction->tenant->unit && $noticeAndEviction->tenant->unit->property
                    ? $noticeAndEviction->tenant->unit->property->property_name : null;
                $noticeAndEviction->city_name = $noticeAndEviction->tenant && $noticeAndEviction->tenant->unit && $noticeAndEviction->tenant->unit->property && $noticeAndEviction->tenant->unit->property->city
                    ? $noticeAndEviction->tenant->unit->property->city->city : null;

                return $noticeAndEviction;
            });
    }
}
