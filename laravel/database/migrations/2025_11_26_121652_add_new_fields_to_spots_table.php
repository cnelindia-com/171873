<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('spots', function (Blueprint $table) {
            $table->string('name_of_the_place')->nullable();
            $table->string('room_type')->nullable();
            $table->string('care_level')->nullable();
            $table->string('availability')->nullable();
            $table->decimal('price_per_month', 10, 2)->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('spots', function (Blueprint $table) {
            $table->dropColumn([
                'name_of_the_place',
                'room_type',
                'care_level',
                'availability',
                'price_per_month',
                'user_id'
            ]);
        });
    }
};
