<?php
// app/Services/TenantImportService.php

namespace App\Services;

use App\Models\Tenant;
use App\Models\PropertyInfoWithoutInsurance;
use App\Models\Unit;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class TenantImportService
{
    protected array $errors = [];
    protected array $warnings = [];
    protected int $successCount = 0;
    protected int $errorCount = 0;
    protected int $duplicateCount = 0;

    public function importFromCsv(UploadedFile $file, bool $skipDuplicates = false): array
    {
        $this->resetCounters();

        try {
            $csvData = $this->parseCsvFile($file);
            
            if (empty($csvData)) {
                throw new \Exception('No data found in the CSV file.');
            }

            $this->processImportData($csvData, $skipDuplicates);

            return [
                'success' => true,
                'message' => $this->generateSuccessMessage(),
                'stats' => [
                    'total_processed' => count($csvData),
                    'successful_imports' => $this->successCount,
                    'errors' => $this->errorCount,
                    'duplicates' => $this->duplicateCount,
                ],
                'errors' => $this->errors,
                'warnings' => $this->warnings,
            ];

        } catch (\Exception $e) {
            Log::error('Tenant import failed: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Import failed: ' . $e->getMessage(),
                'stats' => [
                    'total_processed' => 0,
                    'successful_imports' => 0,
                    'errors' => 0,
                    'duplicates' => 0,
                ],
                'errors' => [$e->getMessage()],
                'warnings' => [],
            ];
        }
    }

    protected function parseCsvFile(UploadedFile $file): array
    {
        $handle = fopen($file->getPathname(), 'r');
        
        if (!$handle) {
            throw new \Exception('Unable to open the CSV file.');
        }

        $csvData = [];
        $headers = null;
        $rowNumber = 0;

        while (($row = fgetcsv($handle)) !== false) {
            $rowNumber++;
            
            if ($rowNumber === 1) {
                $headers = array_map('trim', $row);
                continue;
            }

            if (empty($headers)) {
                continue;
            }

            // Skip empty rows
            if (empty(array_filter($row))) {
                continue;
            }

            $csvData[] = array_combine($headers, array_pad($row, count($headers), null));
        }

        fclose($handle);

        return $csvData;
    }

    protected function processImportData(array $csvData, bool $skipDuplicates): void
    {
        foreach ($csvData as $index => $row) {
            $rowNumber = $index + 2; // +2 because we start from row 2 (after headers)
            
            try {
                $tenantData = $this->mapCsvRowToTenantData($row, $rowNumber);
                
                if (empty($tenantData)) {
                    continue; // Skip rows with no essential data
                }

                // Check for duplicates
                if ($this->isDuplicate($tenantData)) {
                    if ($skipDuplicates) {
                        $this->duplicateCount++;
                        $this->warnings[] = "Row {$rowNumber}: Duplicate tenant skipped - {$tenantData['first_name']} {$tenantData['last_name']}";
                        continue;
                    } else {
                        $this->errorCount++;
                        $this->errors[] = "Row {$rowNumber}: Duplicate tenant found - {$tenantData['first_name']} {$tenantData['last_name']}";
                        continue;
                    }
                }

                // Validate the tenant data
                $validationResult = $this->validateTenantData($tenantData, $rowNumber);
                
                if (!$validationResult['valid']) {
                    $this->errorCount++;
                    $this->errors = array_merge($this->errors, $validationResult['errors']);
                    continue;
                }

                // Create the tenant
                $tenant = Tenant::create($tenantData);
                
                // Update unit calculations after creating tenant
                Unit::updateApplicationCountForUnit($tenantData['unit_id']);
                
                $this->successCount++;

            } catch (\Exception $e) {
                $this->errorCount++;
                $this->errors[] = "Row {$rowNumber}: " . $e->getMessage();
                Log::error("Error importing tenant at row {$rowNumber}: " . $e->getMessage());
            }
        }
    }

    protected function mapCsvRowToTenantData(array $row, int $rowNumber): array
    {
        $propertyName = trim($row['Property name'] ?? '');
        $unitName = trim($row['Unit number'] ?? '');
        $firstName = trim($row['First name'] ?? '');
        $lastName = trim($row['Last name'] ?? '');

        // Skip if essential data is missing
        if (empty($propertyName) || empty($unitName) || empty($firstName) || empty($lastName)) {
            $this->warnings[] = "Row {$rowNumber}: Skipped due to missing essential data (property, unit, first name, or last name)";
            return [];
        }

        // Find the unit_id by looking up property and unit
        $property = PropertyInfoWithoutInsurance::where('property_name', $propertyName)->first();
        if (!$property) {
            throw new \Exception("Property '{$propertyName}' not found");
        }

        $unit = Unit::where('property_id', $property->id)
                    ->where('unit_name', $unitName)
                    ->first();
        
        if (!$unit) {
            throw new \Exception("Unit '{$unitName}' not found in property '{$propertyName}'");
        }

        return [
            'unit_id' => $unit->id,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'street_address_line' => trim($row['Street address line 1'] ?? '') ?: null,
            'login_email' => !empty(trim($row['Login email'] ?? '')) ? trim($row['Login email']) : null,
            'alternate_email' => !empty(trim($row['Alternate email'] ?? '')) ? trim($row['Alternate email']) : null,
            'mobile' => !empty(trim($row['Mobile'] ?? '')) ? trim($row['Mobile']) : null,
            'emergency_phone' => !empty(trim($row['Emergency phone'] ?? '')) ? trim($row['Emergency phone']) : null,
            'cash_or_check' => null,
            'has_insurance' => null,
            'sensitive_communication' => null,
            'has_assistance' => null,
            'assistance_amount' => null,
            'assistance_company' => null,
        ];
    }

    protected function validateTenantData(array $data, int $rowNumber): array
    {
        $errors = [];
        
        // Validate unit exists and is not archived
        $unit = Unit::withArchived()->find($data['unit_id']);
        if (!$unit) {
            $errors[] = "Row {$rowNumber}: Unit with ID '{$data['unit_id']}' does not exist";
        } elseif ($unit->is_archived) {
            $errors[] = "Row {$rowNumber}: Unit is archived and cannot be assigned";
        }

        // Validate email formats
        if (!empty($data['login_email']) && !filter_var($data['login_email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = "Row {$rowNumber}: Invalid login email format: {$data['login_email']}";
        }

        if (!empty($data['alternate_email']) && !filter_var($data['alternate_email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = "Row {$rowNumber}: Invalid alternate email format: {$data['alternate_email']}";
        }

        // Validate required fields according to StoreTenantRequest
        if (empty($data['first_name'])) {
            $errors[] = "Row {$rowNumber}: First name is required";
        }

        if (empty($data['last_name'])) {
            $errors[] = "Row {$rowNumber}: Last name is required";
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    protected function isDuplicate(array $tenantData): bool
    {
        return Tenant::where('unit_id', $tenantData['unit_id'])
            ->where('first_name', $tenantData['first_name'])
            ->where('last_name', $tenantData['last_name'])
            ->exists();
    }

    protected function resetCounters(): void
    {
        $this->errors = [];
        $this->warnings = [];
        $this->successCount = 0;
        $this->errorCount = 0;
        $this->duplicateCount = 0;
    }

    protected function generateSuccessMessage(): string
    {
        $message = "Import completed. {$this->successCount} tenants imported successfully";
        
        if ($this->errorCount > 0) {
            $message .= ", {$this->errorCount} errors";
        }
        
        if ($this->duplicateCount > 0) {
            $message .= ", {$this->duplicateCount} duplicates skipped";
        }
        
        return $message . ".";
    }

    public function getImportTemplate(): array
    {
        return [
            'Property name',
            'Unit number',
            'First name',
            'Last name',
            'Street address line 1',
            'Login email',
            'Alternate email',
            'Mobile',
            'Emergency phone'
        ];
    }
}
