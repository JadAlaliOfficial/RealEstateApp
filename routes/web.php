<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PropertyInfoWithoutInsuranceController;
use App\Http\Controllers\VendorInfoController;
use App\Http\Controllers\TenantController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\VendorTaskTrackerController;
use App\Http\Controllers\MoveInController;
use App\Http\Controllers\CityController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\DashboardController;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::resource('roles', RoleController::class);

    // Main dashboard page - handles all states
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Optional: Specific routes for direct linking with parameters
    Route::get('/dashboard/city/{city_id}', [DashboardController::class, 'getProperties'])->name('dashboard.properties');
    Route::get('/dashboard/city/{city_id}/property/{property_id}', [DashboardController::class, 'getUnits'])->name('dashboard.units');
    Route::get('/dashboard/city/{city_id}/property/{property_id}/unit/{unit_id}', [DashboardController::class, 'getUnitInfo'])->name('dashboard.unit-info');

    Route::get('/all-properties/import', [PropertyInfoWithoutInsuranceController::class, 'showImport'])
        ->name('all-properties.import');
    Route::post('/all-properties/import', [PropertyInfoWithoutInsuranceController::class, 'import'])
        ->name('all-properties.import.store');

    // Units import
    Route::get('/units/import', [UnitController::class, 'showImport'])
        ->name('units.import.show');
    Route::post('/units/import', [UnitController::class, 'import'])
        ->name('units.import');

    // Tenants
    Route::resource('tenants', TenantController::class);
    Route::patch('/tenants/{tenant}/archive', [TenantController::class, 'archive'])
        ->name('tenants.archive')
        ->middleware('permission:tenants.destroy');

    /**
     * Additional tenant helper & import routes
     */
    Route::get('tenants/units-by-property', [TenantController::class, 'getUnitsByProperty'])
        ->name('tenants.units-by-property');

    Route::get('tenants/import/form', [TenantController::class, 'import'])
        ->name('tenants.import');

    Route::post('tenants/import/process', [TenantController::class, 'processImport'])
        ->name('tenants.import.process');

    Route::get('tenants/import/template', [TenantController::class, 'downloadTemplate'])
        ->name('tenants.import.template');

    Route::resource('all-properties', PropertyInfoWithoutInsuranceController::class);

    // Units
    Route::resource('units', UnitController::class);

    // Vendor Task Tracker
    Route::resource('vendor-task-tracker', VendorTaskTrackerController::class);
    Route::patch('/vendor-task-tracker/{vendorTaskTracker}/hide', [VendorTaskTrackerController::class, 'hide'])
        ->name('vendor-task-tracker.hide');
    Route::patch('/vendor-task-tracker/{vendorTaskTracker}/unhide', [VendorTaskTrackerController::class, 'unhide'])
        ->name('vendor-task-tracker.unhide');

    // Move In
    Route::resource('move-in', MoveInController::class)->except(['create', 'edit', 'show']);

    Route::patch('/move-in/{moveIn}/hide', [MoveInController::class, 'hide'])->name('move-in.hide');
    Route::patch('/move-in/{moveIn}/unhide', [MoveInController::class, 'unhide'])->name('move-in.unhide');

    // Vendors
    Route::resource('vendors', VendorInfoController::class);

    // Cities
    Route::get('cities', [CityController::class, 'index'])->name('cities.index');
    Route::post('cities', [CityController::class, 'store'])->name('cities.store');
    Route::delete('cities/{city}', [CityController::class, 'destroy'])->name('cities.destroy');

    // Users
    Route::resource('users', UserController::class);
});

// Additional route files
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
