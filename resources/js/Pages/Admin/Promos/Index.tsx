import AdminLayout from '@/components/layout/AdminLayout';
import PromoFlashAlert from '@/components/admin/promo/PromoFlashAlert';
import AlertDialog from '@/components/ui/AlertDialog';
import PromoHeader from '@/components/admin/promo/PromoHeader';
import PromoTabs from '@/components/admin/promo/PromoTabs';
import DiscountTable, { type ProductDiscount, type PromoProduct } from '@/components/admin/promo/DiscountTable';
import VoucherTable, { type Voucher } from '@/components/admin/promo/VoucherTable';
import DiscountFormModal from '@/components/admin/promo/DiscountFormModal';
import VoucherFormModal from '@/components/admin/promo/VoucherFormModal';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface PromoIndexProps {
    products: PromoProduct[];
    discounts: ProductDiscount[];
    vouchers: Voucher[];
}

type PromoTab = 'discounts' | 'vouchers';

export default function PromoIndex({ products, discounts, vouchers }: PromoIndexProps): JSX.Element {
    const [activeTab, setActiveTab] = useState<PromoTab>('discounts');
    const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
    const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
    const [editingDiscount, setEditingDiscount] = useState<ProductDiscount | null>(null);
    const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
    const [deleteDiscountCandidate, setDeleteDiscountCandidate] = useState<ProductDiscount | null>(null);
    const [deleteVoucherCandidate, setDeleteVoucherCandidate] = useState<Voucher | null>(null);

    const page = usePage();
    const flash = (page.props as { flash?: { success?: string; error?: string } }).flash;

    const openCreateDiscount = (): void => {
        setEditingDiscount(null);
        setIsDiscountModalOpen(true);
    };

    const openEditDiscount = (discount: ProductDiscount): void => {
        setEditingDiscount(discount);
        setIsDiscountModalOpen(true);
    };

    const openCreateVoucher = (): void => {
        setEditingVoucher(null);
        setIsVoucherModalOpen(true);
    };

    const openEditVoucher = (voucher: Voucher): void => {
        setEditingVoucher(voucher);
        setIsVoucherModalOpen(true);
    };

    const handleDeleteDiscount = (discount: ProductDiscount): void => {
        setDeleteDiscountCandidate(discount);
    };

    const confirmDeleteDiscount = (): void => {
        if (deleteDiscountCandidate === null) {
            return;
        }

        router.delete(route('admin.discounts.destroy', deleteDiscountCandidate.id), {
            preserveScroll: true,
        });
        setDeleteDiscountCandidate(null);
    };

    const handleDeleteVoucher = (voucher: Voucher): void => {
        setDeleteVoucherCandidate(voucher);
    };

    const confirmDeleteVoucher = (): void => {
        if (deleteVoucherCandidate === null) {
            return;
        }

        router.delete(route('admin.vouchers.destroy', deleteVoucherCandidate.id), {
            preserveScroll: true,
        });
        setDeleteVoucherCandidate(null);
    };

    return (
        <AdminLayout title="Voucher & Diskon">
            <Head title="Voucher & Diskon" />

            <AlertDialog
                isOpen={deleteDiscountCandidate !== null}
                title="Hapus Diskon"
                message={`Hapus diskon "${deleteDiscountCandidate?.name ?? ''}" untuk produk "${deleteDiscountCandidate?.product.name ?? ''}"?`}
                confirmLabel="Ya, Hapus"
                confirmType="error"
                onCancel={() => setDeleteDiscountCandidate(null)}
                onConfirm={confirmDeleteDiscount}
            />

            <AlertDialog
                isOpen={deleteVoucherCandidate !== null}
                title="Hapus Voucher"
                message={`Voucher "${deleteVoucherCandidate?.code ?? ''}" akan dihapus. Lanjutkan?`}
                confirmLabel="Ya, Hapus"
                confirmType="error"
                onCancel={() => setDeleteVoucherCandidate(null)}
                onConfirm={confirmDeleteVoucher}
            />

            <PromoFlashAlert success={flash?.success} error={flash?.error} />
            <PromoHeader />
            <PromoTabs activeTab={activeTab} onChange={setActiveTab} />

            {activeTab === 'discounts' ? (
                <DiscountTable
                    discounts={discounts}
                    onCreate={openCreateDiscount}
                    onEdit={openEditDiscount}
                    onDelete={handleDeleteDiscount}
                />
            ) : (
                <VoucherTable
                    vouchers={vouchers}
                    onCreate={openCreateVoucher}
                    onEdit={openEditVoucher}
                    onDelete={handleDeleteVoucher}
                />
            )}

            <DiscountFormModal
                isOpen={isDiscountModalOpen}
                products={products}
                initialData={editingDiscount}
                onClose={() => setIsDiscountModalOpen(false)}
            />

            <VoucherFormModal
                isOpen={isVoucherModalOpen}
                products={products}
                initialData={editingVoucher}
                onClose={() => setIsVoucherModalOpen(false)}
            />
        </AdminLayout>
    );
}
