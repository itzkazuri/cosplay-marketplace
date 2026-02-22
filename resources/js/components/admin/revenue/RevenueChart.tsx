import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

interface RevenueChartProps {
    data: any[];
    type: 'line' | 'bar' | 'pie';
    dataKey?: string;
    nameKey?: string;
    xKey?: string;
    title: string;
    colors?: string[];
    height?: number;
}

const CHART_COLORS = [
    'hsl(var(--p))',
    'hsl(var(--s))',
    'hsl(var(--a))',
    'hsl(var(--in))',
    'hsl(var(--su))',
    'hsl(var(--er))',
    'hsl(var(--wa))',
];

export default function RevenueChart({
    data,
    type,
    dataKey = 'revenue',
    nameKey = 'name',
    xKey,
    title,
    colors = CHART_COLORS,
    height = 300,
}: RevenueChartProps) {
    return (
        <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body">
                <h3 className="card-title text-base-content mb-4">{title}</h3>
                <div style={{ width: '100%', height }}>
                    <ResponsiveContainer>
                        {type === 'line' && (
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--bc) / 0.1)" />
                                <XAxis
                                    dataKey={xKey || 'day'}
                                    stroke="hsl(var(--bc) / 0.5)"
                                    fontSize={12}
                                />
                                <YAxis
                                    stroke="hsl(var(--bc) / 0.5)"
                                    fontSize={12}
                                    tickFormatter={(value) => `Rp ${new Intl.NumberFormat('id-ID').format(value)}`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--b1))',
                                        border: '1px solid hsl(var(--bc) / 0.1)',
                                        borderRadius: '0.5rem',
                                    }}
                                    formatter={(value: number) => [`Rp ${new Intl.NumberFormat('id-ID').format(value)}`, 'Pendapatan']}
                                />
                                <Line
                                    type="monotone"
                                    dataKey={dataKey}
                                    stroke={colors[0]}
                                    strokeWidth={2}
                                    dot={{ fill: colors[0] }}
                                />
                            </LineChart>
                        )}
                        {type === 'bar' && (
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--bc) / 0.1)" />
                                <XAxis
                                    dataKey={xKey || 'month_name'}
                                    stroke="hsl(var(--bc) / 0.5)"
                                    fontSize={12}
                                />
                                <YAxis
                                    stroke="hsl(var(--bc) / 0.5)"
                                    fontSize={12}
                                    tickFormatter={(value) => `Rp ${new Intl.NumberFormat('id-ID').format(value)}`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--b1))',
                                        border: '1px solid hsl(var(--bc) / 0.1)',
                                        borderRadius: '0.5rem',
                                    }}
                                    formatter={(value: number) => [`Rp ${new Intl.NumberFormat('id-ID').format(value)}`, 'Pendapatan']}
                                />
                                <Bar dataKey={dataKey} fill={colors[0]} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        )}
                        {type === 'pie' && (
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={height / 2 - 20}
                                    fill={colors[0]}
                                    dataKey={dataKey}
                                    nameKey={nameKey}
                                >
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={colors[index % colors.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--b1))',
                                        border: '1px solid hsl(var(--bc) / 0.1)',
                                        borderRadius: '0.5rem',
                                    }}
                                    formatter={(value: number, name: string) => [
                                        `Rp ${new Intl.NumberFormat('id-ID').format(value)}`,
                                        name === 'total' ? 'Total' : name,
                                    ]}
                                />
                            </PieChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
