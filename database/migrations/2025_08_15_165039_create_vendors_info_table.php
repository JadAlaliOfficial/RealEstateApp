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
        Schema::create('vendors_info', function (Blueprint $table) {
            $table->id();
            $table->foreignId('city_id')->nullable()->constrained('cities')->onDelete('set null');
            $table->string('vendor_name'); // Not nullable
            $table->string('number')->nullable();
            $table->string('email')->nullable();
            $table->string('service_type')->nullable();
            $table->boolean('is_archived')->default(false)->nullable(false);
            $table->timestamps();
            
            // Add index for better query performance
            $table->index('city_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendors_info');
    }
};
