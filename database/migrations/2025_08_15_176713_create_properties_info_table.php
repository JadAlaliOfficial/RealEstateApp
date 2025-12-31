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
        Schema::create('properties_info', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->nullable()->constrained('property_info_without_insurance')->onDelete('set null');
            $table->string('insurance_company_name');
            $table->decimal('amount', 15, 2);
            $table->string('policy_number');
            $table->date('effective_date');
            $table->date('expiration_date');
            $table->enum('status', ['Active', 'Expired'])->default('Active');
            $table->boolean('is_archived')->default(false)->nullable(false);
            $table->timestamps();
            
            // Add index for better query performance
            $table->index('property_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties_info');
    }
};
