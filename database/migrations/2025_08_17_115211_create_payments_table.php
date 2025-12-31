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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->foreignId('unit_id')->nullable()->constrained('units')->onDelete('set null');
            $table->decimal('owes', 10, 2);
            $table->decimal('paid', 10, 2)->nullable();
            $table->decimal('left_to_pay', 10, 2)->nullable();
            $table->string('status')->nullable();
            $table->text('notes')->nullable();
            $table->string('reversed_payments')->nullable();
            $table->enum('permanent', ['Yes', 'No']);
            $table->boolean('is_archived')->default(false)->nullable(false);
            $table->timestamps();

            // Add indexes for better query performance
            $table->index('unit_id');
            $table->index('date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
