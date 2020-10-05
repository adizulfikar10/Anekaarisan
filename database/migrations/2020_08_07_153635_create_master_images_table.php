<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMasterImagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('master_images', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('ext', 10);
            $table->float('size', 12, 2);
            $table->string('path');
            $table->uuid('uploaded_by');
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
        Schema::dropIfExists('master_images');
    }
}
