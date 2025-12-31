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
        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->nullable()->constrained('property_info_without_insurance')->onDelete('set null');
            $table->string('unit_name');
            $table->string('tenants')->nullable();
            $table->date('lease_start')->nullable();
            $table->date('lease_end')->nullable();
            $table->decimal('count_beds', 3, 1)->nullable(); // 3 digits total, 1 decimal place (e.g., 10.5)
            $table->decimal('count_baths', 3, 1)->nullable();
            $table->string('lease_status')->nullable();
            $table->decimal('monthly_rent', 15, 2)->nullable();
            $table->string('recurring_transaction')->nullable();
            $table->string('utility_status')->nullable();
            $table->string('account_number')->nullable();
            $table->enum('insurance', ['Yes', 'No'])->nullable();
            $table->date('insurance_expiration_date')->nullable();
            $table->string('vacant'); // Calculated field
            $table->string('listed'); // Calculated field
            $table->integer('total_applications')->default(0); // Calculated field
            $table->boolean('is_archived')->default(false)->nullable(false);
            $table->timestamps();
            
            // Add indexes for better query performance
            $table->index('property_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};
