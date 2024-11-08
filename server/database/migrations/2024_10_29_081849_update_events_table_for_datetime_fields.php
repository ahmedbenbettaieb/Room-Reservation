<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateEventsTableForDatetimeFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('events', function (Blueprint $table) {
            // Drop the start_time and end_time columns
            $table->dropColumn(['start_time', 'end_time']);

            // Change start_date and end_date to datetime
            $table->dateTime('start_date')->change();
            $table->dateTime('end_date')->change();
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
            // Revert start_date and end_date back to date type
            $table->date('start_date')->change();
            $table->date('end_date')->change();

            // Re-add start_time and end_time as time type
            $table->time('start_time');
            $table->time('end_time');
        });
    }
}
