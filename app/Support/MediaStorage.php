<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaStorage
{
    public static function disk(): string
    {
        return (string) config('filesystems.default', 'public');
    }

    public static function storeUploadedImage(UploadedFile $file, string $directory): string
    {
        return $file->store($directory, self::disk());
    }

    public static function deleteIfStored(?string $path): void
    {
        if ($path === null || $path === '') {
            return;
        }

        if (self::isExternalPath($path)) {
            return;
        }

        Storage::disk(self::disk())->delete(ltrim($path, '/'));
    }

    public static function toPublicUrl(?string $path): ?string
    {
        if ($path === null || $path === '') {
            return null;
        }

        if (self::isExternalPath($path)) {
            return $path;
        }

        return Storage::disk(self::disk())->url($path);
    }

    private static function isExternalPath(string $path): bool
    {
        return Str::startsWith($path, ['http://', 'https://', 'data:']);
    }
}
