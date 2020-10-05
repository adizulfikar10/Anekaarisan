<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWalletRequestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('wallet_requests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->float('amount', 12, 2)->default(0);
            $table->enum('status', ["WAITING", "APPROVED", "REJECTED"])->default("WAITING");
            $table->enum('category', ["COMMISSION", "WITHDRAWAL"]);
            $table->text('bank_account')->nullable();
            $table->text('notes')->nullable();
            $table->json('meta_transaction')->nullable();
            $table->timestamps();

            $table->foreign('user_id')
                ->references('id')
                ->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('wallet_requests');
    }
}
