import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User, Mail, Phone, MapPin, Briefcase,
    Calendar, Shield, Lock, Save, ArrowLeft,
    Image as ImageIcon, Globe, UserCheck
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import clsx from 'clsx';
import { API_ROUTES } from '../config/apiConfig';

export default function AddEmploymentPage() {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        dob: "",
        address: "",
        district: "",
        province: "",
        town: "",
        phone_number: [0],
        image_code: "",
        nic: "",
        language_id: 1,
        gender_id: 1,
        status_id: 1,
        shop_name: "",
        casior_quantity: 1,
        user_name: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone_number') {
            setFormData(prev => ({ ...prev, [name]: [parseInt(value) || 0] }));
        } else if (name === 'casior_quantity' || name.endsWith('_id')) {
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
            const response = await fetch(API_ROUTES.CANDIDATES.SAVE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Employment registration successful!' });
                // Reset form after successful submission
                setFormData({
                    first_name: "",
                    last_name: "",
                    dob: "",
                    address: "",
                    district: "",
                    province: "",
                    town: "",
                    phone_number: [0],
                    image_code: "",
                    nic: "",
                    language_id: 1,
                    gender_id: 1,
                    status_id: 1,
                    shop_name: "",
                    casior_quantity: 1,
                    user_name: "",
                    password: ""
                });
            } else if (response.status === 409) {
                // Handle duplicate username or NIC
                setMessage({
                    type: 'error',
                    text: `Duplicate entry: ${data.message || 'Username or NIC already exists. Please use different values.'}`
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
            console.error('Error submitting form:', error);
            setMessage({ type: 'error', text: 'Network error. Please check if the backend is running.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Add Employment</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Register a new merchant/employee to the system.</p>
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
                {/* Personal Information */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 text-primary-600">
                        <User className="w-5 h-5" />
                        <h2 className="font-bold">Personal Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase">First Name</label>
                            <input
                                required
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
                                placeholder="John"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Last Name</label>
                            <input
                                required
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
                                placeholder="Doe"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase">NIC Number</label>
                            <input
                                required
                                name="nic"
                                value={formData.nic}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
                                placeholder="199912345678"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Date of Birth</label>
                            <input
                                type="date"
                                required
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Gender</label>
                            <select
                                name="gender_id"
                                value={formData.gender_id}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
                            >
                                <option value={1}>Male</option>
                                <option value={2}>Female</option>
                                <option value={3}>Other</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Phone Number</label>
                            <input
                                type="tel"
                                required
                                name="phone_number"
                                value={formData.phone_number[0]}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
                                placeholder="07XXXXXXXX"
                            />
                        </div>
                    </div>
                </div>

                {/* Address & Location */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 text-primary-600">
                        <MapPin className="w-5 h-5" />
                        <h2 className="font-bold">Address & Location</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Address</label>
                            <input
                                required
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
                                placeholder="Street, Building, etc."
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Town</label>
                            <input
                                required
                                name="town"
                                value={formData.town}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase">District</label>
                            <input
                                required
                                name="district"
                                value={formData.district}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Province</label>
                            <input
                                required
                                name="province"
                                value={formData.province}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Business Details */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 text-primary-600">
                        <Briefcase className="w-5 h-5" />
                        <h2 className="font-bold">Business Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Shop Name</label>
                            <input
                                required
                                name="shop_name"
                                value={formData.shop_name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
                                placeholder="My Awesome Store"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Cashier Quantity</label>
                            <input
                                type="number"
                                required
                                name="casior_quantity"
                                value={formData.casior_quantity}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Preferred Language</label>
                            <select
                                name="language_id"
                                value={formData.language_id}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
                            >
                                <option value={1}>English</option>
                                <option value={2}>Sinhala</option>
                                <option value={3}>Tamil</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Account Status</label>
                            <select
                                name="status_id"
                                value={formData.status_id}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
                            >
                                <option value={1}>Active</option>
                                <option value={2}>Pending</option>
                                <option value={3}>Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Security Credentials */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 text-primary-600">
                        <Lock className="w-5 h-5" />
                        <h2 className="font-bold">Security Credentials</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Username</label>
                            <input
                                required
                                name="user_name"
                                value={formData.user_name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
                                placeholder="username123"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Password</label>
                            <input
                                type="password"
                                required
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-4">
                    <button
                        type="button"
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
                                Save Employment
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
