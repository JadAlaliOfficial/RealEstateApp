<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private DashboardService $dashboardService
    ) {}

    /**
     * Display the dashboard page
     */
    public function index(Request $request): Response
    {
        $properties = $this->dashboardService->getAllProperties();
        $units = [];
        $unitInfo = null;
        $tenants = [];
        $moveIns = [];
        $moveOuts = [];
        $vendorTasks = [];
        $payments = [];
        $paymentPlans = [];
        $applications = [];
        $offersAndRenewals = [];
        $noticesAndEvictions = [];

        // Load units if property is selected
        if ($request->has('property_id') && $request->property_id) {
            $units = $this->dashboardService->getUnitsByProperty((int)$request->property_id);
        }

        // Load all data if unit is selected
        if ($request->has('unit_id') && $request->unit_id) {
            $unitInfo = $this->dashboardService->getUnitInfo((int)$request->unit_id);
            $tenants = $this->dashboardService->getAllTenantInfoByUnit((int)$request->unit_id);
            $moveIns = $this->dashboardService->getAllMoveInInfoByUnit((int)$request->unit_id);
            $moveOuts = $this->dashboardService->getAllMoveOutInfoByUnit((int)$request->unit_id);
            $vendorTasks = $this->dashboardService->getAllVendorTaskInfoByUnit((int)$request->unit_id);
            $payments = $this->dashboardService->getAllPaymentInfoByUnit((int)$request->unit_id);
            $paymentPlans = $this->dashboardService->getAllPaymentPlanInfoByUnit((int)$request->unit_id);
            $applications = $this->dashboardService->getAllApplicationInfoByUnit((int)$request->unit_id);
            $offersAndRenewals = $this->dashboardService->getAllOffersAndRenewalsInfoByUnit((int)$request->unit_id);
            $noticesAndEvictions = $this->dashboardService->getAllNoticesAndEvictionsInfoByUnit((int)$request->unit_id);
        }

        return Inertia::render('dashboard', [
            'properties' => $properties,
            'units' => $units,
            'unitInfo' => $unitInfo,
            'tenants' => $tenants,
            'moveIns' => $moveIns,
            'moveOuts' => $moveOuts,
            'vendorTasks' => $vendorTasks,
            'payments' => $payments,
            'paymentPlans' => $paymentPlans,
            'applications' => $applications,
            'offersAndRenewals' => $offersAndRenewals,
            'noticesAndEvictions' => $noticesAndEvictions,
            'selectedPropertyId' => $request->property_id ? (int)$request->property_id : null,
            'selectedUnitId' => $request->unit_id ? (int)$request->unit_id : null,
        ]);
    }

    /**
     * Get properties for a specific city (fallback route)
     */
    public function getProperties(Request $request): Response
    {
        return $this->index($request);
    }

    /**
     * Get units for a specific property (fallback route)
     */
    public function getUnits(Request $request): Response
    {
        $request->validate([
            'property_id' => 'required|integer|exists:property_info_without_insurance,id'
        ]);

        return $this->index($request);
    }

    /**
     * Get unit information (fallback route)
     */
    public function getUnitInfo(Request $request): Response
    {
        $request->validate([
            'unit_id' => 'required|integer|exists:units,id',
            'property_id' => 'required|integer|exists:property_info_without_insurance,id'
        ]);

        return $this->index($request);
    }
}
