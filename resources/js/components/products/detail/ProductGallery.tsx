import { useState } from 'react';
import { Package, ZoomIn } from 'lucide-react';

interface ProductImage {
    id: number;
    url: string;
}

interface ProductGalleryProps {
    images: ProductImage[];
    mainImage?: string | null;
    name: string;
}

export default function ProductGallery({ images, mainImage, name }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);

    const allImages = images.length > 0 ? images : mainImage ? [{ id: 1, url: mainImage }] : [];

    if (allImages.length === 0) {
        return (
            <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center">
                <Package className="w-32 h-32 text-base-content/20" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl overflow-hidden group">
                <img
                    src={allImages[selectedImage]?.url || mainImage}
                    alt={name}
                    className="w-full h-full object-cover"
                />
                
                {/* Zoom Indicator */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="btn btn-ghost btn-sm text-white/80">
                        <ZoomIn className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Thumbnail Images */}
            {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                    {allImages.map((image, index) => (
                        <button
                            key={image.id}
                            onClick={() => setSelectedImage(index)}
                            className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                                selectedImage === index
                                    ? 'border-primary'
                                    : 'border-transparent hover:border-base-300'
                            }`}
                        >
                            <img
                                src={image.url}
                                alt={`${name} - ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
