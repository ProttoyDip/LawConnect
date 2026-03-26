<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('crime_reports', function (Blueprint $table) {
            $table->id();
            $table->uuid('case_id')->unique();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->longText('description');
            $table->enum('category', ['theft', 'assault', 'fraud', 'vandalism', 'cyber', 'other']);
            $table->string('location')->nullable();
            $table->dateTime('occurred_at')->nullable();
            $table->enum('status', ['pending', 'under_review', 'investigating', 'resolved', 'closed'])->default('pending');
            $table->enum('priority', ['low', 'medium', 'high', 'critical'])->default('medium');
            $table->softDeletes();
            $table->timestamps();
            $table->index('user_id');
            $table->index('status');
            $table->index('category');
            $table->index('case_id');
        });
    }
    public function down(): void { Schema::dropIfExists('crime_reports'); }
};
