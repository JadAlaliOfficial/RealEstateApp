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
        Schema::table('payments', function (Blueprint $table) {
            $table->boolean('has_assistance')->default(false)->nullable(false);
            $table->decimal('assistance_amount', 10, 2)->nullable();
            $table->string('assistance_company')->nullable();
            $table->boolean('is_hidden')->default(false)->nullable(false);
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn(['has_assistance', 'assistance_amount', 'assistance_company', 'is_hidden']);
        });
    }
};
