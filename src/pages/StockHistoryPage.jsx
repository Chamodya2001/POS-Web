import React, { useState, useEffect } from 'react';
import {
    History, ArrowLeft, Search, Filter,
    Download, TrendingUp, TrendingDown,
    Calendar, User, Package, Building2,
    CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import clsx from 'clsx';

export default function StockHistoryPage({ onBack, productId = null }) {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Mock History Data
    const [history, setHistory] = useState([
        {
            id: 'TX-9901',
            item_name: 'Premium Coffee Beans',
            type: 'Addition',
            quantity: 50,
            unit_price: 1200,
            total: 60000,
            supplier: 'Global Tech Solutions',
            user: 'Admin User',
            date: '2024-03-20T10:30:00Z',
            status: 'Completed'
        },
        {
            id: 'TX-9895',
            item_name: 'Organic Green Tea',
            type: 'Sale',
            quantity: -2,
            unit_price: 850,
            total: 1700,
            supplier: '-',
            user: 'Cashier Rohit',
            date: '2024-03-19T14:45:00Z',
            status: 'Completed'
        },
        {
            id: 'TX-9882',
            item_name: 'Natural Honey 500g',
            type: 'Adjustment',
            quantity: -1,
            unit_price: 1500,
            total: 1500,
            supplier: '-',
            user: 'Manager Silva',
            date: '2024-03-18T09:15:00Z',
            status: 'Damaged'
        },
        {
            id: 'TX-9870',
            item_name: 'Premium Coffee Beans',
            type: 'Addition',
            quantity: 100,
            unit_price: 1150,
            total: 115000,
            supplier: 'NextGen Electronics',
            user: 'Admin User',
            date: '2024-03-15T11:00:00Z',
            status: 'Completed'
        }
    ]);

    const filteredHistory = history.filter(h =>
        h.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <History className="w-7 h-7 text-primary-600" /> Stock Transaction History
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Detailed log of all inventory movements and adjustments.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/25">
                        <RefreshCw className="w-4 h-4" /> Refresh
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by ID, Product or Supplier..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all dark:text-white"
                        />
                    </div>
                    <div className="flex gap-4">
                        <select className="flex-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm px-4 py-3 outline-none focus:ring-4 focus:ring-primary-500/10 dark:text-white">
                            <option>All Transaction Types</option>
                            <option>Addition</option>
                            <option>Sale</option>
                            <option>Adjustment</option>
                            <option>Return</option>
                        </select>
                        <button className="p-3 bg-slate-50 dark:bg-slate-800/50 text-slate-500 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition-all">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex items-center px-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl">
                        <Calendar className="w-4 h-4 text-slate-400 mr-3" />
                        <span className="text-sm text-slate-500 dark:text-slate-400">Last 30 Days</span>
                    </div>
                </div>
            </div>

            {/* Transaction List */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                <th className="px-8 py-5">Date & ID</th>
                                <th className="px-8 py-5">Product Details</th>
                                <th className="px-8 py-5">Type</th>
                                <th className="px-8 py-5">Quantity</th>
                                <th className="px-8 py-5">Value (RS)</th>
                                <th className="px-8 py-5">Reference/Supplier</th>
                                <th className="px-8 py-5">Done By</th>
                                <th className="px-8 py-5">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {filteredHistory.map((item) => (
                                <tr key={item.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all">
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-800 dark:text-white">{new Date(item.date).toLocaleDateString()}</span>
                                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter mt-1">{item.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/10 text-primary-600 flex items-center justify-center">
                                                <Package className="w-4 h-4" />
                                            </div>
                                            <span className="font-bold text-slate-700 dark:text-slate-200">{item.item_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={clsx(
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                                            item.type === 'Addition' ? "bg-green-50 text-green-700 border border-green-100" :
                                                item.type === 'Sale' ? "bg-blue-50 text-blue-700 border border-blue-100" :
                                                    "bg-amber-50 text-amber-700 border border-amber-100"
                                        )}>
                                            {item.type === 'Addition' ? <TrendingUp className="w-3 h-3" /> :
                                                item.type === 'Sale' ? <TrendingDown className="w-3 h-3" /> :
                                                    <Package className="w-3 h-3" />}
                                            {item.type}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 font-mono text-sm">
                                        <span className={clsx(
                                            "font-bold",
                                            item.quantity > 0 ? "text-green-600" : "text-red-600"
                                        )}>
                                            {item.quantity > 0 ? '+' : ''}{item.quantity}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{(item.total).toLocaleString()}</span>
                                            <span className="text-[10px] text-slate-400">RS {item.unit_price}/unit</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-3 h-3 text-slate-400" />
                                            <span className="text-sm text-slate-600 dark:text-slate-400 truncate max-w-[120px]">
                                                {item.supplier}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <User className="w-3 h-3 text-slate-400" />
                                            <span className="text-sm text-slate-600 dark:text-slate-400">{item.user}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={clsx(
                                            "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold",
                                            item.status === 'Completed' ? "text-green-600 bg-green-50/50" : "text-red-600 bg-red-50/50"
                                        )}>
                                            {item.status === 'Completed' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredHistory.length === 0 && (
                    <div className="p-20 text-center text-slate-400">
                        <History className="w-12 h-12 mx-auto mb-4 opacity-10" />
                        <p>No transaction history found for the selected filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
