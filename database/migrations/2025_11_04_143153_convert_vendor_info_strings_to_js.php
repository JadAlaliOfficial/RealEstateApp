<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Safely convert legacy VARCHAR columns to JSON:
     *   - number (VARCHAR)       -> number (JSON string)       // e.g. "12345"
     *   - email  (VARCHAR)       -> email  (JSON string)       // e.g. "user@site.com"
     *   - service_type (VARCHAR) -> service_type (JSON array)  // e.g. ["Plumbing","Electrical"]
     *
     * Steps:
     * 1) Add parallel *_json columns (JSON).
     * 2) Backfill from legacy strings into valid JSON.
     * 3) Drop legacy VARCHAR columns.
     * 4) Rename *_json back to original names (no app code changes needed).
     */
    public function up(): void
    {
        Schema::table('vendors_info', function (Blueprint $table) {
            // 1) New JSON columns (nullable like originals)
            $table->json('number_json')->nullable()->after('vendor_name');
            $table->json('email_json')->nullable()->after('number_json');
            $table->json('service_type_json')->nullable()->after('email_json');
        });

        // 2) Backfill:
        // - number/email: store as JSON strings via JSON_QUOTE()
        // - service_type: comma-separated string -> JSON array
        DB::statement(<<<'SQL'
            UPDATE vendors_info
            SET
              number_json = CASE
                  WHEN number IS NULL OR number = '' THEN NULL
                  ELSE JSON_EXTRACT(CONCAT('["', REPLACE(number, ',', '","'), '"]'), '$')
              END,
              email_json = CASE
                  WHEN email IS NULL OR email = '' THEN NULL
                  ELSE JSON_EXTRACT(CONCAT('["', REPLACE(email, ',', '","'), '"]'), '$')
              END,
              service_type_json = CASE
                  WHEN service_type IS NULL OR service_type = '' THEN NULL
                  ELSE JSON_EXTRACT(CONCAT('["', REPLACE(service_type, ',', '","'), '"]'), '$')
              END
        SQL);

        Schema::table('vendors_info', function (Blueprint $table) {
            // 3) Drop the old VARCHAR columns (data already copied)
            $table->dropColumn(['number', 'email', 'service_type']);
        });

        Schema::table('vendors_info', function (Blueprint $table) {
            // 4) Rename JSON columns to original names
            $table->renameColumn('number_json', 'number');
            $table->renameColumn('email_json', 'email');
            $table->renameColumn('service_type_json', 'service_type');
        });

        // Optional: enforce valid JSON going forward (MySQL 8+). Safe to ignore if unsupported.
        try {
            DB::statement("ALTER TABLE vendors_info ADD CONSTRAINT chk_number_json CHECK (JSON_VALID(`number`) OR `number` IS NULL)");
            DB::statement("ALTER TABLE vendors_info ADD CONSTRAINT chk_email_json CHECK (JSON_VALID(`email`) OR `email` IS NULL)");
            DB::statement("ALTER TABLE vendors_info ADD CONSTRAINT chk_service_type_json CHECK (JSON_VALID(`service_type`) OR `service_type` IS NULL)");
        } catch (\Throwable $e) {
            // Host may disable CHECK constraints or not support them; ignore.
        }
    }

    /**
     * Rollback plan:
     * 1) Create temporary *_legacy VARCHAR columns.
     * 2) Extract strings from current JSON columns into *_legacy.
     *    - number/email are JSON strings: unquote them
     *    - service_type is a JSON array: take FIRST element (simple, reversible default)
     * 3) Drop current JSON columns.
     * 4) Rename *_legacy back to the original names (no leftovers).
     * 5) (Safety) Try to drop any stray *_legacy columns if they somehow remain.
     */
    public function down(): void
    {
        // Drop CHECKs first to avoid conflicts
        foreach (['chk_number_json', 'chk_email_json', 'chk_service_type_json'] as $chk) {
            try { DB::statement("ALTER TABLE vendors_info DROP CONSTRAINT {$chk}"); } catch (\Throwable $e) {}
        }

        Schema::table('vendors_info', function (Blueprint $table) {
            // 1) Temporary legacy columns
            $table->string('number_legacy')->nullable()->after('vendor_name');
            $table->string('email_legacy')->nullable()->after('number_legacy');
            $table->string('service_type_legacy')->nullable()->after('email_legacy');
        });

        // 2) Backfill FROM JSON to strings
        DB::statement(<<<'SQL'
            UPDATE vendors_info
            SET
              number_legacy = CASE
                  WHEN `number` IS NULL THEN NULL
                  WHEN JSON_TYPE(`number`) = 'ARRAY' THEN JSON_UNQUOTE(JSON_EXTRACT(`number`, '$[0]'))
                  ELSE JSON_UNQUOTE(`number`)  -- "12345" -> 12345
              END,
              email_legacy = CASE
                  WHEN `email` IS NULL THEN NULL
                  WHEN JSON_TYPE(`email`) = 'ARRAY' THEN JSON_UNQUOTE(JSON_EXTRACT(`email`, '$[0]'))
                  ELSE JSON_UNQUOTE(`email`)   -- "user@site.com" -> user@site.com
              END,
              service_type_legacy = CASE
                  WHEN `service_type` IS NULL THEN NULL
                  WHEN JSON_TYPE(`service_type`) = 'ARRAY' THEN JSON_UNQUOTE(JSON_EXTRACT(`service_type`, '$[0]'))
                  ELSE JSON_UNQUOTE(`service_type`)
              END
        SQL);

        Schema::table('vendors_info', function (Blueprint $table) {
            // 3) Drop current JSON columns
            $table->dropColumn(['number', 'email', 'service_type']);
        });

        Schema::table('vendors_info', function (Blueprint $table) {
            // 4) Rename temp columns back to original names (removes the *_legacy names)
            $table->renameColumn('number_legacy', 'number');
            $table->renameColumn('email_legacy', 'email');
            $table->renameColumn('service_type_legacy', 'service_type');
        });

        // 5) Safety cleanup (should be no-ops): if any *_legacy columns somehow still exist, drop them.
        try {
            Schema::table('vendors_info', function (Blueprint $table) {
                // These will throw if they don't exist; wrap in try/catch above.
                $table->dropColumn(['number_legacy', 'email_legacy', 'service_type_legacy']);
            });
        } catch (\Throwable $e) {
            // If they don't exist (normal case), ignore.
        }
    }
};
