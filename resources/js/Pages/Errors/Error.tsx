import { Link, Head } from "@inertiajs/react";
import {
    Home,
    RefreshCcw,
    Copy,
    Check,
    ChevronDown,
    Terminal,
    Bug,
} from "lucide-react";
import { useState, useEffect } from "react";

interface ErrorProps {
    status?: number;
    message?: string;
    debug?: {
        exception?: string;
        file?: string;
        line?: number;
        message?: string;
        trace?: string;
    } | null;
}

/**
 * MSH Error Code System
 * Format: MSH-[STATUS]-[CATEGORY][SEQUENCE]
 *
 * CATEGORY CODES:
 * A = Auth / Session errors
 * R = Rate / Request errors
 * S = Server errors
 * N = Navigation / Not Found errors
 * X = Unknown / Generic errors
 */

const CATEGORY_MAP: Record<number, string> = {
    500: "S",
    404: "N",
    403: "A",
    401: "A",
    419: "A",
    429: "R",
    408: "R",
};

function generateMshCode(status: number): string {
    const category = CATEGORY_MAP[status] || "X";
    const seed = (Math.floor(Date.now() / 1000) % 256) ^ (status % 256);
    const seq = seed.toString(16).toUpperCase().padStart(2, "0");
    return `MSH-${status}-${category}${seq}`;
}

type ErrorColor = "error" | "warning" | "info" | "success";

interface ErrorMeta {
    title: string;
    description: string;
    hint: string;
    color: ErrorColor;
    image: string;
    icon: string;
}

const ERROR_META: Record<number, ErrorMeta> = {
    500: {
        title: "Terjadi Kesalahan Internal",
        description:
            "Server mengalami masalah internal. Tim kami akan segera menanganinya.",
        hint: "Biasanya ini bersifat sementara. Coba lagi dalam beberapa menit.",
        color: "error",
        image: "/image/404.png",
        icon: "💥",
    },
    404: {
        title: "Halaman Tidak Ditemukan",
        description: "Halaman yang kamu cari tidak ada atau sudah dipindahkan.",
        hint: "Periksa kembali URL atau kembali ke halaman utama.",
        color: "warning",
        image: "/image/404.png",
        icon: "🔍",
    },
    403: {
        title: "Akses Ditolak",
        description: "Kamu tidak memiliki izin untuk mengakses halaman ini.",
        hint: "Pastikan kamu sudah login dengan akun yang tepat.",
        color: "error",
        image: "/image/forbiden.png",
        icon: "🚫",
    },
    401: {
        title: "Belum Login",
        description:
            "Kamu harus login terlebih dahulu untuk mengakses halaman ini.",
        hint: "Silakan login dan coba lagi.",
        color: "warning",
        image: "/image/notauth.png",
        icon: "🔐",
    },
    419: {
        title: "Sesi Kedaluwarsa",
        description:
            "Sesi kamu telah berakhir karena tidak aktif dalam waktu lama.",
        hint: "Refresh halaman untuk memperbarui sesi kamu.",
        color: "info",
        image: "/image/notauth.png",
        icon: "⏰",
    },
    429: {
        title: "Terlalu Banyak Permintaan",
        description:
            "Kamu telah mengirim terlalu banyak permintaan dalam waktu singkat.",
        hint: "Tunggu sebentar sebelum mencoba lagi.",
        color: "warning",
        image: "/image/404.png",
        icon: "⚡",
    },
    408: {
        title: "Waktu Habis",
        description: "Server membutuhkan waktu terlalu lama untuk merespons.",
        hint: "Periksa koneksi internet kamu dan coba lagi.",
        color: "info",
        image: "/image/404.png",
        icon: "🕐",
    },
};

type ColorMap = {
    text: string;
    bg: string;
    border: string;
    badge: string;
    alert: string;
    softBg: string;
};

const COLOR_CLASSES: Record<ErrorColor, ColorMap> = {
    error: {
        text: "text-error",
        bg: "bg-error",
        border: "border-error",
        badge: "badge-error",
        alert: "alert-error",
        softBg: "bg-error/10",
    },
    warning: {
        text: "text-warning",
        bg: "bg-warning",
        border: "border-warning",
        badge: "badge-warning",
        alert: "alert-warning",
        softBg: "bg-warning/10",
    },
    info: {
        text: "text-info",
        bg: "bg-info",
        border: "border-info",
        badge: "badge-info",
        alert: "alert-info",
        softBg: "bg-info/10",
    },
    success: {
        text: "text-success",
        bg: "bg-success",
        border: "border-success",
        badge: "badge-success",
        alert: "alert-success",
        softBg: "bg-success/10",
    },
};

export default function Error({ status = 500, message, debug }: ErrorProps) {
    const [mshCode] = useState(() => generateMshCode(status));
    const [copied, setCopied] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [showTrace, setShowTrace] = useState(false);
    const [glitch, setGlitch] = useState(false);

    const meta: ErrorMeta = ERROR_META[status] ?? {
        title: "Error Tidak Dikenal",
        description: "Terjadi kesalahan yang tidak diketahui.",
        hint: "Coba refresh halaman atau hubungi support.",
        color: "error" as ErrorColor,
        image: "/image/404.png",
        icon: "❓",
    };

    const c = COLOR_CLASSES[meta.color];

    // Glitch animation on mount
    useEffect(() => {
        setGlitch(true);
        const t = setTimeout(() => setGlitch(false), 600);
        return () => clearTimeout(t);
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(mshCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Parse file path to show only relative part
    const formatFilePath = (file: string) => {
        const idx = file.indexOf("/app/");
        return idx !== -1 ? ".../" + file.slice(idx + 1) : file;
    };

    return (
        <>
            <Head title={`${status} — ${meta.title}`} />

            <div className="min-h-screen bg-base-100 flex items-center justify-center px-4 py-12 relative overflow-hidden">
                {/* Ambient glow background */}
                <div
                    className={`pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] ${c.bg} opacity-[0.06] blur-[120px] rounded-full`}
                />
                <div
                    className={`pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] ${c.bg} opacity-[0.04] blur-[100px] rounded-full`}
                />

                <div className="relative z-10 w-full max-w-xl mx-auto">
                    {/* ── Header ── */}
                    <div className="text-center mb-8">
                        {/* Illustration */}
                        <div className="relative inline-block mb-6 group">
                            <div
                                className={`absolute inset-0 blur-3xl opacity-25 ${c.bg} rounded-full animate-pulse`}
                            />
                            <img
                                src={meta.image}
                                alt={meta.title}
                                className="relative w-52 h-52 object-contain mx-auto drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>

                        {/* Status badge */}
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <div
                                className={`badge ${c.badge} badge-outline font-mono font-bold px-3 py-2 text-sm`}
                            >
                                HTTP {status}
                            </div>
                            <div
                                className={`badge badge-outline badge-ghost font-mono text-xs px-3 py-2`}
                            >
                                {meta.icon} {meta.color.toUpperCase()}
                            </div>
                        </div>

                        <h1 className="text-3xl font-extrabold text-base-content mb-2 tracking-tight">
                            {meta.title}
                        </h1>
                        <p className="text-base-content/55 text-sm leading-relaxed max-w-sm mx-auto">
                            {meta.description}
                        </p>
                    </div>

                    {/* ── MSH Code ── */}
                    <div
                        className={`card border ${c.border} bg-base-200 shadow-lg mb-4`}
                    >
                        <div className="card-body p-4 gap-2">
                            <p className="label-text text-base-content/40 text-xs uppercase tracking-widest font-semibold">
                                Kode Referensi Error
                            </p>
                            <div className="flex items-center gap-2 bg-base-300 rounded-xl px-4 py-3">
                                <Terminal
                                    className={`w-4 h-4 shrink-0 ${c.text}`}
                                />
                                <span
                                    className={`font-mono text-base font-bold tracking-widest flex-1 ${c.text} ${glitch ? "opacity-0" : "opacity-100"} transition-opacity duration-100`}
                                >
                                    {mshCode}
                                </span>
                                <button
                                    onClick={handleCopy}
                                    className="btn btn-ghost btn-xs btn-square"
                                    title="Salin kode"
                                >
                                    {copied ? (
                                        <Check className="w-4 h-4 text-success" />
                                    ) : (
                                        <Copy className="w-4 h-4 text-base-content/40" />
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-base-content/40 leading-relaxed">
                                Sertakan kode ini saat menghubungi support agar
                                masalah dapat dilacak dengan cepat.
                            </p>
                        </div>
                    </div>

                    {/* ── Hint ── */}
                    <div
                        className={`alert ${c.alert} border ${c.border} bg-base-200 mb-4`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className={`shrink-0 w-5 h-5 stroke-current ${c.text}`}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span className="text-sm text-base-content/70">
                            {meta.hint}
                        </span>
                    </div>

                    {/* ── Debug Panel ── */}
                    {(message || debug) && (
                        <div className="mb-4">
                            <div className="collapse collapse-arrow bg-base-200 border border-base-300 rounded-xl">
                                <input
                                    type="checkbox"
                                    checked={showDetail}
                                    onChange={() => setShowDetail((d) => !d)}
                                />
                                <div className="collapse-title flex items-center gap-2 text-sm font-medium text-base-content/50 py-3 min-h-0">
                                    <Bug className="w-4 h-4" />
                                    <span>Debug Laravel</span>
                                    <span
                                        className={`badge badge-xs ${c.badge} badge-outline ml-auto mr-6`}
                                    >
                                        APP_DEBUG ON
                                    </span>
                                </div>

                                <div className="collapse-content px-0 pb-0">
                                    <div className="divider my-0 mx-4" />

                                    {/* Exception type */}
                                    {debug?.exception && (
                                        <div className="px-4 pt-4 pb-2">
                                            <p className="text-xs text-base-content/40 uppercase tracking-wider mb-1 font-semibold">
                                                Exception
                                            </p>
                                            <div className="mockup-code text-xs rounded-lg !bg-base-300 !p-0 overflow-hidden">
                                                <pre
                                                    data-prefix="$"
                                                    className="!bg-transparent !text-error !px-4 !py-2 whitespace-pre-wrap break-all"
                                                >
                                                    <code>
                                                        {debug.exception}
                                                    </code>
                                                </pre>
                                            </div>
                                        </div>
                                    )}

                                    {/* Message */}
                                    {(debug?.message || message) && (
                                        <div className="px-4 py-2">
                                            <p className="text-xs text-base-content/40 uppercase tracking-wider mb-1 font-semibold">
                                                Message
                                            </p>
                                            <div
                                                className={`rounded-lg border ${c.border} ${c.softBg} px-4 py-3`}
                                            >
                                                <p className="text-sm text-base-content/80 font-mono break-all leading-relaxed">
                                                    {debug?.message ?? message}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* File:Line */}
                                    {debug?.file &&
                                        debug.line !== undefined && (
                                            <div className="px-4 py-2">
                                                <p className="text-xs text-base-content/40 uppercase tracking-wider mb-1 font-semibold">
                                                    File
                                                </p>
                                                <div className="flex items-center gap-2 bg-base-300 rounded-lg px-4 py-2.5">
                                                    <span className="font-mono text-xs text-info break-all flex-1 leading-relaxed">
                                                        {formatFilePath(
                                                            debug.file,
                                                        )}
                                                    </span>
                                                    <span className="badge badge-info badge-outline badge-sm font-mono shrink-0">
                                                        :{debug.line}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                    {/* Stack Trace */}
                                    {debug?.trace && (
                                        <div className="px-4 pt-2 pb-4">
                                            <button
                                                onClick={() =>
                                                    setShowTrace((t) => !t)
                                                }
                                                className="btn btn-ghost btn-xs w-full justify-between text-base-content/40 mb-2"
                                            >
                                                <span className="text-xs flex items-center gap-1">
                                                    <Terminal className="w-3 h-3" />
                                                    Stack Trace
                                                </span>
                                                <ChevronDown
                                                    className={`w-3 h-3 transition-transform duration-200 ${showTrace ? "rotate-180" : ""}`}
                                                />
                                            </button>

                                            {showTrace && (
                                                <div className="mockup-code text-xs rounded-xl !bg-base-300 max-h-72 overflow-auto">
                                                    <pre className="!bg-transparent !text-base-content/50 whitespace-pre-wrap break-all px-4 py-3 leading-relaxed">
                                                        {debug.trace}
                                                    </pre>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Actions ── */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        <Link href="/" className="btn btn-primary flex-1 gap-2">
                            <Home className="w-4 h-4" />
                            Ke Beranda
                        </Link>
                        <button
                            onClick={() => window.location.reload()}
                            className="btn btn-outline flex-1 gap-2"
                        >
                            <RefreshCcw className="w-4 h-4" />
                            Refresh Halaman
                        </button>
                    </div>

                    {/* ── Support ── */}
                    <div className="card bg-base-200 border border-base-300">
                        <div className="card-body p-4">
                            <p className="text-center text-xs text-base-content/40 font-semibold uppercase tracking-widest mb-3">
                                Butuh Bantuan?
                            </p>
                            <div className="flex flex-wrap justify-center gap-2">
                                <a
                                    href="mailto:support@cosplayshop.com"
                                    className="btn btn-ghost btn-sm gap-2"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                    Email Support
                                </a>
                                <Link
                                    href="/products"
                                    className="btn btn-ghost btn-sm gap-2"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 15H4L5 9z"
                                        />
                                    </svg>
                                    Lihat Produk
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* ── Footer ── */}
                    <p className="mt-8 text-center text-xs text-base-content/25 font-mono">
                        {mshCode}
                    </p>
                </div>
            </div>
        </>
    );
}
