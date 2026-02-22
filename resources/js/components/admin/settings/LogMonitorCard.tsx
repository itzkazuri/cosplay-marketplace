import { router } from '@inertiajs/react';
import { RefreshCcw, TerminalSquare } from 'lucide-react';

interface LogEntry {
    timestamp: string;
    level: string;
    message: string;
}

interface LogMonitorCardProps {
    logs: LogEntry[];
    logRefreshedAt: string;
}

const levelClassMap: Record<string, string> = {
    ERROR: 'badge-error',
    CRITICAL: 'badge-error',
    WARNING: 'badge-warning',
    INFO: 'badge-info',
    DEBUG: 'badge-ghost',
};

export default function LogMonitorCard({ logs, logRefreshedAt }: LogMonitorCardProps): JSX.Element {
    const refreshLogs = (): void => {
        router.reload({
            only: ['logs', 'log_refreshed_at'],
            preserveScroll: true,
        });
    };

    return (
        <div className="card border border-base-300 bg-base-100 shadow-xl">
            <div className="card-body gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="flex items-center gap-2 text-lg font-black uppercase tracking-wide">
                            <TerminalSquare className="h-5 w-5 text-primary" />
                            Monitor Log Laravel
                        </h2>
                        <p className="text-xs font-medium text-base-content/60">Terakhir diperbarui: {logRefreshedAt}</p>
                    </div>
                    <button type="button" className="btn btn-outline btn-sm rounded-xl" onClick={refreshLogs}>
                        <RefreshCcw className="h-4 w-4" />
                        Refresh Log
                    </button>
                </div>

                <div className="max-h-[30rem] space-y-3 overflow-y-auto rounded-2xl border border-base-300 bg-base-200 p-3">
                    {logs.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-base-300 bg-base-100 p-6 text-center text-sm font-semibold text-base-content/60">
                            Belum ada log yang bisa ditampilkan.
                        </div>
                    ) : (
                        logs.map((entry, index) => (
                            <div key={`${entry.timestamp}-${index}`} className="rounded-xl border border-base-300 bg-base-100 p-3">
                                <div className="mb-2 flex items-center gap-2">
                                    <span className={`badge badge-sm font-bold ${levelClassMap[entry.level] ?? 'badge-ghost'}`}>
                                        {entry.level}
                                    </span>
                                    <span className="text-xs font-semibold text-base-content/60">{entry.timestamp}</span>
                                </div>
                                <pre className="whitespace-pre-wrap break-words text-xs text-base-content">{entry.message}</pre>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
