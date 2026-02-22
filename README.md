# Cosplay Ecommerce

Marketplace cosplay berbasis Laravel + Inertia React + DaisyUI.

## Fitur Utama
- Homepage publik dengan produk unggulan, kategori, dan testimoni.
- Halaman kategori (slug SEO) dengan daftar produk.
- Wishlist dan keranjang untuk user.
- Admin panel untuk produk, kategori, promo, pesanan, dan pengiriman.

## Tech Stack
- Laravel 12
- Inertia.js v2 + React 18
- Tailwind CSS + DaisyUI
- MySQL

## Setup Lokal
```bash
composer install
bun install
cp .env.example .env
php artisan key:generate
php artisan migrate
```

## Development
```bash
bun run dev
php artisan serve
```

## Testing
```bash
php artisan test --compact
```
