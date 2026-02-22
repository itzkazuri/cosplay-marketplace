import { 
    ShoppingBag, 
    MoreHorizontal, 
    Edit, 
    Trash2, 
    Eye, 
    Package, 
    Tag, 
    Layers,
    ArrowUpDown
} from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Product {
    id: number;
    name: string;
    category: string;
    price: string;
    stock: number;
    status: 'Ready' | 'Pre-Order' | 'Out of Stock';
    image?: string;
}

export default function ProductListTable({ products }: { products: Product[] }) {
    return (
        <div className="card bg-base-100 shadow-xl overflow-hidden border border-base-300">
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr className="bg-base-200/50">
                            <th className="w-12">
                                <label>
                                    <input type="checkbox" className="checkbox checkbox-sm checkbox-primary rounded-md" />
                                </label>
                            </th>
                            <th className="text-xs font-black uppercase tracking-wider opacity-50 flex items-center gap-1 group cursor-pointer">
                                Produk
                                <ArrowUpDown className="w-3 h-3 group-hover:text-primary transition-colors" />
                            </th>
                            <th className="text-xs font-black uppercase tracking-wider opacity-50">Kategori</th>
                            <th className="text-xs font-black uppercase tracking-wider opacity-50">Harga</th>
                            <th className="text-xs font-black uppercase tracking-wider opacity-50">Stok</th>
                            <th className="text-xs font-black uppercase tracking-wider opacity-50">Status</th>
                            <th className="w-16"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-primary/5 transition-colors group">
                                <td>
                                    <label>
                                        <input type="checkbox" className="checkbox checkbox-sm checkbox-primary rounded-md" />
                                    </label>
                                </td>
                                <td>
                                    <div className="flex items-center gap-4">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-12 h-12 bg-base-200">
                                                {product.image ? (
                                                    <img src={product.image} alt={product.name} />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <ShoppingBag className="w-5 h-5 opacity-20" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="font-bold text-sm tracking-tight truncate max-w-[200px] group-hover:text-primary transition-colors">{product.name}</p>
                                            <p className="text-[10px] text-base-content/50 uppercase font-black tracking-widest">#{product.id.toString().padStart(4, '0')}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="badge badge-outline badge-sm gap-1 font-bold rounded-lg border-base-300 py-3 px-3">
                                        <Tag className="w-3 h-3 text-primary" />
                                        {product.category}
                                    </div>
                                </td>
                                <td className="font-black text-sm">{product.price}</td>
                                <td>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-success' : 'bg-warning'}`}></div>
                                        <span className="text-sm font-bold">{product.stock} pcs</span>
                                    </div>
                                </td>
                                <td>
                                    <span className={`badge badge-sm font-bold py-2.5 px-3 rounded-lg ${
                                        product.status === 'Ready' ? 'badge-success' : 
                                        product.status === 'Pre-Order' ? 'badge-info' : 'badge-error'
                                    }`}>
                                        {product.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="dropdown dropdown-left dropdown-end">
                                        <div tabIndex={0} role="button" className="btn btn-ghost btn-xs btn-square">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </div>
                                        <ul tabIndex={0} className="dropdown-content menu p-2 shadow-2xl bg-base-100 border border-base-300 rounded-2xl w-48 z-50">
                                            <li>
                                                <Link href={`/admin/products/${product.id}`} className="rounded-xl py-2 font-medium">
                                                    <Eye className="w-4 h-4 text-info" />
                                                    <span>Lihat Detail</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href={`/admin/products/${product.id}/edit`} className="rounded-xl py-2 font-medium">
                                                    <Edit className="w-4 h-4 text-warning" />
                                                    <span>Ubah Data</span>
                                                </Link>
                                            </li>
                                            <li className="mt-1 border-t border-base-200 pt-1">
                                                <button className="rounded-xl py-2 font-medium text-error hover:bg-error/10">
                                                    <Trash2 className="w-4 h-4" />
                                                    <span>Hapus Produk</span>
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
