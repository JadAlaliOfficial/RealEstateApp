<?php
// app/Services/UnitImportService.php

namespace App\Services;

use App\Models\Unit;
use App\Models\PropertyInfoWithoutInsurance;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Exception;

class UnitImportService
{
    protected array $errors = [];
    protected array $warnings = [];
    protected int $successCount = 0;
    protected int $errorCount = 0;
    protected int $skippedCount = 0;

    protected function toUtf8(?string $value): ?string
    {
        if ($value === null || $value === '') return $value;

        // strip BOM if present
        $value = preg_replace('/^\xEF\xBB\xBF/', '', $value);

        if (mb_detect_encoding($value, 'UTF-8', true)) {
            return $value;
        }
        // Try common spreadsheet encodings
        $enc = mb_detect_encoding($value, ['Windows-1252', 'ISO-8859-1', 'ISO-8859-15'], true) ?: 'Windows-1252';

        // Convert, dropping unconvertible bytes to avoid crashes
        return iconv($enc, 'UTF-8//IGNORE', $value);
    }

    public function import(UploadedFile $file, array $options = []): array
    {
        $this->resetCounters();

        $skipDuplicates = $options['skip_duplicates'] ?? true;
        $updateExisting = $options['update_existing'] ?? false;

        try {
            $csvData = $this->readCsvFile($file);

            if (empty($csvData)) {
                throw new Exception('CSV file is empty or invalid.');
            }

            return $this->processUnits($csvData, $skipDuplicates, $updateExisting);
        } catch (Exception $e) {
            Log::error('Unit import failed: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Import failed: ' . $e->getMessage(),
                'errors' => [$e->getMessage()],
                'statistics' => $this->getStatistics(),
            ];
        }
    }

    protected function readCsvFile(UploadedFile $file): array
    {
        $csvData = [];
        ini_set('auto_detect_line_endings', '1');

        $handle = fopen($file->getRealPath(), 'r');
        if (!$handle) {
            throw new Exception('Unable to read CSV file.');
        }

        $header = fgetcsv($handle);
        if (!$header) {
            fclose($handle);
            throw new Exception('CSV file has no header row.');
        }

        // Normalize header to UTF-8
        $header = array_map([$this, 'toUtf8'], $header);

        $requiredColumns = ['PropertyName', 'number', 'BedBath', 'Residents', 'LeaseStartRaw', 'LeaseEndRaw', 'rent', 'recurringCharges'];
        $missingColumns = array_diff($requiredColumns, $header);
        if (!empty($missingColumns)) {
            fclose($handle);
            throw new Exception('Missing required columns: ' . implode(', ', $missingColumns));
        }

        $rowNumber = 2;
        while (($row = fgetcsv($handle)) !== false) {
            if (count($row) !== count($header)) {
                $this->warnings[] = $this->toUtf8("Row {$rowNumber}: Column count mismatch, skipping.");
                $rowNumber++;
                continue;
            }

            // Normalize row values to UTF-8
            $row = array_map([$this, 'toUtf8'], $row);

            $csvData[] = array_combine($header, $row);
            $rowNumber++;
        }

        fclose($handle);
        ini_set('auto_detect_line_endings', '0');

        return $csvData;
    }

    protected function processUnits(array $csvData, bool $skipDuplicates, bool $updateExisting): array
    {
        DB::beginTransaction();

        try {
            foreach ($csvData as $index => $row) {
                $rowNumber = $index + 2; // Account for header row
                $unitData = $this->transformCsvRowToUnitData($row, $rowNumber);

                if (!$unitData) {
                    continue; // Skip this row due to validation errors
                }

                $this->processUnit($unitData, $skipDuplicates, $updateExisting, $rowNumber);
            }

            DB::commit();

            return [
                'success' => true,
                'message' => $this->buildSuccessMessage(),
                'errors' => $this->errors,
                'warnings' => $this->warnings,
                'statistics' => $this->getStatistics(),
            ];
        } catch (Exception $e) {
            DB::rollback();
            throw $e;
        }
    }

    protected function transformCsvRowToUnitData(array $row, int $rowNumber): ?array
    {
        try {
            // Get property information using property_id instead of property name
            $propertyName = trim($row['PropertyName']);
            $propertyInfo = PropertyInfoWithoutInsurance::where('property_name', $propertyName)->first();

            if (!$propertyInfo) {
                $this->errors[] = "Row {$rowNumber}: Property '" . $this->toUtf8($propertyName) . "' not found in system.";
                $this->errorCount++;
                return null;
            }

            // Parse bed/bath information
            $bedBathInfo = $this->parseBedBath($row['BedBath']);

            // Parse vacant status
            $isVacant = $this->parseVacantStatus($row['Residents']);

            // Parse dates
            $leaseStart = $this->parseDate($row['LeaseStartRaw']);
            $leaseEnd = $this->parseDate($row['LeaseEndRaw']);

            // Parse rent (use recurringCharges as monthly_rent, rent as backup)
            $monthlyRent = $this->parseRent($row['recurringCharges']) ?: $this->parseRent($row['rent']);

            // Set tenants based on vacant status
            $tenants = $isVacant ? null : trim($row['Residents']);

            // Build unit data matching the Unit model structure
            $unitData = [
                'property_id' => $propertyInfo->id, // Use property_id instead of property name
                'unit_name' => trim($row['number']),
                'tenants' => $tenants,
                'lease_start' => $leaseStart,
                'lease_end' => $leaseEnd,
                'count_beds' => $bedBathInfo['beds'],
                'count_baths' => $bedBathInfo['baths'],
                'lease_status' => null,
                'monthly_rent' => $monthlyRent,
                'recurring_transaction' => null,
                'utility_status' => null,
                'account_number' => null,
                'insurance' => null,
                'insurance_expiration_date' => null,
                'is_archived' => false, // Add the is_archived field
            ];

            // Validate the unit data using the same rules as StoreUnitRequest
            $validator = Validator::make($unitData, [
                'property_id' => 'required|integer|exists:property_info_without_insurance,id',
                'unit_name' => 'required|string|max:255',
                'tenants' => 'nullable|string|max:255',
                'lease_start' => 'nullable|date',
                'lease_end' => 'nullable|date|after_or_equal:lease_start',
                'count_beds' => 'nullable|numeric|min:0|regex:/^\d+(\.\d{1})?$/',
                'count_baths' => 'nullable|numeric|min:0|regex:/^\d+(\.\d{1})?$/',
                'lease_status' => 'nullable|string|max:255',
                'monthly_rent' => 'nullable|numeric|min:0',
                'recurring_transaction' => 'nullable|string|max:255',
                'utility_status' => 'nullable|string|max:255',
                'account_number' => 'nullable|string|max:255',
                'insurance' => 'nullable|in:Yes,No',
                'insurance_expiration_date' => 'nullable|date',
                'is_archived' => 'boolean',
            ]);

            if ($validator->fails()) {
                $this->errors[] = "Row {$rowNumber}: Validation failed - " . implode(', ', $validator->errors()->all());
                $this->errorCount++;
                return null;
            }

            return $unitData;
        } catch (Exception $e) {
            $this->errors[] = "Row {$rowNumber}: Error processing data - " . $e->getMessage();
            $this->errorCount++;
            return null;
        }
    }

    protected function parseBedBath(string $bedBath): array
    {
        $bedBath = trim($bedBath);

        // Handle empty or dash cases
        if (empty($bedBath) || $bedBath === "'- / -" || $bedBath === "- / -") {
            return ['beds' => null, 'baths' => null];
        }

        // Parse patterns like "4 Bed/3.5 Bath" or "3 Bed/1 Bath"
        if (preg_match('/(\d+)\s*Bed\/(\d+(?:\.\d+)?)\s*Bath/', $bedBath, $matches)) {
            return [
                'beds' => (float)$matches[1],
                'baths' => (float)$matches[2]
            ];
        }

        // Parse patterns like "'- /1 Bath"
        if (preg_match('/\'-\s*\/(\d+(?:\.\d+)?)\s*Bath/', $bedBath, $matches)) {
            return [
                'beds' => null,
                'baths' => (float)$matches[1]
            ];
        }

        return ['beds' => null, 'baths' => null];
    }

    protected function parseVacantStatus(string $residents): bool
    {
        $residents = trim($residents);
        return empty($residents) || strtoupper($residents) === 'VACANT';
    }

    protected function parseDate(?string $date): ?string
    {
        if (empty($date) || trim($date) === '') {
            return null;
        }

        try {
            $parsedDate = \Carbon\Carbon::parse($date);
            return $parsedDate->format('Y-m-d');
        } catch (Exception $e) {
            return null;
        }
    }

    protected function parseRent(?string $rent): ?float
    {
        if (empty($rent) || trim($rent) === '') {
            return null;
        }

        // Remove any currency symbols and convert to float
        $cleanRent = preg_replace('/[^\d.]/', '', $rent);
        return $cleanRent ? (float)$cleanRent : null;
    }

    protected function processUnit(array $unitData, bool $skipDuplicates, bool $updateExisting, int $rowNumber): void
    {
        // Check for existing unit using property_id and unit_name (proper way)
        $existingUnit = Unit::withArchived()
            ->where('unit_name', $unitData['unit_name'])
            ->where('property_id', $unitData['property_id'])
            ->first();

        if ($existingUnit) {
            if ($updateExisting) {
                $existingUnit->update($unitData);
                $this->successCount++;
            } elseif ($skipDuplicates) {
                $this->warnings[] = "Row {$rowNumber}: Unit '{$unitData['unit_name']}' in property already exists, skipped.";
                $this->skippedCount++;
            } else {
                $this->errors[] = "Row {$rowNumber}: Unit '{$unitData['unit_name']}' in property already exists.";
                $this->errorCount++;
            }
        } else {
            Unit::create($unitData);
            $this->successCount++;
        }
    }

    protected function resetCounters(): void
    {
        $this->errors = [];
        $this->warnings = [];
        $this->successCount = 0;
        $this->errorCount = 0;
        $this->skippedCount = 0;
    }

    protected function getStatistics(): array
    {
        return [
            'success_count' => $this->successCount,
            'error_count' => $this->errorCount,
            'skipped_count' => $this->skippedCount,
            'total_processed' => $this->successCount + $this->errorCount + $this->skippedCount,
        ];
    }

    protected function buildSuccessMessage(): string
    {
        $parts = [];

        if ($this->successCount > 0) {
            $parts[] = "{$this->successCount} units imported successfully";
        }

        if ($this->skippedCount > 0) {
            $parts[] = "{$this->skippedCount} units skipped";
        }

        if ($this->errorCount > 0) {
            $parts[] = "{$this->errorCount} units failed";
        }

        return implode(', ', $parts) . '.';
    }
}
