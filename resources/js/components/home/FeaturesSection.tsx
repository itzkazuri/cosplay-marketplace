import {
    BadgeCheck,
    CreditCard,
    Headset,
    Ruler,
    Sparkles,
    Truck,
} from 'lucide-react';

export default function FeaturesSection() {
    const features = [
        {
            icon: Sparkles,
            title: "Kualitas Premium",
            description: "Bahan berkualitas tinggi dengan detail yang akurat sesuai karakter asli",
        },
        {
            icon: Ruler,
            title: "Custom Size",
            description: "Gratis penyesuaian ukuran sesuai tubuhmu tanpa biaya tambahan",
        },
        {
            icon: Truck,
            title: "Pengiriman Cepat",
            description: "Pengiriman ke seluruh Indonesia dengan tracking real-time",
        },
        {
            icon: CreditCard,
            title: "Pembayaran Aman",
            description: "Berbagai metode pembayaran yang aman dan terpercaya",
        },
        {
            icon: BadgeCheck,
            title: "Garansi Return",
            description: "30 hari garansi return jika produk tidak sesuai atau rusak",
        },
        {
            icon: Headset,
            title: "Support 24/7",
            description: "Tim customer service siap membantu kapan saja",
        },
    ];

    return (
        <section className="py-16 bg-base-100">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                        Kenapa Memilih <span className="text-primary">Kami?</span>
                    </h2>
                    <p className="text-base-content/70 max-w-2xl mx-auto">
                        Komitmen kami untuk memberikan pengalaman belanja cosplay terbaik
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;

                        return (
                        <div 
                            key={index}
                            className="flex gap-4 p-6 rounded-xl bg-base-200 hover:bg-base-300 transition-colors"
                        >
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                                <Icon className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                                <p className="text-base-content/70 text-sm">{feature.description}</p>
                            </div>
                        </div>
                    );
                    })}
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap justify-center gap-8 mt-12 pt-12 border-t border-base-300">
                    <div className="flex items-center gap-2 text-base-content/70">
                        <BadgeCheck className="h-5 w-5 text-success" />
                        <span>100% Original Quality</span>
                    </div>
                    <div className="flex items-center gap-2 text-base-content/70">
                        <BadgeCheck className="h-5 w-5 text-success" />
                        <span>Verified Seller</span>
                    </div>
                    <div className="flex items-center gap-2 text-base-content/70">
                        <BadgeCheck className="h-5 w-5 text-success" />
                        <span>Secure Transaction</span>
                    </div>
                    <div className="flex items-center gap-2 text-base-content/70">
                        <BadgeCheck className="h-5 w-5 text-success" />
                        <span>Money Back Guarantee</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
