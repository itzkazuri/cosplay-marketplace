<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin Cosplay',
            'email' => 'admin@cosplay.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '081234567890',
            'avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
            'recipient_name' => 'Admin Cosplay Store',
            'recipient_phone' => '081234567890',
            'address' => 'Jl. Cosplay Raya No. 1, Kel. Anime',
            'city' => 'Jakarta Selatan',
            'province' => 'DKI Jakarta',
            'postal_code' => '12345',
        ]);

        User::create([
            'name' => 'Budi Cosplayer',
            'email' => 'user@cosplay.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'phone' => '089876543210',
            'avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=budi',
            'recipient_name' => 'Budi Santoso',
            'recipient_phone' => '089876543210',
            'address' => 'Jl. Manga No. 88, RT 01/RW 03, Kel. Akihabara',
            'city' => 'Bandung',
            'province' => 'Jawa Barat',
            'postal_code' => '40123',
        ]);

        $categories = [
            ['name' => 'Kostum Custom',   'slug' => 'kostum-custom',  'type' => 'custom'],
            ['name' => 'Aksesoris',       'slug' => 'aksesoris',      'type' => 'aksesori'],
            ['name' => 'Wig',             'slug' => 'wig',            'type' => 'wig'],
            ['name' => 'Props & Senjata', 'slug' => 'props-senjata',  'type' => 'props'],
            ['name' => 'Ready Stock',     'slug' => 'ready-stock',    'type' => 'ready_stock'],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }
    }
}
