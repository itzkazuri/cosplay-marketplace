import {
    LayoutDashboard,
    ShoppingBag,
    Tags,
    Users,
    ClipboardList,
    Truck,
    CreditCard,
    BarChart3,
    Layers,
    Image,
    Package,
    Settings,
    UserCircle,
    DollarSign,
} from 'lucide-react';

export interface AdminNavItem {
    title: string;
    href?: string;
    icon: any;
    items?: { title: string; href: string }[];
}

export const adminNavigation: AdminNavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
    },
    {
        title: 'Manajemen Produk',
        icon: ShoppingBag,
        items: [
            { title: 'Daftar Produk', href: '/admin/products' },
            { title: 'Kategori', href: '/admin/categories' },
            { title: 'SKU & Stok', href: '/admin/product-skus' },
            { title: 'Media Produk', href: '/admin/product-images' },
        ],
    },
    {
        title: 'Pesanan & Logistik',
        icon: ClipboardList,
        items: [
            { title: 'Daftar Pesanan', href: '/admin/orders' },
            { title: 'Pengiriman', href: '/admin/shipments' },
            { title: 'Pembayaran', href: '/admin/payments' },
        ],
    },
    {
        title: 'Pelanggan',
        href: '/admin/users',
        icon: Users,
    },
    {
        title: 'Pendapatan',
        icon: DollarSign,
        items: [
            { title: 'Bulanan', href: '/admin/revenue/monthly' },
            { title: 'Tahunan', href: '/admin/revenue/yearly' },
        ],
    },
    {
        title: 'Manajemen Toko',
        icon: Package,
        items: [
            { title: 'Rating Produk', href: '/admin/product-ratings' },
            { title: 'Review Pelanggan', href: '/admin/reviews' },
            { title: 'Voucher & Diskon', href: '/admin/vouchers' },
        ],
    },
    {
        title: 'Pengaturan',
        href: '/admin/settings',
        icon: Settings,
    }
];
