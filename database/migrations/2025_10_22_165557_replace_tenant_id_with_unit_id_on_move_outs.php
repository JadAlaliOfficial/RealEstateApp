<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('move_outs', function (Blueprint $table) {
            // Drop old FK + column in one go (drops related index too)
            $table->dropConstrainedForeignId('tenant_id');

            // Add the new FK
            $table->foreignId('unit_id')
                ->nullable()
                ->constrained('units')
                ->nullOnDelete();

            // If you still want explicit indexes like in your create migration:
            $table->index('unit_id');
        });
    }

    public function down(): void
    {
        Schema::table('move_outs', function (Blueprint $table) {
            // Revert back if needed
            $table->dropConstrainedForeignId('unit_id');

            $table->foreignId('tenant_id')
                ->nullable()
                ->constrained('tenants')
                ->nullOnDelete();

            $table->index('tenant_id');
        });
    }
};
