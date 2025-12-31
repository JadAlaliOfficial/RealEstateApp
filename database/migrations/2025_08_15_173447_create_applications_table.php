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
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('unit_id')->nullable()->constrained('units')->onDelete('set null');
            $table->string('name');
            $table->string('co_signer');
            $table->string('status')->nullable();
            $table->date('date')->nullable();
            $table->string('stage_in_progress')->nullable();
            $table->text('notes')->nullable();
            $table->string('attachment_name')->nullable();
            $table->string('attachment_path')->nullable();
            $table->boolean('is_archived')->default(false)->nullable(false);
            $table->timestamps();
            
            // Add index for better query performance
            $table->index('unit_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
