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
        Schema::table('properties_info', function (Blueprint $table) {
            // Add notes column
            $table->text('notes')->nullable()->after('expiration_date');
            
            // Make existing columns nullable
            $table->string('insurance_company_name')->nullable()->change();
            $table->decimal('amount', 15, 2)->nullable()->change();
            $table->string('policy_number')->nullable()->change();
            $table->date('effective_date')->nullable()->change();
            $table->date('expiration_date')->nullable()->change();
            $table->enum('status', ['Active', 'Expired'])->default('Active')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties_info', function (Blueprint $table) {
            // Drop notes column
            $table->dropColumn('notes');
            
            // Revert columns to not nullable
            $table->string('insurance_company_name')->nullable(false)->change();
            $table->decimal('amount', 15, 2)->nullable(false)->change();
            $table->string('policy_number')->nullable(false)->change();
            $table->date('effective_date')->nullable(false)->change();
            $table->date('expiration_date')->nullable(false)->change();
            $table->enum('status', ['Active', 'Expired'])->default('Active')->nullable(false)->change();
        });
    }
};
