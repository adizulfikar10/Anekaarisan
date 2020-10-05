<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReminderArisansTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reminder_arisans', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('arisan_id');
            $table->json('meta')->nullable();
            $table->date('reminder_date');
            $table->enum('status', ['WAIT_PAYMENT', 'PAID'])->default('WAIT_PAYMENT');
            $table->timestamps();

            $table->foreign('arisan_id')
            ->references('id')
            ->on('arisans');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('reminder_arisans');
    }
}
