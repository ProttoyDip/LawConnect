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
            if (!Schema::hasColumn('users', 'badge_number')) {
                $table->string('badge_number', 50)->nullable()->unique()->after('national_id');
            }

            if (!Schema::hasColumn('users', 'police_station')) {
                $table->string('police_station', 255)->nullable()->after('badge_number');
            }
        });
    }

    public function down(): void
    {
        if (!Schema::hasTable('users')) {
            return;
        }

        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'police_station')) {
                $table->dropColumn('police_station');
            }

            if (Schema::hasColumn('users', 'badge_number')) {
                $table->dropUnique('users_badge_number_unique');
                $table->dropColumn('badge_number');
            }
        });
    }
};
