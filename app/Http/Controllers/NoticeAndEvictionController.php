<?php


namespace App\Http\Controllers;


use App\Http\Requests\NoticeAndEvictionRequest;
use App\Models\NoticeAndEviction;
use App\Services\NoticeAndEvictionService;
use App\Models\Tenant;
use App\Models\Notice;
use App\Models\Cities;
use App\Models\PropertyInfoWithoutInsurance;
use App\Models\Unit;
use Inertia\Inertia;
use Illuminate\Http\Request;


class NoticeAndEvictionController extends Controller
{
    protected $service;


    public function __construct(NoticeAndEvictionService $service)
    {
        $this->service = $service;


        $this->middleware('permission:notice-and-evictions.index')->only('index');
        $this->middleware('permission:notice-and-evictions.create')->only('create');
        $this->middleware('permission:notice-and-evictions.store')->only('store');
        $this->middleware('permission:notice-and-evictions.show')->only('show');
        $this->middleware('permission:notice-and-evictions.edit')->only('edit');
        $this->middleware('permission:notice-and-evictions.update')->only('update');
        $this->middleware('permission:notice-and-evictions.destroy')->only('destroy');
    }


    public function index(Request $request)
    {
        // Get all non-archived records and update their evictions status
        $recordsToUpdate = NoticeAndEviction::with(['tenant.unit.property.city'])
            ->where('is_archived', false)
            ->get();

        foreach ($recordsToUpdate as $record) {
            if ($record->have_an_exception === 'Yes') {
                $record->evictions = 'Have An Exception';
            } elseif ($record->type_of_notice && $record->date) {
                $notice = Notice::where('notice_name', $record->type_of_notice)->first();
                if ($notice) {
                    $days = $notice->days;
                    $alertDate = \Carbon\Carbon::parse($record->date)->addDays($days);
                    if ($alertDate->lessThanOrEqualTo(now())) {
                        $record->evictions = 'Alert';
                    } else {
                        $record->evictions = '';
                    }
                }
            }
            $record->save();
        }


        // Prepare filters array from request
        // Check query parameters first, then fallback to request body for flexibility
        $filters = [
            'city_id' => $request->query('city_id') ?? $request->input('city_id'),
            'property_id' => $request->query('property_id') ?? $request->input('property_id'),
            'unit_id' => $request->query('unit_id') ?? $request->input('unit_id'),
            'tenant_id' => $request->query('tenant_id') ?? $request->input('tenant_id'),
            'city_name' => $request->query('city_name') ?? $request->input('city_name'),
            'property_name' => $request->query('property_name') ?? $request->input('property_name'),
            'unit_name' => $request->query('unit_name') ?? $request->input('unit_name'),
            'tenant_name' => $request->query('tenant_name') ?? $request->input('tenant_name'),
            'search' => $request->query('search') ?? $request->input('search'),
        ];


        // Get pagination parameters from query string or request body
        $perPage = $request->query('per_page') ?? $request->input('per_page') ?? 15;
        $page = $request->query('page') ?? $request->input('page') ?? 1;


        // Get filtered records - explicitly exclude archived records
        $query = NoticeAndEviction::with(['tenant.unit.property.city'])
            ->where('is_archived', false);
        $query = $this->service->applyFilters($query, $filters);


        // Handle pagination
        if ($perPage === 'all') {
            $paginatedRecords = $query->get();
            $records = $paginatedRecords->map(fn($record) => $this->mapRecordToArray($record));
            $paginationData = [
                'data' => $records,
                'current_page' => 1,
                'per_page' => $paginatedRecords->count(),
                'total' => $paginatedRecords->count(),
                'last_page' => 1,
                'from' => 1,
                'to' => $paginatedRecords->count(),
            ];
        } else {
            $perPageInt = (int) $perPage;
            $paginatedRecords = $query->paginate($perPageInt, ['*'], 'page', $page);
            $records = $paginatedRecords->map(fn($record) => $this->mapRecordToArray($record))->toArray();
            $paginationData = [
                'data' => $records,
                'current_page' => $paginatedRecords->currentPage(),
                'per_page' => $paginatedRecords->perPage(),
                'total' => $paginatedRecords->total(),
                'last_page' => $paginatedRecords->lastPage(),
                'from' => $paginatedRecords->firstItem(),
                'to' => $paginatedRecords->lastItem(),
            ];
        }


        // Get data for dropdowns
        $cities = Cities::select('id', 'city')->get();
        $properties = PropertyInfoWithoutInsurance::with('city:id,city')
            ->select('id', 'city_id', 'property_name')
            ->get()
            ->map(function ($property) {
                return [
                    'id' => $property->id,
                    'city_id' => $property->city_id,
                    'property_name' => $property->property_name,
                    'city_name' => $property->city?->city ?? 'N/A',
                ];
            });


        $units = Unit::with(['property.city:id,city'])
            ->select('id', 'property_id', 'unit_name')
            ->get()
            ->map(function ($unit) {
                return [
                    'id' => $unit->id,
                    'property_id' => $unit->property_id,
                    'unit_name' => $unit->unit_name,
                    'property_name' => $unit->property?->property_name ?? 'N/A',
                    'city_name' => $unit->property?->city?->city ?? 'N/A',
                ];
            });


        $tenants = Tenant::with(['unit.property.city'])
            ->select('id', 'unit_id', 'first_name', 'last_name')
            ->where('is_archived', false)
            ->get()
            ->map(function ($tenant) {
                return [
                    'id' => $tenant->id,
                    'unit_id' => $tenant->unit_id,
                    'first_name' => $tenant->first_name,
                    'last_name' => $tenant->last_name,
                    'full_name' => $tenant->first_name . ' ' . $tenant->last_name,
                    'unit_name' => $tenant->unit?->unit_name ?? 'N/A',
                    'property_name' => $tenant->unit?->property?->property_name ?? 'N/A',
                    'city_name' => $tenant->unit?->property?->city?->city ?? 'N/A',
                ];
            });


        $notices = Notice::select('id', 'notice_name', 'days')
            ->where('is_archived', false)
            ->get();


        return Inertia::render('NoticeAndEvictions/Index', [
            'paginatedRecords' => $paginationData,
            'cities' => $cities,
            'properties' => $properties,
            'units' => $units,
            'tenants' => $tenants,
            'notices' => $notices,
            'filters' => $filters,
            'pagination' => [
                'current_page' => $paginationData['current_page'],
                'per_page' => $paginationData['per_page'],
                'total' => $paginationData['total'],
                'last_page' => $paginationData['last_page'],
            ],
        ]);
    }


    public function store(NoticeAndEvictionRequest $request)
    {
        // Create the record using only validated entity data
        $nev = $this->service->create($request->getValidatedData());

        // Get pagination/filter parameters for redirect
        $redirectParams = $this->getRedirectParams($request);

        return redirect()->route('notice_and_evictions.index', $redirectParams)
            ->with('success', 'Created successfully.');
    }


    public function show(NoticeAndEviction $notice_and_eviction, Request $request)
    {
        $notice_and_eviction->load(['tenant.unit.property.city']);
        $recordData = $this->mapRecordToArray($notice_and_eviction);

        // Get filters from query string or request body
        $filters = [
            'city_id' => $request->query('city_id') ?? $request->input('city_id'),
            'property_id' => $request->query('property_id') ?? $request->input('property_id'),
            'unit_id' => $request->query('unit_id') ?? $request->input('unit_id'),
            'tenant_id' => $request->query('tenant_id') ?? $request->input('tenant_id'),
            'city_name' => $request->query('city_name') ?? $request->input('city_name'),
            'property_name' => $request->query('property_name') ?? $request->input('property_name'),
            'unit_name' => $request->query('unit_name') ?? $request->input('unit_name'),
            'tenant_name' => $request->query('tenant_name') ?? $request->input('tenant_name'),
            'search' => $request->query('search') ?? $request->input('search'),
        ];

        // Remove null/empty filters
        $filters = array_filter($filters);

        // IMPORTANT: Pass filters to getNavigationRecords
        $navigation = $this->service->getNavigationRecords(
            $notice_and_eviction->id,
            $filters  // Include filters here
        );

        // Build filter query string for navigation links
        $filterQueryString = http_build_query(array_filter([
            'city_id' => $request->query('city_id') ?? $request->input('city_id'),
            'property_id' => $request->query('property_id') ?? $request->input('property_id'),
            'unit_id' => $request->query('unit_id') ?? $request->input('unit_id'),
            'tenant_id' => $request->query('tenant_id') ?? $request->input('tenant_id'),
            'city_name' => $request->query('city_name') ?? $request->input('city_name'),
            'property_name' => $request->query('property_name') ?? $request->input('property_name'),
            'unit_name' => $request->query('unit_name') ?? $request->input('unit_name'),
            'tenant_name' => $request->query('tenant_name') ?? $request->input('tenant_name'),
            'search' => $request->query('search') ?? $request->input('search'),
        ]));

        return Inertia::render('NoticeAndEvictions/Show', [
            'record' => $recordData,
            'navigation' => $navigation,
            'filters' => $filters,
            'filterQueryString' => $filterQueryString ? '?' . $filterQueryString : '',
        ]);
    }



    public function update(NoticeAndEvictionRequest $request, NoticeAndEviction $notice_and_eviction)
    {
        // Update the record using only validated entity data
        $this->service->update($notice_and_eviction, $request->getValidatedData());

        // Get pagination/filter parameters for redirect
        $redirectParams = $this->getRedirectParams($request);

        return redirect()->route('notice_and_evictions.index', $redirectParams)
            ->with('success', 'Updated successfully.');
    }


    public function destroy(NoticeAndEvictionRequest $request, NoticeAndEviction $notice_and_eviction)
    {
        $this->service->delete($notice_and_eviction);

        // Get pagination/filter parameters for redirect
        $redirectParams = $this->getRedirectParams($request);

        return redirect()->route('notice_and_evictions.index', $redirectParams)
            ->with('success', 'Deleted successfully.');
    }


    /**
     * Map record to array format for response
     */
    private function mapRecordToArray(NoticeAndEviction $record): array
    {
        return [
            'id' => $record->id,
            'tenant_id' => $record->tenant_id,
            'unit_name' => $record->tenant?->unit?->unit_name ?? 'N/A',
            'city_name' => $record->tenant?->unit?->property?->city?->city ?? 'N/A',
            'property_name' => $record->tenant?->unit?->property?->property_name ?? 'N/A',
            'tenants_name' => $record->tenant ? $record->tenant->first_name . ' ' . $record->tenant->last_name : 'N/A',
            'status' => $record->status,
            'date' => $record->date,
            'type_of_notice' => $record->type_of_notice,
            'have_an_exception' => $record->have_an_exception,
            'note' => $record->note,
            'evictions' => $record->evictions,
            'sent_to_atorney' => $record->sent_to_atorney,
            'hearing_dates' => $record->hearing_dates,
            'evected_or_payment_plan' => $record->evected_or_payment_plan,
            'if_left' => $record->if_left,
            'writ_date' => $record->writ_date,
            'other_tenants' => $record->other_tenants,
            'created_at' => $record->created_at,
            'updated_at' => $record->updated_at,
        ];
    }


    /**
     * Get redirect parameters from query string only
     * This preserves only actual filter parameters, not form submission data
     */
    private function getRedirectParams(Request $request): array
    {
        return array_filter([
            'page' => $request->query('page'),
            'per_page' => $request->query('per_page'),
            'city_id' => $request->query('city_id'),
            'property_id' => $request->query('property_id'),
            'unit_id' => $request->query('unit_id'),
            'tenant_id' => $request->query('tenant_id'),
            'city_name' => $request->query('city_name'),
            'property_name' => $request->query('property_name'),
            'unit_name' => $request->query('unit_name'),
            'tenant_name' => $request->query('tenant_name'),
            'search' => $request->query('search'),
        ]);
    }
}
