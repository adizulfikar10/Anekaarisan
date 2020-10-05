<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateArisanTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('arisan_transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('arisan_id');
            // $table->uuid('payment_id')->nullable();
            $table->json('meta_arisan')->nullable();
            $table->json('meta_product')->nullable();
            $table->string('shipping_number')->nullable();
            $table->string('courier')->nullable();
            $table->float('remaining_funds', 12, 2)->default(0);
            $table->enum('status', ['WAIT_PAYMENT', 'PAID', 'SENDING', 'FINISH', 'REFUND', 'PENDING'])->default('WAIT_PAYMENT');
            $table->timestamps();

            // $table->foreign('arisan_id')
            //     ->references('id')
            //     ->on('arisans');

            // $table->foreign('payment_id')
            //     ->references('id')
            //     ->on('payments')->nullable();


        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('arisan_transactions');
    }
}
