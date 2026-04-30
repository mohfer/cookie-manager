<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cookies', function (Blueprint $table) {
            // Drop foreign key first
            $table->dropForeign(['user_id']);

            // Drop old unique constraints
            $table->dropUnique('cookies_user_id_domain_unique');
            $table->dropUnique('cookies_user_id_name_unique');

            // Add new unique constraint
            $table->unique(['user_id', 'domain', 'name']);

            // Re-add foreign key
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('cookies', function (Blueprint $table) {
            // Drop foreign key first
            $table->dropForeign(['user_id']);

            // Drop new unique constraint
            $table->dropUnique('cookies_user_id_domain_name_unique');

            // Re-add old unique constraints
            $table->unique(['user_id', 'domain']);
            $table->unique(['user_id', 'name']);

            // Re-add foreign key
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }
};
