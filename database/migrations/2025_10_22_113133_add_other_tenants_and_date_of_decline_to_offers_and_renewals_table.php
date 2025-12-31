<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('offers_and_renewals', function (Blueprint $table) {
            $table->string('other_tenants')->nullable();
            $table->date('date_of_decline')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('offers_and_renewals', function (Blueprint $table) {
            $table->dropColumn(['other_tenants', 'date_of_decline']);
        });
    }
};
