<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePropertyInfoWithoutInsuranceRequest;
use App\Http\Requests\UpdatePropertyInfoWithoutInsuranceRequest;
use App\Http\Requests\ImportPropertyCsvRequest;
use App\Services\PropertyInfoWithoutInsuranceService;
use App\Services\CsvImportService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PropertyInfoWithoutInsuranceController extends Controller
{
    protected PropertyInfoWithoutInsuranceService $service;
    protected CsvImportService $csvImportService;

    public function __construct(PropertyInfoWithoutInsuranceService $service, CsvImportService $csvImportService)
    {
        $this->service = $service;
        $this->csvImportService = $csvImportService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->search,
            'city_filter' => $request->city_filter,
        ];

        $properties = $this->service->getAllPaginated(100, $filters);
        $cities = $this->service->getAllCities();

        return Inertia::render('PropertyInfoWithoutInsurance/Index', [
            'properties' => $properties,
            'cities' => $cities,
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $cities = $this->service->getAllCities();
        
        return Inertia::render('PropertyInfoWithoutInsurance/Index', [
            'cities' => $cities,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePropertyInfoWithoutInsuranceRequest $request): RedirectResponse
    {
        try {
            $this->service->create($request->validated());

            return redirect()->route('all-properties.index')
                ->with('success', 'Property created successfully');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to create property: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): Response
    {
        $property = $this->service->findById($id);

        return Inertia::render('PropertyInfoWithoutInsurance/Index', [
            'property' => $property,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id): Response
    {
        $property = $this->service->findById($id);
        $cities = $this->service->getAllCities();

        return Inertia::render('PropertyInfoWithoutInsurance/Index', [
            'property' => $property,
            'cities' => $cities,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePropertyInfoWithoutInsuranceRequest $request, string $id): RedirectResponse
    {
        try {
            $property = $this->service->findById($id);
            $this->service->update($property, $request->validated());

            return redirect()->route('all-properties.index')
                ->with('success', 'Property updated successfully');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to update property: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): RedirectResponse
    {
        try {
            $property = $this->service->findById($id);
            $this->service->delete($property);

            return redirect()->route('all-properties.index')
                ->with('success', 'Property deleted successfully');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to delete property: ' . $e->getMessage());
        }
    }

    /**
     * Get properties by city (API endpoint for frontend)
     */
    public function getByCity(string $cityId)
    {
        $properties = $this->service->getByCity($cityId);
        return response()->json($properties);
    }

     /**
     * Show import form
     */
    public function showImport(): Response
    {
        return Inertia::render('PropertyInfoWithoutInsurance/Import');
    }

    /**
     * Handle CSV import
     */
    public function import(ImportPropertyCsvRequest $request): RedirectResponse
    {
        try {
            $results = $this->csvImportService->importFromCsv($request->file('csv_file'));

            if ($results['success']) {
                return redirect()->route('all-properties.index')
                    ->with('success', $results['message'])
                    ->with('import_stats', $results['stats']);
            } else {
                return redirect()->back()
                    ->with('error', $results['message'])
                    ->with('import_stats', $results['stats']);
            }
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Import failed: ' . $e->getMessage());
        }
    }
}
