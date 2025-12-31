<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Change set for `applications` table:
     *  - Add nullable `applicant_applied_from` (string)
     *  - Make `co_signer` nullable (without needing doctrine/dbal)
     *  - Convert `attachment_name` and `attachment_path` from VARCHAR(255) -> JSON
     *      using a safe 4-step plan (add *_json, backfill, drop old, rename)
     */
    public function up(): void
    {
        /**
         * Step A: Add the new column, and create parallel JSON columns.
         * We keep originals in place for now so we can backfill safely.
         */
        Schema::table('applications', function (Blueprint $table) {
            // New nullable column where applicants came from (e.g., "Website", "Zillow", "Referral")
            $table->string('applicant_applied_from')->nullable()->after('status');

            // Parallel JSON columns to hold data from the legacy VARCHAR columns
            // Keep them nullable to preserve original semantics.
            $table->json('attachment_name_json')->nullable()->after('attachment_name');
            $table->json('attachment_path_json')->nullable()->after('attachment_path');
        });

        /**
         * Step B: Backfill JSON columns from legacy VARCHARs.
         * We store the exact legacy strings as valid JSON strings via JSON_QUOTE().
         *  - NULL or empty ('') remains NULL
         *  - Any non-empty string becomes a JSON string (e.g., foo -> "foo")
         *
         * Note: This uses MySQL/MariaDB JSON functions. If your driver is SQLite
         * in CI, this statement can be guarded, but for production MySQL it's ideal.
         */
        DB::statement(<<<'SQL'
            UPDATE applications
            SET
              attachment_name_json = CASE
                  WHEN attachment_name IS NULL OR attachment_name = '' THEN NULL
                  ELSE JSON_QUOTE(attachment_name)
              END,
              attachment_path_json = CASE
                  WHEN attachment_path IS NULL OR attachment_path = '' THEN NULL
                  ELSE JSON_QUOTE(attachment_path)
              END
        SQL);

        /**
         * Step C: Drop legacy VARCHAR columns now that data is copied.
         */
        Schema::table('applications', function (Blueprint $table) {
            $table->dropColumn(['attachment_name', 'attachment_path']);
        });

        /**
         * Step D: Rename *_json columns back to the original names so no app code changes are required.
         */
        Schema::table('applications', function (Blueprint $table) {
            $table->renameColumn('attachment_name_json', 'attachment_name');
            $table->renameColumn('attachment_path_json', 'attachment_path');
        });

        /**
         * Step E: Make `co_signer` nullable without doctrine/dbal.
         * Using raw SQL avoids the need to install the DBAL package.
         */
        try {
            DB::statement("ALTER TABLE applications MODIFY co_signer VARCHAR(255) NULL");
        } catch (\Throwable $e) {
            // If your platform is not MySQL/MariaDB or syntax differs, fall back to Schema::change()
            // (requires doctrine/dbal). We attempt it inside a try so the migration proceeds if available.
            try {
                Schema::table('applications', function (Blueprint $table) {
                    $table->string('co_signer')->nullable()->change();
                });
            } catch (\Throwable $ignored) {
                // If both methods fail, surface an explicit error.
                throw $e;
            }
        }

        /**
         * (Optional) Enforce valid JSON going forward with CHECK constraints (MySQL 8+).
         * Wrapped in try/catch because some hosts disable CHECKs.
         */
        try {
            DB::statement("ALTER TABLE applications ADD CONSTRAINT chk_attachment_name_json CHECK (JSON_VALID(`attachment_name`) OR `attachment_name` IS NULL)");
            DB::statement("ALTER TABLE applications ADD CONSTRAINT chk_attachment_path_json CHECK (JSON_VALID(`attachment_path`) OR `attachment_path` IS NULL)");
        } catch (\Throwable $e) {
            // Ignore if unsupported.
        }
    }

    /**
     * Full rollback:
     *  - Remove JSON CHECKs (if present)
     *  - Recreate legacy VARCHAR columns with *_legacy names
     *  - Backfill strings from current JSON columns
     *  - Drop JSON columns and rename *_legacy back to original names
     *  - Revert `co_signer` to NOT NULL (populate NULLs with '')
     *  - Drop `applicant_applied_from`
     */
    public function down(): void
    {
        // Drop JSON CHECK constraints first to avoid conflicts on column changes
        foreach (['chk_attachment_name_json', 'chk_attachment_path_json'] as $chk) {
            try {
                DB::statement("ALTER TABLE applications DROP CONSTRAINT {$chk}");
            } catch (\Throwable $e) {
                // MySQL vs MariaDB vs hosting variance; ignore if not present.
            }
        }

        /**
         * Recreate legacy VARCHAR columns (temporary *_legacy) to hold plain strings again.
         */
        Schema::table('applications', function (Blueprint $table) {
            $table->string('attachment_name_legacy')->nullable()->after('stage_in_progress');
            $table->string('attachment_path_legacy')->nullable()->after('attachment_name_legacy');
        });

        /**
         * Backfill legacy strings FROM current JSON columns.
         * - If column is NULL => keep NULL
         * - If JSON is a string => unquote it (JSON_UNQUOTE)
         * - If JSON is array/object/number/bool: store compact JSON text (fallback) so we don't lose information
         */
        DB::statement(<<<'SQL'
            UPDATE applications
            SET
              attachment_name_legacy = CASE
                  WHEN `attachment_name` IS NULL THEN NULL
                  WHEN JSON_TYPE(`attachment_name`) = 'STRING' THEN JSON_UNQUOTE(`attachment_name`)
                  ELSE JSON_UNQUOTE(JSON_EXTRACT(`attachment_name`, '$')) -- compact JSON value if not a string
              END,
              attachment_path_legacy = CASE
                  WHEN `attachment_path` IS NULL THEN NULL
                  WHEN JSON_TYPE(`attachment_path`) = 'STRING' THEN JSON_UNQUOTE(`attachment_path`)
                  ELSE JSON_UNQUOTE(JSON_EXTRACT(`attachment_path`, '$'))
              END
        SQL);

        /**
         * Drop current JSON columns, then rename *_legacy back to original names.
         */
        Schema::table('applications', function (Blueprint $table) {
            $table->dropColumn(['attachment_name', 'attachment_path']);
        });

        Schema::table('applications', function (Blueprint $table) {
            $table->renameColumn('attachment_name_legacy', 'attachment_name');
            $table->renameColumn('attachment_path_legacy', 'attachment_path');
        });

        /**
         * Revert `co_signer` to NOT NULL as per original schema.
         * First, coerce NULLs to empty string to satisfy the NOT NULL constraint.
         */
        DB::statement("UPDATE applications SET co_signer = '' WHERE co_signer IS NULL");
        try {
            DB::statement("ALTER TABLE applications MODIFY co_signer VARCHAR(255) NOT NULL");
        } catch (\Throwable $e) {
            // Fallback via Schema::change() (requires doctrine/dbal)
            try {
                Schema::table('applications', function (Blueprint $table) {
                    $table->string('co_signer')->nullable(false)->default('')->change();
                });
            } catch (\Throwable $ignored) {
                throw $e;
            }
        }

        /**
         * Finally, drop the added `applicant_applied_from` column.
         */
        Schema::table('applications', function (Blueprint $table) {
            $table->dropColumn('applicant_applied_from');
        });
    }
};
