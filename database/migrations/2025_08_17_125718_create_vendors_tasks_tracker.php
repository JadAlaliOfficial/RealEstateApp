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
        Schema::create('vendors_tasks_tracker', function (Blueprint $table) {
            $table->id();
            $table->date('task_submission_date');
            $table->foreignId('vendor_id')->nullable()->constrained('vendors_info')->onDelete('set null');
            $table->foreignId('unit_id')->nullable()->constrained('units')->onDelete('set null');
            $table->text('assigned_tasks');
            $table->date('any_scheduled_visits')->nullable();
            $table->text('notes')->nullable();
            $table->date('task_ending_date')->nullable();
            $table->string('status')->nullable();
            $table->enum('urgent', ['Yes', 'No']);
            $table->boolean('is_archived')->default(false)->nullable(false);
            $table->timestamps();

            // Add indexes for better query performance
            $table->index('vendor_id');
            $table->index('unit_id');
            $table->index('task_submission_date');
            $table->index('urgent');
            $table->index('is_archived');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendors_tasks_tracker');
    }
};
