<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('evidence_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('crime_report_id')->constrained('crime_reports')->onDelete('cascade');
            $table->foreignId('uploaded_by')->constrained('users')->onDelete('restrict');
            $table->string('file_path');
            $table->string('file_type', 50); // image, document, etc.
            $table->string('original_name');
            $table->integer('file_size');
            $table->text('description')->nullable();
            $table->softDeletes();
            $table->timestamps();
            $table->index('crime_report_id');
            $table->index('uploaded_by');
        });
    }
    public function down(): void { Schema::dropIfExists('evidence_files'); }
};
