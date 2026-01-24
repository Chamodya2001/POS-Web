import React, { useState, useEffect } from 'react';
import {
    User, Mail, Phone, MapPin,
    Shield, ArrowLeft, Calendar,
    CreditCard, ShoppingBag, History,
    Edit, Trash2, Wallet, AlertCircle
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import clsx from 'clsx';
import API_BASE_URL from '../config/apiConfig';

export default function CustomerProfilePage({ customerId, onBack }) {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/customer/${customerId}`);
                const data = await response.json();
                if (data.success) {
                    setCustomer(data.data);
                } else {
                    setError(data.message);
                }
            } catch (err) {
                setError("Failed to connect to the server.");
            } finally {
                setLoading(false);
            }
        };

        if (customerId) fetchCustomer();
    }, [customerId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p>Loading customer profile...</p>
            </div>
        );
    }

    if (error || !customer) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 p-6">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Error Loading Profile</h2>
                <p className="text-center mb-6">{error || "Customer not found."}</p>
                <button
                    onClick={onBack}
                    className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold transition-all"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Customer Profile</h1>
                        <p className="text-sm text-slate-500">Viewing details for {customer.first_name} {customer.last_name}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                        <Edit className="w-4 h-4" /> Edit Profile
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-all">
                        <Trash2 className="w-4 h-4" /> Delete
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Basic Info & Stats */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Profile Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                        <div className="w-24 h-24 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white dark:border-slate-800 shadow-xl">
                            <span className="text-3xl font-black text-primary-600 uppercase">
                                {customer.first_name[0]}{customer.last_name ? customer.last_name[0] : ''}
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{customer.first_name} {customer.last_name}</h2>
                        <p className="text-sm text-slate-500 mb-6">{customer.email || "No email provided"}</p>

                        <div className={clsx(
                            "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6",
                            customer.status_id === 1 ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                        )}>
                            {customer.status_id === 1 ? "Active Member" : "Inactive"}
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <div className="text-center">
                                <p className="text-xs text-slate-400 mb-1">Total Orders</p>
                                <p className="font-bold text-slate-800 dark:text-white">24</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-slate-400 mb-1">Total Spent</p>
                                <p className="font-bold text-primary-600">$1,450.00</p>
                            </div>
                        </div>
                    </div>

                    {/* Loan Balance Card */}
                    <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-6 text-white shadow-xl shadow-primary-500/20 relative overflow-hidden">
                        <Wallet className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 rotate-12" />
                        <div className="relative z-10">
                            <p className="text-primary-100 text-sm font-medium mb-1 uppercase tracking-wider">Loan Balance</p>
                            <h3 className="text-4xl font-black mb-6">
                                ${parseFloat(customer.loan_balance || 0).toFixed(2)}
                            </h3>
                            <button className="w-full py-3 bg-white/20 backdrop-blur-md rounded-2xl text-white font-bold text-sm hover:bg-white/30 transition-all">
                                Make a Payment
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Detailed Tabs */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Info Grid */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Contact & Identity</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                                    <Phone className="w-5 h-5 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Phone Number</p>
                                    <p className="text-sm dark:text-white font-medium">{customer.phone_number || "Not listed"}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                                    <Shield className="w-5 h-5 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-semibold uppercase mb-1">NIC / ID Number</p>
                                    <p className="text-sm dark:text-white font-medium">{customer.nic}</p>
                                </div>
                            </div>
                            <div className="flex gap-4 md:col-span-2">
                                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                                    <MapPin className="w-5 h-5 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Full Address</p>
                                    <p className="text-sm dark:text-white font-medium">{customer.address || "No address provided"}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                                    <Calendar className="w-5 h-5 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Customer Since</p>
                                    <p className="text-sm dark:text-white font-medium">
                                        {new Date(customer.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Transactions (Mockup) */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <History className="w-5 h-5 text-primary-600" />
                                <h3 className="font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
                            </div>
                            <button className="text-sm text-primary-600 font-medium hover:underline">View All</button>
                        </div>
                        <div className="divide-y divide-slate-50 dark:divide-slate-800">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                                            <ShoppingBag className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 dark:text-white">Order #ORD-772{i}</p>
                                            <p className="text-xs text-slate-500">Jan 22, 2026 • 2 Items</p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-slate-800 dark:text-white">$124.50</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
