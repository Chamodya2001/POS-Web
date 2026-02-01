import React, { useState, useEffect } from 'react';
import {
    Package, Search, Plus, Filter,
    ArrowUpRight, ArrowDownRight, History,
    TrendingUp, AlertTriangle, Calendar,
    Building2, MoreHorizontal, Edit2
} from 'lucide-react';
import { API_ROUTES } from '../config/apiConfig';
import { useTheme } from '../context/ThemeContext';
import clsx from 'clsx';
import UpdateStockModal from '../components/StockUpdateModal';

const StockStatCard = ({ title, value, subtext, icon: Icon, trend, color }) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
        <div className="flex justify-between items-start mb-4">
            <div className={clsx("p-3 rounded-2xl", color)}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            {trend && (
                <div className={clsx(
                    "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg",
                    trend > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                )}>
                    {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(trend)}%
                </div>
            )}
        </div>
        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{value}</p>
        <p className="text-xs text-slate-400 mt-2">{subtext}</p>
    </div>
);

export default function StockManagementPage({ onAddStock, onViewHistory }) {
    const { theme } = useTheme();
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const fetchStockData = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_ROUTES.ITEMS.GET);
            const data = await response.json();
            if (data.success && data.data) {
                setStocks(data.data.map(item => ({
                    id: item.item_id,
                    name: item.item_name,
                    sku: item.short_code || '-',
                    currentStock: item.current_quantity || 0,
                    originalStock: item.stoke_quantity || 0,
                    buyingPrice: item.stoke_price || 0,
                    lastUpdated: item.stoke_ubdate_date || item.update_at,
                    latestSupplier: item.latest_supplier || 'N/A',
                    status: item.current_quantity <= (item.low_stock_threshold || 5) ?
                        (item.current_quantity === 0 ? 'Out of Stock' : 'Low Stock') : 'In Stock'
                })));
            } else {
                // Fallback Demo Data
                setStocks([
                    { id: 1, name: 'Premium Coffee Beans', sku: 'CF-001', currentStock: 45, originalStock: 100, buyingPrice: 1200, lastUpdated: '2024-03-20', latestSupplier: 'Global Tech Solutions', status: 'In Stock' },
                    { id: 2, name: 'Organic Green Tea', sku: 'TE-042', currentStock: 4, originalStock: 50, buyingPrice: 850, lastUpdated: '2024-03-18', latestSupplier: 'Eco Packaging Co.', status: 'Low Stock' },
                    { id: 3, name: 'Natural Honey 500g', sku: 'HN-105', currentStock: 12, originalStock: 30, buyingPrice: 1500, lastUpdated: '2024-03-15', latestSupplier: 'NextGen Electronics', status: 'In Stock' },
                    { id: 4, name: 'Whole Wheat Bread', sku: 'BD-009', currentStock: 0, originalStock: 20, buyingPrice: 450, lastUpdated: '2024-03-19', latestSupplier: 'N/A', status: 'Out of Stock' },
                ]);
            }
        } catch (err) {
            console.error("Stock fetch failed", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStockData();
    }, []);

    const handleQuickUpdate = (item) => {
        setSelectedItem(item);
        setIsUpdateModalOpen(true);
    };

    const filteredStocks = stocks.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const lowStockCount = stocks.filter(s => s.currentStock <= 5 && s.currentStock > 0).length;
    const outOfStockCount = stocks.filter(s => s.currentStock === 0).length;

    return (
        <div className="p-2 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Stock Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Monitor and replenish your product inventory.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => onViewHistory()}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
                    >
                        <History className="w-4 h-4" /> Stock History
                    </button>
                    <button
                        onClick={onAddStock}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/25 active:scale-95"
                    >
                        <Plus className="w-4 h-4" /> Add New Stock
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StockStatCard
                    title="Total Items"
                    value={stocks.length}
                    subtext="Across all categories"
                    icon={Package}
                    color="bg-blue-500"
                />
                <StockStatCard
                    title="Low Stock Alert"
                    value={lowStockCount}
                    subtext="Requires replenishment"
                    icon={AlertTriangle}
                    color="bg-amber-500"
                    trend={-12}
                />
                <StockStatCard
                    title="Out of Stock"
                    value={outOfStockCount}
                    subtext="Currently unavailable"
                    icon={TrendingUp}
                    color="bg-red-500"
                />
                <StockStatCard
                    title="Inventory Value"
                    value={`RS ${(stocks.reduce((acc, s) => acc + (s.currentStock * s.buyingPrice), 0)).toLocaleString()}`}
                    subtext="Based on buying price"
                    icon={TrendingUp}
                    color="bg-emerald-500"
                    trend={8}
                />
            </div>

            {/* Filters and List */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by product name or SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all dark:text-white"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="p-3 bg-slate-50 dark:bg-slate-800/50 text-slate-500 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition-all">
                            <Filter className="w-4 h-4" />
                        </button>
                        <select className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm px-4 py-3 outline-none focus:ring-4 focus:ring-primary-500/10 dark:text-white">
                            <option>All Categories</option>
                            <option>Grocery</option>
                            <option>Electronics</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                <th className="px-8 py-5">Product Details</th>
                                <th className="px-8 py-5">SKU</th>
                                <th className="px-8 py-5">Latest Supplier</th>
                                <th className="px-8 py-5">Inventory</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {filteredStocks.map((item) => (
                                <tr key={item.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors shadow-sm">
                                                <Package className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 dark:text-white">{item.name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Calendar className="w-3 h-3 text-slate-400" />
                                                    <span className="text-xs text-slate-400">Updated: {new Date(item.lastUpdated).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-sm font-mono text-slate-500 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-700">
                                            {item.sku}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-3 h-3 text-slate-400" />
                                            <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">{item.latestSupplier}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col gap-1.5 min-w-[120px]">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="font-bold text-slate-700 dark:text-slate-300">{item.currentStock} / {item.originalStock}</span>
                                                <span className="text-slate-400">{Math.round((item.currentStock / item.originalStock) * 100) || 0}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className={clsx(
                                                        "h-full rounded-full transition-all duration-1000",
                                                        item.status === 'Out of Stock' ? "bg-red-500" :
                                                            item.status === 'Low Stock' ? "bg-amber-500" : "bg-primary-500"
                                                    )}
                                                    style={{ width: `${Math.min(100, (item.currentStock / item.originalStock) * 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-2 text-slate-400">
                                            <button
                                                title="Quick Stock Update"
                                                onClick={() => handleQuickUpdate(item)}
                                                className="p-2 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/10 rounded-xl transition-all"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                            <button
                                                title="View History"
                                                onClick={() => onViewHistory(item.id)}
                                                className="p-2 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                                            >
                                                <History className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:text-slate-600 rounded-xl transition-all">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {loading && (
                    <div className="p-20 flex justify-center">
                        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <UpdateStockModal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                item={selectedItem}
                onUpdateSuccess={fetchStockData}
            />
        </div>
    );
}
