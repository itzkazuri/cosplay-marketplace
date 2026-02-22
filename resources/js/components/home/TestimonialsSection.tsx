import { BadgeCheck, Star, UserCircle2 } from 'lucide-react';

interface Testimonial {
    id: number;
    name: string;
    avatar?: string | null;
    content: string;
    rating: number;
    product?: string | null;
}

interface TestimonialsSectionProps {
    testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
    return (
        <section className="py-16 bg-base-200">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                        Kata <span className="text-secondary">Mereka</span>
                    </h2>
                    <p className="text-base-content/70 max-w-2xl mx-auto">
                        Testimoni dari para cosplayer yang telah berbelanja di toko kami
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.length === 0 ? (
                        <div className="col-span-full text-center text-base-content/70">
                            Belum ada ulasan pelanggan.
                        </div>
                    ) : (
                        testimonials.map((testimonial) => (
                            <div
                                key={testimonial.id}
                                className="card bg-base-100 hover:shadow-xl transition-all"
                            >
                                <div className="card-body">
                                    {/* Rating */}
                                    <div className="flex text-warning mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < testimonial.rating ? 'fill-current' : 'opacity-30'}`}
                                            />
                                        ))}
                                    </div>

                                    {/* Content */}
                                    <p className="text-base-content/80 mb-4 line-clamp-4">
                                        "{testimonial.content}"
                                    </p>

                                    {/* Product */}
                                    {testimonial.product && (
                                        <div className="badge badge-outline badge-sm w-fit mb-4">
                                            <BadgeCheck className="h-3.5 w-3.5 mr-1" />
                                            {testimonial.product}
                                        </div>
                                    )}

                                    {/* Author */}
                                    <div className="flex items-center gap-3 mt-auto">
                                        {testimonial.avatar ? (
                                            <img
                                                src={testimonial.avatar}
                                                alt={testimonial.name}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-base-200 flex items-center justify-center text-base-content/60">
                                                <UserCircle2 className="h-6 w-6" />
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-bold">{testimonial.name}</div>
                                            <div className="text-sm text-base-content/70">Pelanggan</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
