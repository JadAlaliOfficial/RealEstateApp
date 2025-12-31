<?php

namespace App\Http\Controllers;

use App\Http\Requests\CityRequest;
use App\Models\Cities;
use App\Services\CityService;
use Inertia\Inertia;

class CityController extends Controller
{
    protected $service;

    public function __construct(CityService $service)
    {
        $this->service = $service;

        $this->middleware('permission:cities.index')->only('index');
        $this->middleware('permission:cities.store')->only('store');
        $this->middleware('permission:cities.destroy')->only('destroy');
    }

    public function index()
    {
        $cities = $this->service->listAll();
        return Inertia::render('Cities/Index', ['cities' => $cities]);
    }

    public function store(CityRequest $request)
    {
        $this->service->create($request->validated());
        return redirect()->route('cities.index')->with('success', 'City created successfully.');
    }

    public function destroy(Cities $city)
    {
        $this->service->delete($city);
        return redirect()->route('cities.index')->with('success', 'City deleted successfully.');
    }
}
