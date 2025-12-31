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
        Schema::table('move_ins', function (Blueprint $table) {
            $table->string('tenant_name')->nullable();
            $table->date('last_notice_sent')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('move_ins', function (Blueprint $table) {
            $table->dropColumn(['tenant_name', 'last_notice_sent']);
        });
    }
};