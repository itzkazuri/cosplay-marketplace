import { useMemo, useState } from "react";
import { useForm } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import {
    Save,
    X,
    Package,
    Layers,
    Image,
    Settings,
    ChevronLeft,
    Sparkles,
    Weight,
} from "lucide-react";
import { Category } from "@/types";
import { useToast } from "@/components/ui/Toast";
import BasicInfoTab from "./BasicInfoTab";
import PricingTab from "./PricingTab";
import VariantTab from "./VariantTab";
import ImageUploader from "./ImageUploader";
import SettingsTab from "./SettingsTab";

interface ProductData {
    id?: number;
    name: string;
    slug?: string;
    category_id: string | number;
    description: string;
    base_price: string | number;
    weight: string | number;
    main_image: string | null;
    is_custom: boolean;
    is_active: boolean;
    skus: Array<{
        id?: number;
        sku: string;
        size?: string | null;
        gender?: string | null;
        color?: string | null;
        custom_option?: string | null;
        price: string | number;
        stock: string | number;
        is_custom_order?: boolean;
        is_active?: boolean;
    }>;
    images: Array<{
        id?: number;
        url: string;
        sort_order?: number;
    }>;
}

interface CreateEditFormProps {
    product: ProductData | null;
    categories: Category[];
}

type TabKey = "basic" | "pricing" | "variants" | "images" | "settings";

interface TabConfig {
    key: TabKey;
    label: string;
    icon: React.ReactNode;
}

interface PreviewImageSlot {
    id?: number;
    preview: string | null;
    file: File | null;
}

interface ProductFormData {
    name: string;
    category_id: string | number;
    description: string;
    base_price: string | number;
    weight: string | number;
    main_image: File | null;
    is_custom: boolean;
    is_active: boolean;
}

const tabs: TabConfig[] = [
    {
        key: "basic",
        label: "Info Dasar",
        icon: <Package className="h-4 w-4" />,
    },
    { key: "pricing", label: "Berat", icon: <Weight className="h-4 w-4" /> },
    {
        key: "variants",
        label: "Variant & Stok",
        icon: <Layers className="h-4 w-4" />,
    },
    { key: "images", label: "Gambar", icon: <Image className="h-4 w-4" /> },
    {
        key: "settings",
        label: "Pengaturan",
        icon: <Settings className="h-4 w-4" />,
    },
];

export default function CreateEditForm({
    product,
    categories,
}: CreateEditFormProps): JSX.Element {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<TabKey>("basic");
    const [skus, setSkus] = useState(product?.skus || []);
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(
        product?.main_image || null,
    );
    const [previewImages, setPreviewImages] = useState<PreviewImageSlot[]>(
        () => {
            const existing = product?.images ?? [];
            return Array.from({ length: 3 }, (_, index) => ({
                id: existing[index]?.id,
                preview: existing[index]?.url ?? null,
                file: null,
            }));
        },
    );

    const isEditing = !!product;

    const { data, setData, post, processing, errors, transform } =
        useForm<ProductFormData>({
            name: product?.name || "",
            category_id: product?.category_id || "",
            description: product?.description || "",
            base_price: product?.base_price || "",
            weight: product?.weight || "",
            main_image: null,
            is_custom: product?.is_custom || false,
            is_active: product?.is_active ?? true,
        });

    const hasAnyPreviewFile = useMemo(
        () => previewImages.some((previewImage) => previewImage.file !== null),
        [previewImages],
    );

    const buildSku = (
        productName: string,
        skuData: ProductData["skus"][number],
    ): string => {
        const parts = [
            productName,
            skuData.size ?? "",
            skuData.gender ? skuData.gender.toUpperCase() : "",
            skuData.color ?? "",
            skuData.custom_option ?? "",
        ]
            .map((part) => part.toString().trim())
            .filter(Boolean);

        if (parts.length === 0) return "";

        return parts
            .join("-")
            .toUpperCase()
            .replace(/[^A-Z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    const syncAutoSku = (
        currentSku: ProductData["skus"][number],
        nextSku: ProductData["skus"][number],
    ): ProductData["skus"][number] => {
        const previousAuto = buildSku(data.name, currentSku);
        const shouldAuto =
            currentSku.sku.trim() === "" || currentSku.sku === previousAuto;
        if (!shouldAuto) return nextSku;
        return { ...nextSku, sku: buildSku(data.name, nextSku) };
    };

    const handleDataChange = (
        field: string,
        value: string | number | boolean | File | null,
    ): void => {
        setData(field as keyof ProductFormData, value as never);

        if (field === "name") {
            const nextName = value?.toString() ?? "";
            const nextSkus = skus.map((sku) => {
                const previousAuto = buildSku(data.name, sku);
                const shouldAuto =
                    sku.sku.trim() === "" || sku.sku === previousAuto;
                if (!shouldAuto) return sku;
                return { ...sku, sku: buildSku(nextName, sku) };
            });
            setSkus(nextSkus);
        }
    };

    const handleMainImageChange = (file: File | null): void => {
        setData("main_image", file);
        if (file === null) {
            setMainImagePreview(product?.main_image ?? null);
            return;
        }
        setMainImagePreview(URL.createObjectURL(file));
    };

    const handlePreviewImageChange = (
        index: number,
        file: File | null,
    ): void => {
        const nextPreviewImages = [...previewImages];
        nextPreviewImages[index] = {
            ...nextPreviewImages[index],
            file,
            preview: file
                ? URL.createObjectURL(file)
                : (product?.images?.[index]?.url ?? null),
        };
        setPreviewImages(nextPreviewImages);
    };

    const handleAddSku = (): void => {
        const newSku = {
            sku: "",
            size: null,
            gender: "unisex",
            color: null,
            custom_option: null,
            price: "",
            stock: 0,
            is_custom_order: false,
            is_active: true,
        };
        setSkus([...skus, { ...newSku, sku: buildSku(data.name, newSku) }]);
    };

    const handleRemoveSku = (index: number): void => {
        setSkus(skus.filter((_, skuIndex) => skuIndex !== index));
    };

    const handleUpdateSku = (
        index: number,
        field: string,
        value: string | number | boolean | null,
    ): void => {
        const nextSkus = [...skus];
        const currentSku = nextSkus[index];
        const updatedSku = { ...currentSku, [field]: value };

        if (field === "sku") {
            nextSkus[index] = updatedSku;
            setSkus(nextSkus);
            return;
        }

        nextSkus[index] = syncAutoSku(currentSku, updatedSku);
        setSkus(nextSkus);
    };

    const handleSubmit = (event: React.FormEvent): void => {
        event.preventDefault();

        const selectedPreviewFiles = previewImages
            .map((previewImage) => previewImage.file)
            .filter((file): file is File => file instanceof File);

        if (
            isEditing &&
            selectedPreviewFiles.length > 0 &&
            selectedPreviewFiles.length < 3
        ) {
            showToast({
                type: "warning",
                title: "Preview Belum Lengkap",
                message:
                    "Jika ingin ganti preview, unggah tepat 3 gambar preview baru.",
            });
            return;
        }

        transform((formData) => {
            const payload: Record<string, unknown> = { ...formData, skus };

            const skuPrices = skus
                .map((sku) => Number(sku.price))
                .filter((price) => Number.isFinite(price));
            payload.base_price =
                skuPrices.length > 0
                    ? Math.min(...skuPrices)
                    : formData.base_price;

            if (formData.main_image instanceof File)
                payload.main_image = formData.main_image;
            if (selectedPreviewFiles.length === 3)
                payload.images = selectedPreviewFiles;
            if (isEditing) payload._method = "put";

            return payload;
        });

        const endpoint =
            isEditing && product?.id
                ? route("admin.products.update", product.id)
                : route("admin.products.store");

        post(endpoint, {
            forceFormData: true,
            onFinish: () => {
                transform((formData) => formData);
            },
        });
    };

    const handleCancel = (): void => {
        router.visit(route("admin.products.index"));
    };

    const skuErrors: Record<
        number,
        { sku?: string; price?: string; stock?: string }
    > = {};
    Object.entries(errors).forEach(([key, value]) => {
        if (key.startsWith("skus.")) {
            const parts = key.split(".");
            const index = parseInt(parts[1]);
            const field = parts[2];
            if (!skuErrors[index]) skuErrors[index] = {};
            skuErrors[index][field as "sku" | "price" | "stock"] = value;
        }
    });

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* ── Header Card ── */}
            <div className="card rounded-2xl border border-base-300 bg-base-100 p-5">
                {/* Title + Action Buttons */}
                <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                    <div className="min-w-0">
                        <h2 className="flex items-center gap-2 text-2xl font-black text-base-content">
                            <Sparkles className="h-6 w-6 shrink-0 text-primary" />
                            <span className="truncate">
                                {isEditing
                                    ? "Edit Produk"
                                    : "Tambah Produk Baru"}
                            </span>
                        </h2>
                        <p className="mt-1 text-sm text-base-content/50 truncate">
                            {isEditing
                                ? `Mengedit: ${product?.name}`
                                : "Lengkapi informasi produk di bawah ini"}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="btn btn-ghost btn-sm gap-2 rounded-xl font-bold"
                        >
                            <X className="h-4 w-4" />
                            <span className="hidden sm:inline">Batal</span>
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="btn btn-primary btn-sm gap-2 rounded-xl font-black shadow-lg shadow-primary/20"
                        >
                            <Save className="h-4 w-4" />
                            {processing
                                ? "Menyimpan..."
                                : isEditing
                                  ? "Simpan Perubahan"
                                  : "Simpan Produk"}
                        </button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                                activeTab === tab.key
                                    ? "bg-primary text-primary-content shadow-lg shadow-primary/30"
                                    : "bg-base-200 text-base-content/70 hover:bg-base-300 hover:text-base-content"
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Tab Content Card ── */}
            <div className="card rounded-2xl border border-base-300 bg-base-100 p-5">
                {activeTab === "basic" && (
                    <BasicInfoTab
                        categories={categories}
                        formData={{
                            name: data.name,
                            category_id: data.category_id,
                            description: data.description,
                        }}
                        errors={{
                            name: errors.name,
                            category_id: errors.category_id,
                            description: errors.description,
                        }}
                        onDataChange={handleDataChange}
                    />
                )}

                {activeTab === "pricing" && (
                    <PricingTab
                        formData={{ weight: data.weight }}
                        errors={{ weight: errors.weight }}
                        onDataChange={handleDataChange}
                    />
                )}

                {activeTab === "variants" && (
                    <VariantTab
                        skus={skus}
                        basePriceError={errors.base_price}
                        errors={{ skus: skuErrors }}
                        onAddSku={handleAddSku}
                        onRemoveSku={handleRemoveSku}
                        onUpdateSku={handleUpdateSku}
                    />
                )}

                {activeTab === "images" && (
                    <ImageUploader
                        mainImagePreview={mainImagePreview}
                        previewImages={previewImages}
                        hasAnyPreviewFile={hasAnyPreviewFile}
                        errors={errors}
                        onMainImageChange={handleMainImageChange}
                        onPreviewImageChange={handlePreviewImageChange}
                    />
                )}

                {activeTab === "settings" && (
                    <SettingsTab
                        isEditing={isEditing}
                        formData={{
                            is_active: data.is_active,
                            is_custom: data.is_custom,
                        }}
                        onDataChange={handleDataChange}
                    />
                )}
            </div>

            {/* ── Footer Actions ── */}
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-ghost gap-2 rounded-xl font-bold"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Kembali
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="btn btn-primary gap-2 rounded-xl font-black shadow-lg shadow-primary/20"
                >
                    <Save className="h-4 w-4" />
                    {processing
                        ? "Menyimpan..."
                        : isEditing
                          ? "Simpan Perubahan"
                          : "Simpan Produk"}
                </button>
            </div>
        </form>
    );
}
