<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Query\Expression;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('email')->unique()->nullable();
            $table->string('phone_number')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->boolean('is_active')->default(false);
            $table->string('province')->nullable();
            $table->string('region')->nullable();
            $table->string('district')->nullable();
            $table->string('village')->nullable();
            $table->string('street')->nullable();
            $table->enum('status', ["WAIT", "REJECT", "APPROVED"])->default("WAIT");
            $table->string('agent_code')->unique();
            $table->string('referral_code')->nullable();
            $table->rememberToken();
            $table->json('card_numbers')->default(new Expression('(JSON_ARRAY())'));
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
