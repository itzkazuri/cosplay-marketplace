import { Gift, Percent } from 'lucide-react';

type PromoTab = 'discounts' | 'vouchers';

interface PromoTabsProps {
    activeTab: PromoTab;
    onChange: (tab: PromoTab) => void;
}

export default function PromoTabs({ activeTab, onChange }: PromoTabsProps): JSX.Element {
    return (
        <div className="tabs tabs-boxed gap-2 rounded-2xl border border-base-300 bg-base-100 p-2">
            <button
                type="button"
                className={`tab h-10 flex-1 rounded-xl text-xs font-black uppercase tracking-wider ${activeTab === 'discounts' ? 'tab-active' : ''}`}
                onClick={() => onChange('discounts')}
            >
                <Percent className="mr-2 h-4 w-4" />
                Diskon Produk
            </button>
            <button
                type="button"
                className={`tab h-10 flex-1 rounded-xl text-xs font-black uppercase tracking-wider ${activeTab === 'vouchers' ? 'tab-active' : ''}`}
                onClick={() => onChange('vouchers')}
            >
                <Gift className="mr-2 h-4 w-4" />
                Voucher Produk
            </button>
        </div>
    );
}
