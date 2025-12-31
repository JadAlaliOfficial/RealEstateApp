<?php

namespace App\Services;

use App\Models\Cities;

class CityService
{
    public function create(array $data): Cities
    {
        return Cities::create($data);
    }

    public function delete(Cities $city): bool
    {
        return $city->archive();
    }

    public function listAll()
    {
        return Cities::all();
    }
}
