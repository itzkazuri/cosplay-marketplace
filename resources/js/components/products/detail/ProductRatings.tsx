import { Star, User, ThumbsUp, CheckCircle } from 'lucide-react';

interface RatingUser {
    name: string;
    avatar?: string | null;
}

interface ProductRating {
    id: number;
    user: RatingUser;
    rating: number;
    review?: string | null;
    images: string[];
    isVerifiedPurchase: boolean;
    approvedAt: string;
    helpfulCount: number;
}

interface ProductRatingsProps {
    ratings: ProductRating[];
    ratingDistribution: Record<number, number>;
    averageRating: number;
    totalReviews: number;
}

export default function ProductRatings({
    ratings,
    ratingDistribution,
    averageRating,
    totalReviews,
}: ProductRatingsProps) {
    const totalRatings = Object.values(ratingDistribution).reduce((a, b) => a + b, 0);

    return (
        <div className="space-y-6">
            {/* Rating Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Average Rating */}
                <div className="text-center p-6 bg-base-200 rounded-xl">
                    <div className="text-5xl font-bold text-primary mb-2">
                        {averageRating.toFixed(1)}
                    </div>
                    <div className="flex justify-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-6 h-6 ${
                                    star <= Math.round(averageRating)
                                        ? 'fill-warning text-warning'
                                        : 'fill-base-300 text-base-300'
                                }`}
                            />
                        ))}
                    </div>
                    <div className="text-sm text-base-content/60">
                        {totalReviews} ulasan
                    </div>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                        const count = ratingDistribution[rating] || 0;
                        const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
                        return (
                            <div key={rating} className="flex items-center gap-3">
                                <div className="flex items-center gap-1 w-16">
                                    <span className="text-sm font-medium">{rating}</span>
                                    <Star className="w-4 h-4 fill-warning text-warning" />
                                </div>
                                <div className="flex-1 h-2 bg-base-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-warning rounded-full transition-all"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="text-sm text-base-content/60 w-12 text-right">
                                    {count}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Reviews List */}
            <div className="mt-8">
                <h3 className="text-lg font-bold mb-4">Ulasan Produk</h3>
                
                {ratings.length === 0 ? (
                    <div className="text-center py-12 text-base-content/60">
                        <p>Belum ada ulasan untuk produk ini.</p>
                        <p className="text-sm mt-2">Jadilah yang pertama memberikan ulasan!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {ratings.map((rating) => (
                            <div
                                key={rating.id}
                                className="p-4 bg-base-200 rounded-xl"
                            >
                                {/* Reviewer Info */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        {rating.user.avatar ? (
                                            <img
                                                src={rating.user.avatar}
                                                alt={rating.user.name}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                                                <User className="w-6 h-6 text-primary-content" />
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-semibold text-sm">
                                                {rating.user.name}
                                            </div>
                                            <div className="text-xs text-base-content/60">
                                                {rating.approvedAt}
                                            </div>
                                        </div>
                                    </div>
                                    {rating.isVerifiedPurchase && (
                                        <div className="flex items-center gap-1 text-success text-xs">
                                            <CheckCircle className="w-4 h-4" />
                                            <span>Terverified Purchase</span>
                                        </div>
                                    )}
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-1 mb-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-4 h-4 ${
                                                star <= rating.rating
                                                    ? 'fill-warning text-warning'
                                                    : 'fill-base-300 text-base-300'
                                            }`}
                                        />
                                    ))}
                                </div>

                                {/* Review */}
                                {rating.review && (
                                    <p className="text-sm text-base-content mb-3">
                                        {rating.review}
                                    </p>
                                )}

                                {/* Review Images */}
                                {rating.images && rating.images.length > 0 && (
                                    <div className="flex gap-2 mb-3 overflow-x-auto">
                                        {rating.images.map((image, index) => (
                                            <img
                                                key={index}
                                                src={image}
                                                alt={`Review ${index + 1}`}
                                                className="w-20 h-20 rounded-lg object-cover"
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Helpful */}
                                <button className="flex items-center gap-2 text-xs text-base-content/60 hover:text-base-content">
                                    <ThumbsUp className="w-4 h-4" />
                                    <span>Membantu ({rating.helpfulCount})</span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
