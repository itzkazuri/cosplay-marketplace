import { Link } from '@inertiajs/react';

interface Product {
    id: number;
    name: string;
    slug: string;
    main_image?: string | null;
    total_sold: number;
    total_revenue: number;
    total_revenue_formatted: string;
}

interface RevenueTableProps {
    products: Product[];
    title?: string;
}

export default function RevenueTable({ products, title = 'Produk Terlaris' }: RevenueTableProps) {
    return (
        <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body">
                <h3 className="card-title text-base-content mb-4">{title}</h3>
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="text-base-content/70">#</th>
                                <th className="text-base-content/70">Produk</th>
                                <th className="text-base-content/70 text-right">Terjual</th>
                                <th className="text-base-content/70 text-right">Pendapatan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center text-base-content/50 py-8">
                                        Belum ada data produk
                                    </td>
                                </tr>
                            ) : (
                                products.map((product, index) => (
                                    <tr key={product.id} className="hover">
                                        <td className="text-base-content/70">{index + 1}</td>
                                        <td>
                                            <Link
                                                href={`/admin/products/${product.slug}/edit`}
                                                className="flex items-center gap-3 hover:text-primary transition-colors"
                                            >
                                                <div className="avatar">
                                                    <div className="mask mask-squircle w-10 h-10 bg-base-200">
                                                        {product.main_image ? (
                                                            <img
                                                                src={product.main_image}
                                                                alt={product.name}
                                                                className="object-cover w-full h-full"
                                                            />
                                                        ) : (
                                                            <div className="flex items-center justify-center w-full h-full">
                                                                <span className="text-xs font-bold text-base-content/50">
                                                                    {product.name.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-base-content">{product.name}</div>
                                                    <div className="text-xs text-base-content/50">/{product.slug}</div>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="text-right">
                                            <span className="badge badge-primary badge-sm gap-1">
                                                {product.total_sold} item
                                            </span>
                                        </td>
                                        <td className="text-right font-medium text-base-content">
                                            Rp {product.total_revenue_formatted}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
