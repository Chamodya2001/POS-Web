import React, { useState } from 'react';
import {
    User, Mail, Phone, MapPin, Briefcase,
    Calendar, Shield, Lock, Save, ArrowLeft,
    Image as ImageIcon, Globe, UserCheck
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import clsx from 'clsx';
import { AddEmploymentPage_service } from './service/AddEmploymentPage_service';
import Swal from "sweetalert2";

export default function AddEmploymentPage() {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    const [formData, setFormData] = useState({
        candidate_id: "4",
        shop_id: "SHOP_001",
        first_name: "",
        last_name: "",
        dob: "",
        address: "",
        district: "",
        province: "",
        town: "",
        phone_number: [""],
        nic: "",
        language_id: 1,
        gender_id: 1,
        status_id: 1,
        shop_name: "",
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'phone_number') {
            setFormData(prev => ({ ...prev, [name]: [value] }));
        } else if (name.endsWith('_id')) {
            setFormData(prev => ({ ...prev, [name]: parseInt(value) || 1 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            console.log("Form Data:", formData);
            await AddEmploymentPage_service.addEmploye(formData);

            // Reset the form
            setFormData({
                candidate_id: "4",
                shop_id: "SHOP_001",
                first_name: "",
                last_name: "",
                dob: "",
                address: "",
                district: "",
                province: "",
                town: "",
                phone_number: [""],
                nic: "",
                language_id: 1,
                gender_id: 1,
                status_id: 1,
                shop_name: "",
                email: "",
                password: ""
            });

            Swal.fire('Success!', 'Employee added successfully.', 'success');

        } catch (error) {
            console.error("Error adding employee:", error);
            Swal.fire('Error', error.message || 'Something went wrong.', 'error');
        } finally {
            setLoading(false);
        }
    };


    const handleCancel = () => {
        setFormData({
            first_name: "",
            last_name: "",
            dob: "",
            address: "",
            district: "",
            province: "",
            town: "",
            phone_number: [""],
            nic: "",
            language_id: 1,
            gender_id: 1,
            status_id: 1,
            shop_name: "",
            email: "",
            password: ""
        });
        setMessage({ type: '', text: '' });
    };

    return (
        <div className="p-4 md:p-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Add Employment</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Register a new merchant/employee to the system.
                    </p>
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

            <form className="space-y-6" onSubmit={handleSubmit}>
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
                                placeholder="John"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Last Name</label>
                            <input
                                required
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                placeholder="Doe"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase">NIC Number</label>
                            <input
                                required
                                name="nic"
                                value={formData.nic}
                                onChange={handleChange}
                                placeholder="199912345678"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
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
                                placeholder="07XXXXXXXX"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
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
                                placeholder="Street, Building, etc."
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
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
                                placeholder="My Awesome Store"
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
                            <label className="text-xs font-semibold text-slate-500 uppercase">Email Address</label>
                            <input
                                type="email"
                                required
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@gmail.com"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
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
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-4">
                    <button
                        type="button"
                        onClick={handleCancel}
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
