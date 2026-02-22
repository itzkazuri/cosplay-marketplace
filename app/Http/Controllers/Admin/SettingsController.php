<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateAdminSettingsPasswordRequest;
use App\Http\Requests\UpdateAdminSettingsProfileRequest;
use App\Support\MediaStorage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Admin/Settings/Index', [
            'profile' => [
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'phone' => $user->phone,
                'recipient_name' => $user->recipient_name,
                'recipient_phone' => $user->recipient_phone,
                'address' => $user->address,
                'city' => $user->city,
                'province' => $user->province,
                'postal_code' => $user->postal_code,
            ],
            'logs' => $this->getRecentLogs(),
            'log_refreshed_at' => now()->toDateTimeString(),
        ]);
    }

    public function updateProfile(UpdateAdminSettingsProfileRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        if ($request->hasFile('avatar')) {
            $validated['avatar'] = MediaStorage::storeUploadedImage($validated['avatar'], 'profile');
            MediaStorage::deleteIfStored($user->getRawOriginal('avatar'));
        }

        $user->update($validated);

        return redirect()->route('admin.settings.index')
            ->with('success', 'Profil admin berhasil diperbarui.');
    }

    public function updatePassword(UpdateAdminSettingsPasswordRequest $request): RedirectResponse
    {
        $request->user()->update([
            'password' => Hash::make($request->validated()['password']),
        ]);

        return redirect()->route('admin.settings.index')
            ->with('success', 'Password berhasil diperbarui.');
    }

    /**
     * @return array<int, array{timestamp: string, level: string, message: string}>
     */
    private function getRecentLogs(): array
    {
        $logPath = storage_path('logs/laravel.log');

        if (! File::exists($logPath)) {
            return [];
        }

        $rawLines = preg_split('/\r\n|\r|\n/', $this->tailFile($logPath, 250_000)) ?: [];

        $entries = [];
        $currentEntry = null;

        foreach ($rawLines as $line) {
            if (preg_match('/^\[(.*?)\]\s+\w+\.([A-Za-z]+):\s?(.*)$/', $line, $matches) === 1) {
                if ($currentEntry !== null) {
                    $entries[] = $currentEntry;
                }

                $currentEntry = [
                    'timestamp' => $matches[1],
                    'level' => strtoupper($matches[2]),
                    'message' => $matches[3],
                ];

                continue;
            }

            if ($currentEntry !== null && trim($line) !== '') {
                $currentEntry['message'] .= "\n{$line}";
            }
        }

        if ($currentEntry !== null) {
            $entries[] = $currentEntry;
        }

        return array_slice(array_reverse($entries), 0, 30);
    }

    private function tailFile(string $path, int $maxBytes): string
    {
        $handle = fopen($path, 'rb');

        if ($handle === false) {
            return '';
        }

        $size = filesize($path);
        if ($size === false) {
            fclose($handle);

            return '';
        }

        $offset = max($size - $maxBytes, 0);
        fseek($handle, $offset);

        $content = stream_get_contents($handle) ?: '';
        fclose($handle);

        return $content;
    }
}
