<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('actor_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('action');
            $table->string('target_type', 50);
            $table->unsignedBigInteger('target_id')->nullable();
            $table->json('meta')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();
            $table->index('actor_id');
            $table->index('created_at');
        });
    }
    public function down(): void { Schema::dropIfExists('audit_logs'); }
};
