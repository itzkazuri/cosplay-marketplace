<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_open_settings_page(): void
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->get(route('admin.settings.index'));

        $response->assertOk();
    }

    public function test_admin_can_update_profile_information(): void
    {
        config(['filesystems.default' => 'minio']);
        Storage::fake('minio');

        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->patch(route('admin.settings.profile.update'), [
            'name' => 'Admin Updated',
            'email' => 'admin-updated@example.com',
            'avatar' => UploadedFile::fake()->image('avatar.jpg'),
            'phone' => '081234567890',
            'recipient_name' => 'Gudang Admin',
            'recipient_phone' => '081111111111',
            'address' => 'Jl. Konoha No. 1',
            'city' => 'Jakarta',
            'province' => 'DKI Jakarta',
            'postal_code' => '12345',
        ]);

        $response->assertRedirect(route('admin.settings.index'));

        $this->assertDatabaseHas('users', [
            'id' => $admin->id,
            'name' => 'Admin Updated',
            'email' => 'admin-updated@example.com',
            'phone' => '081234567890',
            'recipient_name' => 'Gudang Admin',
            'recipient_phone' => '081111111111',
            'city' => 'Jakarta',
            'province' => 'DKI Jakarta',
            'postal_code' => '12345',
        ]);

        $admin->refresh();
        $avatarPath = $admin->getRawOriginal('avatar');

        $this->assertNotNull($avatarPath);
        Storage::disk('minio')->assertExists($avatarPath);
    }

    public function test_admin_can_update_password_with_current_password(): void
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->patch(route('admin.settings.password.update'), [
            'current_password' => 'password',
            'password' => 'new-secure-password',
            'password_confirmation' => 'new-secure-password',
        ]);

        $response->assertRedirect(route('admin.settings.index'));

        $admin->refresh();
        $this->assertTrue(Hash::check('new-secure-password', $admin->password));
    }

    public function test_non_admin_cannot_access_admin_settings_page(): void
    {
        $user = User::query()->create([
            'name' => 'User Regular',
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        $response = $this->actingAs($user)->get(route('admin.settings.index'));

        $response->assertRedirect(route('home'));
    }

    private function createAdmin(): User
    {
        return User::query()->create([
            'name' => 'Admin Settings',
            'email' => 'admin-settings@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);
    }
}
