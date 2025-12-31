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
        Schema::create('move_ins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('unit_id')->nullable()->constrained('units')->onDelete('set null');
            $table->enum('signed_lease', ['Yes', 'No']);
            $table->date('lease_signing_date')->nullable();
            $table->date('move_in_date')->nullable();
            $table->enum('paid_security_deposit_first_month_rent', ['Yes', 'No'])->nullable();
            $table->date('scheduled_paid_time')->nullable();
            $table->enum('handled_keys', ['Yes', 'No'])->nullable();
            $table->date('move_in_form_sent_date')->nullable();
            $table->enum('filled_move_in_form', ['Yes', 'No'])->nullable();
            $table->date('date_of_move_in_form_filled')->nullable();
            $table->enum('submitted_insurance', ['Yes', 'No'])->nullable();
            $table->date('date_of_insurance_expiration')->nullable();
            $table->boolean('is_archived')->default(false)->nullable(false);
            $table->timestamps();

            // Add indexes for better query performance
            $table->index('unit_id');
            $table->index('signed_lease');
            $table->index('move_in_date');
            $table->index('lease_signing_date');
            $table->index('is_archived');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('move_ins');
    }
};
