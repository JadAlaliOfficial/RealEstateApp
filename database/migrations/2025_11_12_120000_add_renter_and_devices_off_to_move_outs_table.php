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
        Schema::table('move_outs', function (Blueprint $table) {
            // Add 'renter' (Yes/No) after 'list_the_unit'
            $table->enum('renter', ['Yes', 'No'])->nullable()->after('list_the_unit');

            // Add 'all_the_devices_are_off' (Yes/No) after 'walkthrough'
            $table->enum('all_the_devices_are_off', ['Yes', 'No'])->nullable()->after('walkthrough');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('move_outs', function (Blueprint $table) {
            $table->dropColumn(['renter', 'all_the_devices_are_off']);
        });
    }
};