<?php

namespace App\Services;

use App\Models\Cities;
use App\Models\PropertyInfoWithoutInsurance;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class CsvImportService
{
    /**
     * Import properties and cities from CSV file
     */
    public function importFromCsv(UploadedFile $file): array
    {
        $results = [
            'success' => true,
            'message' => '',
            'stats' => [
                'total_rows' => 0,
                'cities_created' => 0,
                'cities_updated' => 0,
                'properties_created' => 0,
                'properties_updated' => 0,
                'errors' => []
            ]
        ];

        try {
            DB::beginTransaction();

            $csvData = $this->parseCsvFile($file);
            $results['stats']['total_rows'] = count($csvData);

            if (empty($csvData)) {
                throw new Exception('CSV file is empty or invalid');
            }

            // First, process all unique cities
            $citiesStats = $this->processCities($csvData);
            $results['stats']['cities_created'] = $citiesStats['created'];
            $results['stats']['cities_updated'] = $citiesStats['updated'];

            // Then, process properties with city relationships
            $propertiesStats = $this->processProperties($csvData);
            $results['stats']['properties_created'] = $propertiesStats['created'];
            $results['stats']['properties_updated'] = $propertiesStats['updated'];
            $results['stats']['errors'] = array_merge($results['stats']['errors'], $propertiesStats['errors']);

            DB::commit();

            $results['message'] = sprintf(
                'Import completed successfully. Cities: %d created, %d updated. Properties: %d created, %d updated.',
                $results['stats']['cities_created'],
                $results['stats']['cities_updated'],
                $results['stats']['properties_created'],
                $results['stats']['properties_updated']
            );
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('CSV Import Error: ' . $e->getMessage());

            $results['success'] = false;
            $results['message'] = 'Import failed: ' . $e->getMessage();
        }

        return $results;
    }

    /**
     * Parse CSV file and return data array
     */
    private function parseCsvFile(UploadedFile $file): array
    {
        $csvData = [];
        $handle = fopen($file->getRealPath(), 'r');

        if ($handle === false) {
            throw new Exception('Unable to read CSV file');
        }

        // Read header row
        $headers = fgetcsv($handle);
        if ($headers === false) {
            fclose($handle);
            throw new Exception('CSV file appears to be empty');
        }

        // Normalize headers (remove BOM, trim spaces, etc.)
        $headers = array_map(function ($header) {
            return trim(str_replace("\xEF\xBB\xBF", '', $header));
        }, $headers);

        // Find required column indexes
        $propertyNameIndex = array_search('Property name', $headers);
        $cityLocalityIndex = array_search('City/Locality', $headers);

        if ($propertyNameIndex === false) {
            fclose($handle);
            throw new Exception('Required column "Property name" not found in CSV');
        }

        if ($cityLocalityIndex === false) {
            fclose($handle);
            throw new Exception('Required column "City/Locality" not found in CSV');
        }

        // Read data rows
        $rowNumber = 1;
        while (($row = fgetcsv($handle)) !== false) {
            $rowNumber++;

            if (count($row) < max($propertyNameIndex, $cityLocalityIndex) + 1) {
                continue; // Skip incomplete rows
            }

            $propertyName = trim($row[$propertyNameIndex] ?? '');
            $cityLocality = trim($row[$cityLocalityIndex] ?? '');

            // Skip empty rows
            if (empty($propertyName) && empty($cityLocality)) {
                continue;
            }

            $csvData[] = [
                'property_name' => $propertyName,
                'city_locality' => $cityLocality,
                'row_number' => $rowNumber
            ];
        }

        fclose($handle);
        return $csvData;
    }

    /**
     * Process and upsert cities
     */
    private function processCities(array $csvData): array
    {
        $stats = ['created' => 0, 'updated' => 0];

        // Get unique cities from CSV data
        $uniqueCities = collect($csvData)
            ->pluck('city_locality')
            ->filter()
            ->unique()
            ->values()
            ->toArray();

        if (empty($uniqueCities)) {
            return $stats;
        }

        // Prepare data for upsert
        $cityData = collect($uniqueCities)->map(function ($city) {
            $normalized = trim($city);
            return [
                'city' => $normalized,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        })->toArray();

        // Get existing cities count
        $existingCitiesCount = Cities::whereIn('city', $uniqueCities)->count();

        // Perform upsert
        Cities::upsert(
            $cityData,
            ['city'], // unique column
            ['updated_at'] // columns to update
        );

        // Calculate stats
        $totalAfterUpsert = Cities::whereIn('city', $uniqueCities)->count();
        $stats['created'] = $totalAfterUpsert - $existingCitiesCount;
        $stats['updated'] = $existingCitiesCount;

        return $stats;
    }

    /**
     * Process and upsert properties
     */
    private function processProperties(array $csvData): array
    {
        $stats = ['created' => 0, 'updated' => 0, 'errors' => []];

        // Get city name to ID mapping
        $cityMap = Cities::pluck('id', 'city')->mapWithKeys(function ($id, $city) {
            return [mb_strtolower(trim($city)) => $id];
        })
            ->toArray();

        $propertyData = [];

        foreach ($csvData as $row) {
            // Skip if property name is empty
            if (empty($row['property_name'])) {
                $stats['errors'][] = "Row {$row['row_number']}: Property name is empty";
                continue;
            }

            $cityId = null;
            if (!empty($row['city_locality'])) {
                $key = mb_strtolower(trim($row['city_locality']));
                $cityId = $cityMap[$key] ?? null;

                if ($cityId === null) {
                    $stats['errors'][] = "Row {$row['row_number']}: City '{$row['city_locality']}' not found";
                    continue;
                }
            }

            $propertyData[] = [
                'property_name' => $row['property_name'],
                'city_id' => $cityId,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        if (empty($propertyData)) {
            return $stats;
        }

        // Get existing properties count
        $existingPropertyNames = collect($propertyData)->pluck('property_name')->toArray();
        $existingPropertiesCount = PropertyInfoWithoutInsurance::whereIn('property_name', $existingPropertyNames)->count();

        // Perform upsert
        PropertyInfoWithoutInsurance::upsert(
            $propertyData,
            ['property_name'], // unique column
            ['city_id', 'updated_at'] // columns to update
        );

        // Calculate stats
        $totalAfterUpsert = PropertyInfoWithoutInsurance::whereIn('property_name', $existingPropertyNames)->count();
        $stats['created'] = $totalAfterUpsert - $existingPropertiesCount;
        $stats['updated'] = $existingPropertiesCount;

        return $stats;
    }
}
