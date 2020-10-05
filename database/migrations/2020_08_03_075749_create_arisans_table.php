<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateArisansTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('arisans', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('sequence_code', 20)->unique();
            $table->float('duration', 12, 2)->default(0);
            $table->date('start_date');
            $table->date('end_date');
            $table->float('total_funds', 12, 2)->default(0);
            $table->float('average_funds', 12, 2)->default(0);
            $table->float('funds', 12, 2)->default(0);
            $table->enum('status', ['PROGRESS', 'SUCCESS', 'REQUEST_CANCEL', 'CANCELED']);
            $table->uuid('user_id');
            $table->timestamps();

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('arisans');
    }
}
