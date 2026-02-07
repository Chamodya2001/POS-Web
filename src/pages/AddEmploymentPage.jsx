import React, { useState, useEffect } from 'react';
import {
    User, Mail, Phone, MapPin, Briefcase,
    Calendar, Shield, Lock, Save, ArrowLeft,
    Image as ImageIcon, Globe, UserCheck,
    Sparkles, CheckCircle2, AlertCircle, Info
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';
import { AddEmploymentPage_service } from './service/AddEmploymentPage_service';
import Swal from "sweetalert2";

export default function AddEmploymentPage() {
    const { theme } = useTheme();
    const { user } = useAuth();
    const isDarkMode = theme === 'dark';

    const [formData, setFormData] = useState({
        candidate_id: user?.candidate_id || "",
        shop_id: user?.shop_id || "",
        shop_name: user?.shop_name || "",
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
        email: "",
        password: ""
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                candidate_id: user.candidate_id || "",
                shop_id: user.shop_id || "",
                shop_name: user.shop_name || prev.shop_name
            }));
        }
    }, [user]);

    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'phone_number') {
            // Store as array with one element as per schema BIGINT[]
            const numericValue = value.replace(/\D/g, '');
            setFormData(prev => ({ ...prev, [name]: [numericValue] }));
        } else if (name.endsWith('_id')) {
            setFormData(prev => ({ ...prev, [name]: parseInt(value) || 1 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.candidate_id) {
            Swal.fire('Error', 'Candidate ID is missing. Please log in again.', 'error');
            return;
        }

        setLoading(true);

        try {
            console.log("Submitting Employee Data:", formData);
            await AddEmploymentPage_service.addEmploye(formData);

            Swal.fire({
                title: 'Success!',
                text: 'Employee registered successfully.',
                icon: 'success',
                confirmButtonColor: '#3b82f6',
                timer: 2000
            });

            // Reset the form but keep business info
            setFormData(prev => ({
                ...prev,
                first_name: "",
                last_name: "",
                dob: "",
                address: "",
                district: "",
                province: "",
                town: "",
                phone_number: [""],
                nic: "",
                email: "",
                password: ""
            }));

        } catch (error) {
            console.error("Error adding employee:", error);
            Swal.fire({
                title: 'Registration Failed',
                text: error.message || 'Something went wrong during employee registration.',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        window.history.back();
    };

    const inputClasses = (name) => clsx(
        "w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border rounded-2xl text-sm transition-all duration-300 outline-none outline-none",
        isDarkMode
            ? "text-white border-slate-700/50 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 placeholder-slate-600"
            : "text-slate-900 border-slate-200 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 placeholder-slate-400",
        focusedField === name && "border-blue-500 shadow-sm"
    );

    const labelClasses = "text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 ml-1 flex items-center gap-1.5";

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                        <Sparkles className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-widest text-blue-600/80">New Registration</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Add <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Employee</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Create a new cashier account for <strong>{formData.shop_name || 'your store'}</strong>
                    </p>
                </div>
                <div className="hidden md:flex items-center gap-4 bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                        {user?.first_name?.[0] || 'A'}
                    </div>
                    <div className="pr-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Super Admin</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{user?.first_name} {user?.last_name}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Details */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Personal Stats Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-blue-500/10 transition-colors duration-500" />

                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 dark:text-blue-400">
                                <User className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Personal Profile</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className={labelClasses}>
                                    <UserCheck className="w-3.5 h-3.5" /> First Name
                                </label>
                                <input
                                    required
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('first_name')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Enter first name"
                                    className={inputClasses('first_name')}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className={labelClasses}>Last Name</label>
                                <input
                                    required
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('last_name')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Enter last name"
                                    className={inputClasses('last_name')}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className={labelClasses}>
                                    <Shield className="w-3.5 h-3.5" /> NIC Number
                                </label>
                                <input
                                    required
                                    name="nic"
                                    value={formData.nic}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('nic')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="1999XXXXXXXX"
                                    maxLength={12}
                                    className={inputClasses('nic')}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className={labelClasses}>
                                    <Calendar className="w-3.5 h-3.5" /> Date of Birth
                                </label>
                                <input
                                    type="date"
                                    required
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('dob')}
                                    onBlur={() => setFocusedField(null)}
                                    className={inputClasses('dob')}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className={labelClasses}>Gender</label>
                                <select
                                    name="gender_id"
                                    value={formData.gender_id}
                                    onChange={handleChange}
                                    className={inputClasses('gender_id')}
                                >
                                    <option value={1}>Male</option>
                                    <option value={2}>Female</option>
                                    <option value={3}>Other</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className={labelClasses}>
                                    <Phone className="w-3.5 h-3.5" /> Phone Number
                                </label>
                                <input
                                    type="tel"
                                    required
                                    name="phone_number"
                                    value={formData.phone_number[0]}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('phone_number')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="07XXXXXXXX"
                                    className={inputClasses('phone_number')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl text-indigo-600 dark:text-indigo-400">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Location Details</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 space-y-1">
                                <label className={labelClasses}>Full Address</label>
                                <input
                                    required
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('address')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Street, Building name, etc."
                                    className={inputClasses('address')}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className={labelClasses}>Town / City</label>
                                <input
                                    required
                                    name="town"
                                    value={formData.town}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('town')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Enter town"
                                    className={inputClasses('town')}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className={labelClasses}>District</label>
                                <input
                                    required
                                    name="district"
                                    value={formData.district}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('district')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Enter district"
                                    className={inputClasses('district')}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className={labelClasses}>Province</label>
                                <input
                                    required
                                    name="province"
                                    value={formData.province}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('province')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Enter province"
                                    className={inputClasses('province')}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Secondary Details */}
                <div className="space-y-8">
                    {/* Security Credentials */}
                    <div className="bg-slate-900 dark:bg-blue-600 rounded-[2rem] p-8 text-white shadow-2xl shadow-blue-500/20 overflow-hidden relative group">
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/20 transition-colors duration-500" />

                        <div className="flex items-center gap-3 mb-8 relative z-10">
                            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white">
                                <Lock className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold">Access Control</h2>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-blue-200 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
                                    <input
                                        type="email"
                                        required
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="cashier@example.com"
                                        className="w-full pl-11 pr-4 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-sm focus:bg-white/20 focus:border-white/40 outline-none transition-all placeholder-blue-300/50"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-blue-200 uppercase tracking-widest ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
                                    <input
                                        type="password"
                                        required
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-4 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-sm focus:bg-white/20 focus:border-white/40 outline-none transition-all placeholder-blue-300/50"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Business/Status Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-emerald-600 dark:text-emerald-400">
                                <Briefcase className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Role & Preferences</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-1">
                                <label className={labelClasses}>Shop Name (Auto-filled)</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        disabled
                                        value={formData.shop_name}
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-2xl text-sm text-slate-500 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className={labelClasses}>
                                    <Globe className="w-3.5 h-3.5" /> Language
                                </label>
                                <select
                                    name="language_id"
                                    value={formData.language_id}
                                    onChange={handleChange}
                                    className={inputClasses('language_id')}
                                >
                                    <option value={1}>English</option>
                                    <option value={2}>Sinhala</option>
                                    <option value={3}>Tamil</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className={labelClasses}>Status</label>
                                <select
                                    name="status_id"
                                    value={formData.status_id}
                                    onChange={handleChange}
                                    className={inputClasses('status_id')}
                                >
                                    <option value={1}>Active</option>
                                    <option value={2}>Review</option>
                                    <option value={0}>Disabled</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4 pt-4">
                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-[1.5rem] font-bold shadow-xl shadow-blue-500/25 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 group"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    Complete Registration
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-[1.5rem] font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Go Back
                        </button>
                    </div>

                    <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100 dark:border-blue-900/30">
                        <div className="flex gap-4">
                            <div className="p-2 bg-blue-500/10 rounded-lg h-fit">
                                <Info className="w-4 h-4 text-blue-600" />
                            </div>
                            <p className="text-xs text-blue-800/70 dark:text-blue-300/60 leading-relaxed font-medium">
                                This cashier will be linked to your Super Admin ID (<span className="font-bold">{formData.candidate_id || 'Not found'}</span>). They can login using the email and password you set above.
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
