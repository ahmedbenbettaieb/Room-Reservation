<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeysToEventsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('events', function (Blueprint $table) {
            // Add the columns first
            $table->unsignedBigInteger('room_id')->after('description');
            $table->unsignedBigInteger('user_id')->after('room_id');

            // Add the foreign keys after the columns are created
            $table->foreign('room_id')->references('id')->on('rooms')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('events', function (Blueprint $table) {
            // Drop foreign keys first before dropping the columns
            $table->dropForeign(['room_id']);
            $table->dropForeign(['user_id']);

            // Then drop the columns
            $table->dropColumn(['room_id', 'user_id']);
        });
    }
}
