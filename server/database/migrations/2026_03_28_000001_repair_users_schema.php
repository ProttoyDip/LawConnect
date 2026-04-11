<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('users')) {
            return;
        }

        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'national_id')) {
                $table->string('national_id', 20)->nullable();
            }

            if (!Schema::hasColumn('users', 'phone')) {
                $table->string('phone', 20)->nullable();
            }

            if (!Schema::hasColumn('users', 'address')) {
                $table->text('address')->nullable();
            }
        });
    }

    public function down(): void
    {
        // Intentionally no destructive rollback for repair migration.
    }
};
