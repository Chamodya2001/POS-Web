import React, { useState, useEffect } from 'react';
import {
    User, Mail, Phone, MapPin,
    Shield, ArrowLeft, Calendar,
    CreditCard, ShoppingBag, History,
    Edit, Trash2, Wallet, AlertCircle
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import clsx from 'clsx';
import { API } from '../services/appService';


export default function CustomerProfilePage({ customerId, onBack }) {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isEditCustomer, setIsEditCustomer] = useState(false);
    const [updatedCustomerData, setUpdatedCustomerData] = useState({});
    const [originalCustomerData, setOriginalCustomerData] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const data = await API.getCustomerById(customerId);
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

    // Handle input changes in the edit form
    const handleCustomerUpdate = (e) => {
        const { name, value } = e.target;
            setUpdatedCustomerData((prev) => ({
            ...prev,
         [name]: value,
        }));
    };
    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const dataToSend = {
        ...originalCustomerData,
        ...updatedCustomerData,
        };

        try {
        const res = await API.updateCustomer(customerId, dataToSend);

        if (res.success) {
            setCustomer(dataToSend); // update UI
            setIsEditCustomer(false);
            setUpdatedCustomerData({});
            setOriginalCustomerData({});
        } else {
            alert(res.message);
        }
        } catch {
        alert("Update failed");
        } finally {
        setSaving(false);
        }
    };

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
                    <button onClick={() => {setOriginalCustomerData(customer);
                                            setUpdatedCustomerData({});
                                            setIsEditCustomer(true);}}
                        className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                        <Edit className="w-4 h-4" /> Edit Profile
                    </button>
                </div>
            </div>
            {/* Edit Customer Modal */}
                    {isEditCustomer && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
                        
                        <div className="p-8 max-h-[90vh] overflow-y-auto">
                            
                            {/* Header */}
                            <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/10 text-primary-600 rounded-xl flex items-center justify-center">
                                <Edit className="w-6 h-6" />
                                </div>
                                <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    Edit Customer
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">
                                    Update customer details.
                                </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsEditCustomer(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                ✕
                            </button>
                            </div>

                            {/* Form */}
                            <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                setIsEditCustomer(false);
                            }}
                            className="space-y-6"
                            >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* First Name */}
                                <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase">
                                    First Name
                                </label>
                                <input
                                    name="first_name"
                                    value={
                                    updatedCustomerData.first_name !== undefined
                                        ? updatedCustomerData.first_name
                                        : originalCustomerData.first_name || ""
                                    }
                                    onChange={handleCustomerUpdate}
                                    className="input-style"
                                />
                                </div>

                                {/* Last Name */}
                                <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase">
                                    Last Name
                                </label>
                                <input
                                    name="last_name"
                                    value={
                                    updatedCustomerData.last_name !== undefined
                                        ? updatedCustomerData.last_name
                                        : originalCustomerData.last_name || ""
                                    }
                                    onChange={handleCustomerUpdate}
                                    className="input-style"
                                />
                                </div>

                                {/* Email */}
                                <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-bold text-slate-400 uppercase">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={
                                    updatedCustomerData.email !== undefined
                                        ? updatedCustomerData.email
                                        : originalCustomerData.email || ""
                                    }
                                    onChange={handleCustomerUpdate}
                                    className="input-style"
                                />
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase">
                                    Phone Number
                                </label>
                                <input
                                    name="phone_number"
                                    value={
                                    updatedCustomerData.phone_number !== undefined
                                        ? updatedCustomerData.phone_number
                                        : originalCustomerData.phone_number || ""
                                    }
                                    onChange={handleCustomerUpdate}
                                    className="input-style"
                                />
                                </div>

                                {/* NIC */}
                                <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase">
                                    NIC
                                </label>
                                <input
                                    name="nic"
                                    value={
                                    updatedCustomerData.nic !== undefined
                                        ? updatedCustomerData.nic
                                        : originalCustomerData.nic || ""
                                    }
                                    onChange={handleCustomerUpdate}
                                    className="input-style"
                                />
                                </div>

                                {/* Address */}
                                <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-bold text-slate-400 uppercase">
                                    Address
                                </label>
                                <textarea
                                    name="address"
                                    rows={3}
                                    value={
                                    updatedCustomerData.address !== undefined
                                        ? updatedCustomerData.address
                                        : originalCustomerData.address || ""
                                    }
                                    onChange={handleCustomerUpdate}
                                    className="input-style resize-none"
                                />
                                </div>

                                {/* Loan Balance */}
                                <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase">
                                    Loan Balance
                                </label>
                                <input
                                    type="number"
                                    name="loan_balance"
                                    value={
                                    updatedCustomerData.loan_balance !== undefined
                                        ? updatedCustomerData.loan_balance
                                        : originalCustomerData.loan_balance || ""
                                    }
                                    onChange={handleCustomerUpdate}
                                    className="input-style"
                                />
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase">
                                    Status
                                </label>
                                <select
                                    name="status_id"
                                    value={
                                    updatedCustomerData.status_id !== undefined
                                        ? updatedCustomerData.status_id
                                        : originalCustomerData.status_id || 1
                                    }
                                    onChange={handleCustomerUpdate}
                                    className="input-style"
                                >
                                    <option value={1}>Active</option>
                                    <option value={0}>Inactive</option>
                                </select>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-4 pt-4 md:col-span-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditCustomer(false)}
                                    className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    onClick={() => {
                                    const dataToSend = {
                                        ...originalCustomerData,
                                        ...updatedCustomerData,
                                    };

                                    // 👉 Call your API here
                                    API.updateCustomer(customerId, dataToSend);

                                    setIsEditCustomer(false);
                                    setUpdatedCustomerData({});
                                    setOriginalCustomerData({});
                                    }}
                                    className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-xl font-bold"
                                >
                                    Save Changes
                                </button>
                                </div>

                            </div>
                            </form>
                        </div>
                        </div>
                    </div>
                    )}

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
                                <p className="font-bold text-primary-600">RS 1,450.00</p>
                            </div>
                        </div>
                    </div>

                    {/* Loan Balance Card */}
                    <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-6 text-white shadow-xl shadow-primary-500/20 relative overflow-hidden">
                        <Wallet className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 rotate-12" />
                        <div className="relative z-10">
                            <p className="text-primary-100 text-sm font-medium mb-1 uppercase tracking-wider">Loan Balance</p>
                            <h3 className="text-4xl font-black mb-6">
                                RS {parseFloat(customer.loan_balance || 0).toFixed(2)}
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
                                    <p className="font-bold text-slate-800 dark:text-white">RS 124.50</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}
