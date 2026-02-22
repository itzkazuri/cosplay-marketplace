import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface RevenueCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    children?: ReactNode;
}

export default function RevenueCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    trendValue,
    children,
}: RevenueCardProps) {
    const trendColors = {
        up: 'badge-success',
        down: 'badge-error',
        neutral: 'badge-ghost',
    };

    const trendIcons = {
        up: '↑',
        down: '↓',
        neutral: '→',
    };

    return (
        <div className="card bg-base-100 shadow-sm border border-base-300 hover:shadow-md transition-shadow duration-200">
            <div className="card-body p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-base-content/70 mb-1">{title}</p>
                        <h3 className="text-2xl font-bold text-base-content">{value}</h3>
                        {description && (
                            <p className="text-xs text-base-content/50 mt-1">{description}</p>
                        )}
                        {trend && trendValue && (
                            <div className={`badge ${trendColors[trend]} badge-sm gap-1 mt-2`}>
                                <span>{trendIcons[trend]}</span>
                                <span>{trendValue}</span>
                            </div>
                        )}
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                    </div>
                </div>
                {children && (
                    <div className="mt-4 pt-4 border-t border-base-300">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
}
