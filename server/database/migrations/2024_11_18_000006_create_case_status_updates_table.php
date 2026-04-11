<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('case_status_updates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('crime_report_id')->constrained('crime_reports')->onDelete('cascade');
            $table->foreignId('created_by')->constrained('users')->onDelete('restrict');
            $table->enum('status', ['pending', 'under_review', 'investigating', 'resolved', 'closed']);
            $table->text('remark')->nullable();
            $table->softDeletes();
            $table->timestamps();
            $table->index('crime_report_id');
            $table->index('created_by');
        });
    }
    public function down(): void { Schema::dropIfExists('case_status_updates'); }
};
