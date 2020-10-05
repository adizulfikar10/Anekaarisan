<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateArisanMembersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('arisan_members', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 100);
            $table->uuid('product_id');
            $table->uuid('arisan_id');
            $table->uuid('arisan_transaction_id');
            $table->boolean('status')->default(false);
            $table->JSON('meta_product')->nullable();
            $table->timestamps();

            $table->foreign('arisan_id')
                ->references('id')
                ->on('arisans')
                ->onDelete('cascade');

            // $table->foreign('product_id')
            //     ->references('id')
            //     ->on('products');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('arisan_members');
    }
}
