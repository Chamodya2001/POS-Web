import React, { useState } from 'react';
import { Search, Filter, Eye, Download, RefreshCcw, MoreHorizontal, Calendar, CheckCircle, Clock, XCircle, ArrowUpDown, ChevronLeft, ChevronRight, FileText } from 'lucide-react';

const ORDERS_DATA = [
    { id: '#ORD-7782', customer: 'Alex Morgan', items: 3, total: 45.90, status: 'Completed', date: 'Oct 24, 2023', payment: 'Credit Card' },
    { id: '#ORD-7781', customer: 'Sarah Wilson', items: 1, total: 12.50, status: 'Processing', date: 'Oct 24, 2023', payment: 'Cash' },
    { id: '#ORD-7780', customer: 'James Doe', items: 8, total: 129.00, status: 'Completed', date: 'Oct 23, 2023', payment: 'E-Wallet' },
    { id: '#ORD-7779', customer: 'Emily Mack', items: 2, total: 24.00, status: 'Completed', date: 'Oct 23, 2023', payment: 'Credit Card' },
    { id: '#ORD-7778', customer: 'Michael Scott', items: 5, total: 89.99, status: 'Refunded', date: 'Oct 22, 2023', payment: 'Credit Card' },
    { id: '#ORD-7777', customer: 'David Miller', items: 4, total: 55.00, status: 'Cancelled', date: 'Oct 21, 2023', payment: 'Cash' },
    { id: '#ORD-7776', customer: 'Jessica Brown', items: 6, total: 210.50, status: 'Completed', date: 'Oct 20, 2023', payment: 'Credit Card' },
    { id: '#ORD-7775', customer: 'Daniel Lo', items: 2, total: 18.00, status: 'Completed', date: 'Oct 19, 2023', payment: 'E-Wallet' },
];

const StatusBadge = ({ status }) => {
    const styles = {
        Completed: 'bg-green-50 text-green-700 border-green-100',
        Processing: 'bg-amber-50 text-amber-700 border-amber-100',
        Refunded: 'bg-slate-100 text-slate-700 border-slate-200',
        Cancelled: 'bg-red-50 text-red-700 border-red-100',
    };

    const icons = {
        Completed: CheckCircle,
        Processing: Clock,
        Refunded: RefreshCcw,
        Cancelled: XCircle,
    };

    const Icon = icons[status] || Clock;

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.Processing}`}>
            <Icon className="w-3.5 h-3.5" />
            {status}
        </span>
    );
};

export default function OrdersPage() {
    const [activeTab, setActiveTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredOrders = ORDERS_DATA.filter(order => {
        const matchesTab = activeTab === 'All' || order.status === activeTab;
        const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) || order.id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="p-2 max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Orders Management</h1>
                    <p className="text-slate-500 text-sm mt-1">View and manage customer orders and transactions.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                        <Download className="w-4 h-4" /> Export
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/25">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                </div>
            </div>

            {/* Controls & Metrics */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
                <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">

                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar no-scrollbar">
                        {['All', 'Completed', 'Processing', 'Refunded', 'Cancelled'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab
                                    ? 'bg-slate-800 text-white shadow-md shadow-slate-800/20'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search order ID or customer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                                <th className="py-4 px-6 w-10">
                                    <input type="checkbox" className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                                </th>
                                <th className="py-4 px-6 cursor-pointer hover:text-slate-700 group">
                                    <div className="flex items-center gap-1">Order ID <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-50" /></div>
                                </th>
                                <th className="py-4 px-6">Customer</th>
                                <th className="py-4 px-6">Date</th>
                                <th className="py-4 px-6">Total</th>
                                <th className="py-4 px-6">Payment</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="py-4 px-6">
                                        <input type="checkbox" className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                                    </td>
                                    <td className="py-4 px-6 font-medium text-slate-800">{order.id}</td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-100 to-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shadow-sm border border-white">
                                                {order.customer.charAt(0)}
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">{order.customer}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5 opacity-70" /> {order.date}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 font-semibold text-slate-800">RS {order.total.toFixed(2)}</td>
                                    <td className="py-4 px-6 text-sm text-slate-500">{order.payment}</td>
                                    <td className="py-4 px-6">
                                        <StatusBadge status={order.status} />
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg border border-transparent hover:border-slate-100 text-slate-400 hover:text-primary-600 transition-all">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg border border-transparent hover:border-slate-100 text-slate-400 hover:text-slate-800 transition-all">
                                                <FileText className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredOrders.length === 0 && (
                        <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                            <Search className="w-12 h-12 mb-3 opacity-20" />
                            <p>No orders found matching your criteria.</p>
                        </div>
                    )}
                </div>

                {/* Footer / Pagination */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <span className="text-sm text-slate-500">Showing <span className="font-medium text-slate-800">1-8</span> of <span className="font-medium text-slate-800">124</span> orders</span>

                    <div className="flex items-center gap-2">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all disabled:opacity-50">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-primary-600 bg-primary-600 text-white shadow-sm shadow-primary-500/20 transition-all">
                            1
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-primary-600 hover:border-primary-200 transition-all">
                            2
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-primary-600 hover:border-primary-200 transition-all">
                            3
                        </button>
                        <span className="text-slate-400 px-1">...</span>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
