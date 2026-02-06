import React, { useState } from 'react';
import {
    User, Mail, Phone, MapPin,
    Shield, Save, ArrowLeft, UserPlus,
    CreditCard
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import clsx from 'clsx';
import { API_ROUTES } from '../config/apiConfig';

export default function AddCustomerPage() {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        address: "",
        nic: "",
        loan_balance: 0,
        casior_id: 1,
        candidate_id: 17, // Using valid candidate_id from database
        status_id: 1
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.endsWith('_id')) {
            setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            console.log('Calling API:', API_ROUTES.CUSTOMERS.SAVE);
            const response = await fetch(API_ROUTES.CUSTOMERS.SAVE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Customer registered successfully!' });
                // Reset form after successful submission
                setFormData({
                    first_name: "",
                    last_name: "",
                    email: "",
                    phone_number: "",
                    address: "",
                    nic: "",
                    loan_balance: 0,
                    casior_id: 1,
                    candidate_id: 16,
                    status_id: 1
                });
            } else if (response.status === 409) {
                // Handle duplicate NIC
                setMessage({
                    type: 'error',
                    text: `Duplicate entry: ${data.message || 'Customer with this NIC already exists.'}`
                });
            } else if (response.status === 422) {
                // Validation errors
                const errorMessages = Object.entries(data.data || {})
                    .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
                    .join(' | ');
                setMessage({
                    type: 'error',
                    text: errorMessages || 'Validation failed. Please check your inputs.'
                });
            } else {
                setMessage({ type: 'error', text: data.message || 'Registration failed.' });
            }
        } catch (error) {
            console.error('Error submitting customer form:', error);
            setMessage({ type: 'error', text: 'Network error. Please check if the backend is running.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Customer Registration</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Add a new customer to the loyalty program.</p>
                </div>
                {message.text && (
                    <div className={clsx(
                        "px-4 py-2 rounded-xl text-sm font-medium animate-in zoom-in duration-300",
                        message.type === 'success' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                        {message.text}
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 text-primary-600">
                        <UserPlus className="w-5 h-5" />
                        <h2 className="font-bold">Basic Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">First Name</label>
                            <input
                                required
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
                                placeholder="Enter first name"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Name</label>
                            <input
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
                                placeholder="Enter last name"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
                                    placeholder="customer@example.com"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="tel"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
                                    placeholder="+94 7X XXX XXXX"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 text-primary-600">
                        <MapPin className="w-5 h-5" />
                        <h2 className="font-bold">Location & Identity</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Address</label>
                            <input
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
                                placeholder="Home address"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">NIC Number</label>
                            <div className="relative">
                                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    required
                                    name="nic"
                                    value={formData.nic}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
                                    placeholder="Identity card number"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Initial Loan Balance</label>
                            <div className="relative">
                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="number"
                                    name="loan_balance"
                                    value={formData.loan_balance}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>

                            <select
                                name="status_id"
                                value={formData.status_id}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
                            >
                                <option value={1}>Active</option>
                                <option value={2}>Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={loading}
                        type="submit"
                        className="px-8 py-3 bg-primary-600 text-white rounded-2xl font-bold shadow-xl shadow-primary-500/20 hover:bg-primary-500 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : (
                            <>
                                <Save className="w-4 h-4" />
                                Register Customer
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
