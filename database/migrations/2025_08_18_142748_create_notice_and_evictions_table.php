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
        Schema::create('notice_and_evictions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->nullable()->constrained('tenants')->onDelete('set null');
            $table->string('status')->nullable();
            $table->date('date')->nullable();
            $table->string('type_of_notice')->nullable();
            $table->string('have_an_exception')->nullable();
            $table->text('note')->nullable();
            $table->string('evictions')->nullable();
            $table->string('sent_to_atorney')->nullable();
            $table->date('hearing_dates')->nullable();
            $table->string('evected_or_payment_plan')->nullable();
            $table->string('if_left')->nullable();
            $table->date('writ_date')->nullable();
            $table->boolean('is_archived')->default(false)->nullable(false);
            $table->timestamps();

            // Add indexes for better query performance
            $table->index('tenant_id');
            $table->index('status');
            $table->index('date');
            $table->index('type_of_notice');
            $table->index('is_archived');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notice_and_evictions');
    }
};
