import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { motion } from 'framer-motion';
import {
    Package,
    DollarSign,
    AlertTriangle,
    TrendingUp,
    MoreHorizontal
} from 'lucide-react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

export default function Dashboard() {
    const { data: overview, isLoading: overviewLoading } = useQuery({
        queryKey: ['analytics-overview'],
        queryFn: async () => {
            const res = await api.get('/analytics/overview');
            return res.data;
        }
    });

    const { data: lowStock, isLoading: stockLoading } = useQuery({
        queryKey: ['analytics-low-stock'],
        queryFn: async () => {
            const res = await api.get('/analytics/low-stock');
            return res.data;
        }
    });

    // Realistic robust mock data for a 2-week period
    const mockSalesData = [
        { name: 'Feb 15', sales: 12400, orders: 45 },
        { name: 'Feb 16', sales: 14200, orders: 52 },
        { name: 'Feb 17', sales: 11000, orders: 38 },
        { name: 'Feb 18', sales: 16800, orders: 61 },
        { name: 'Feb 19', sales: 15300, orders: 55 },
        { name: 'Feb 20', sales: 19400, orders: 74 },
        { name: 'Feb 21', sales: 18100, orders: 68 },
        { name: 'Feb 22', sales: 22000, orders: 82 },
        { name: 'Feb 23', sales: 24500, orders: 89 },
        { name: 'Feb 24', sales: 21300, orders: 77 },
        { name: 'Feb 25', sales: 26800, orders: 95 },
        { name: 'Feb 26', sales: 23400, orders: 85 },
        { name: 'Feb 27', sales: 28900, orders: 104 },
        { name: 'Feb 28', sales: 31200, orders: 112 },
    ];

    const cards = [
        {
            title: 'Total Revenue',
            value: overview ? `$${overview.monthlySales.toLocaleString()}` : '$342,800',
            trend: '+12.5%',
            trendUp: true,
            icon: DollarSign,
        },
        {
            title: 'Active Products',
            value: overview ? overview.totalProducts : '1,248',
            trend: '+4.2%',
            trendUp: true,
            icon: Package,
        },
        {
            title: 'Inventory Value',
            value: overview ? `$${overview.inventoryValue.toLocaleString()}` : '$1,442,000',
            trend: '-1.1%',
            trendUp: false,
            icon: TrendingUp,
        },
        {
            title: 'Low Stock Alerts',
            value: overview ? overview.lowStockItems : '12',
            trend: '+2',
            trendUp: false,
            icon: AlertTriangle,
        }
    ];

    if (overviewLoading) return <div className="p-8 text-center text-gray-500">Loading dashboard metrics...</div>;

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-primary tracking-tight">Overview</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Here's what's happening with your inventory today.
                    </p>
                </div>
                <div className="flex space-x-3">
                    <button className="px-4 py-2 bg-white border border-gray-200 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors shadow-sm">
                        Export Report
                    </button>
                    <button className="px-4 py-2 bg-gray-900 text-sm font-medium text-white rounded-md hover:bg-gray-800 transition-colors shadow-sm">
                        Add Product
                    </button>
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((card, index) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start">
                            <p className="text-sm font-medium text-gray-500">{card.title}</p>
                            <card.icon className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="mt-4 flex items-baseline justify-between">
                            <p className="text-3xl font-semibold text-gray-900 tracking-tight">{card.value}</p>
                            <span className={`text-sm font-medium ${card.trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {card.trend}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Sales Chart */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm lg:col-span-2"
                >
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Revenue Flow</h2>
                            <p className="text-sm text-gray-500">Trailing 14 days performance</p>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockSalesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#111827" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#111827" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    tickFormatter={(value) => `$${value / 1000}k`}
                                    dx={-10}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111827', borderRadius: '8px', border: 'none', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#111827"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorSales)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Low Stock Alerts */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col"
                >
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Action Required</h2>
                            <p className="text-sm text-gray-500">Low stock inventories</p>
                        </div>
                        <span className="bg-rose-50 text-rose-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-rose-100">
                            {lowStock?.length || 0} Alerts
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {stockLoading ? (
                            <div className="animate-pulse space-y-4">
                                {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-100 rounded-md" />)}
                            </div>
                        ) : lowStock?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
                                <Package className="h-10 w-10 mb-3 opacity-50" />
                                <p className="text-sm">Stock levels are optimal.</p>
                            </div>
                        ) : (
                            <ul className="space-y-4">
                                {lowStock?.slice(0, 5).map((item: any) => (
                                    <li key={`${item.product_id}-${item.warehouse_name}`} className="flex items-center justify-between group">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                                                <AlertTriangle className="h-5 w-5 text-gray-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors cursor-pointer">{item.name}</p>
                                                <p className="text-xs text-gray-500">{item.sku} &middot; {item.warehouse_name}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-rose-600">{item.current_stock}</p>
                                            <p className="text-xs text-gray-400">/ {item.min_stock_level} min</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {lowStock?.length > 5 && (
                        <div className="mt-6 pt-4 border-t border-gray-100">
                            <button className="text-sm font-medium text-gray-900 hover:text-gray-600 w-full text-center transition-colors">
                                View all {lowStock.length} items &rarr;
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Recent Orders Table Mockup */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                    <button className="text-sm font-medium text-gray-600 hover:text-gray-900">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 font-medium rounded-tl-lg">Order ID</th>
                                <th className="px-6 py-3 font-medium">Date</th>
                                <th className="px-6 py-3 font-medium">Customer</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium text-right rounded-tr-lg">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">#ORD-0921</td>
                                <td className="px-6 py-4 text-gray-500">Today, 2:42 PM</td>
                                <td className="px-6 py-4 text-gray-700">Enterprise Systems Inc.</td>
                                <td className="px-6 py-4"><span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium border border-emerald-100">Completed</span></td>
                                <td className="px-6 py-4 text-right font-medium text-gray-900">$12,450.00</td>
                            </tr>
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">#ORD-0920</td>
                                <td className="px-6 py-4 text-gray-500">Today, 11:15 AM</td>
                                <td className="px-6 py-4 text-gray-700">Global Logistics Corp</td>
                                <td className="px-6 py-4"><span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md text-xs font-medium border border-amber-100">Processing</span></td>
                                <td className="px-6 py-4 text-right font-medium text-gray-900">$4,200.50</td>
                            </tr>
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">#ORD-0919</td>
                                <td className="px-6 py-4 text-gray-500">Yesterday</td>
                                <td className="px-6 py-4 text-gray-700">Acme Solutions</td>
                                <td className="px-6 py-4"><span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium border border-emerald-100">Completed</span></td>
                                <td className="px-6 py-4 text-right font-medium text-gray-900">$8,900.00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
