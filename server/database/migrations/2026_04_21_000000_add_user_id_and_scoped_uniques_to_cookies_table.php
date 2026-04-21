<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cookies', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->after('id')->constrained()->cascadeOnDelete();

            $table->dropUnique('cookies_domain_unique');
            $table->dropUnique('cookies_name_unique');

            $table->unique(['user_id', 'domain']);
            $table->unique(['user_id', 'name']);
        });
    }

    public function down(): void
    {
        Schema::table('cookies', function (Blueprint $table) {
            $table->dropUnique('cookies_user_id_domain_unique');
            $table->dropUnique('cookies_user_id_name_unique');
            $table->dropConstrainedForeignId('user_id');

            $table->unique('domain');
            $table->unique('name');
        });
    }
};
