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
        Schema::create('offers_and_renewals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->nullable()->constrained('tenants')->onDelete('set null');
            $table->date('date_sent_offer');
            $table->date('date_offer_expires')->nullable();
            $table->string('status')->nullable();
            $table->date('date_of_acceptance')->nullable();
            $table->date('last_notice_sent')->nullable();
            $table->string('notice_kind')->nullable();
            $table->string('lease_sent')->nullable();
            $table->date('date_sent_lease')->nullable();
            $table->date('lease_expires')->nullable();
            $table->string('lease_signed')->nullable();
            $table->date('date_signed')->nullable();
            $table->date('last_notice_sent_2')->nullable();
            $table->string('notice_kind_2')->nullable();
            $table->text('notes')->nullable();
            $table->integer('how_many_days_left')->nullable();
            $table->string('expired')->nullable();
            $table->boolean('is_archived')->default(false)->nullable(false);
            $table->timestamps();

            // Add indexes for better query performance
            $table->index('tenant_id');
            $table->index('date_sent_offer');
            $table->index('date_offer_expires');
            $table->index('status');
            $table->index('is_archived');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offers_and_renewals');
    }
};
