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
        Schema::create('move_outs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->nullable()->constrained('tenants')->onDelete('set null');
            $table->date('move_out_date')->nullable();
            $table->string('lease_status')->nullable();
            $table->date('date_lease_ending_on_buildium')->nullable();
            $table->string('keys_location')->nullable();
            $table->enum('utilities_under_our_name', ['Yes', 'No'])->nullable();
            $table->date('date_utility_put_under_our_name')->nullable();
            $table->text('walkthrough')->nullable();
            $table->text('repairs')->nullable();
            $table->string('send_back_security_deposit')->nullable();
            $table->text('notes')->nullable();
            $table->enum('cleaning', ['cleaned', 'uncleaned'])->nullable();
            $table->string('list_the_unit')->nullable();
            $table->enum('move_out_form', ['filled', 'not filled'])->nullable();
            $table->boolean('is_archived')->default(false)->nullable(false);
            $table->timestamps();

            // Add indexes for better query performance
            $table->index('tenant_id');
            $table->index('move_out_date');
            $table->index('lease_status');
            $table->index('is_archived');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('move_outs');
    }
};
