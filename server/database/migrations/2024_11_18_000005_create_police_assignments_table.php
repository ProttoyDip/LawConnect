<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('police_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('crime_report_id')->constrained('crime_reports')->onDelete('cascade');
            $table->foreignId('officer_id')->constrained('users')->onDelete('restrict');
            $table->foreignId('assigned_by')->constrained('users')->onDelete('restrict');
            $table->dateTime('assigned_at');
            $table->dateTime('completed_at')->nullable();
            $table->text('notes')->nullable();
            $table->softDeletes();
            $table->timestamps();
            $table->index('crime_report_id');
            $table->index('officer_id');
            $table->unique(['crime_report_id', 'officer_id']);
        });
    }
    public function down(): void { Schema::dropIfExists('police_assignments'); }
};
