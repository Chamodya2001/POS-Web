import React, { useState, useEffect } from 'react';
import {
    User, Mail, Phone, MapPin, Briefcase,
    Calendar, Shield, Lock, Save, ArrowLeft,
    Sparkles, Info, Globe, UserCheck, CheckCircle2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';
import { API } from '../services/appService';
import Swal from "sweetalert2";

export default function AddEmploymentPage({ onBack }) {
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
        if (!formData.candidate_id) {
            Swal.fire('Error', 'Candidate ID is missing. Please log in again.', 'error');
            return;
        }

        setLoading(true);

        try {
            await API.addEmployee(formData);
            await Swal.fire({
                title: 'Success!',
                text: 'Employee registered successfully.',
                icon: 'success',
                confirmButtonColor: '#3b82f6',
                timer: 2000,
                showConfirmButton: false
            });
            if (onBack) onBack();
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

    const inputClasses = (name) => clsx(
        "w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/40 border-2 rounded-[1.25rem] text-sm transition-all duration-300 outline-none",
        isDarkMode
            ? "text-white border-slate-700/50 focus:border-blue-500/50 focus:bg-slate-800/60 focus:ring-4 focus:ring-blue-500/5 placeholder-slate-600"
            : "text-slate-900 border-slate-100 focus:border-blue-500/30 focus:bg-white focus:ring-4 focus:ring-blue-500/5 placeholder-slate-400 shadow-sm",
        focusedField === name && "border-blue-500 shadow-md transform -translate-y-0.5"
    );

    const labelClasses = "text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] mb-2 ml-1 flex items-center gap-2";

    const sectionClasses = "bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-slate-100 dark:border-slate-800/50 shadow-2xl shadow-slate-200/20 dark:shadow-none hover:shadow-blue-500/5 transition-all duration-500 group";

    return (
        <div className="p-4 md:p-12 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Professional Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                <div className="space-y-3">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-400 hover:text-blue-500 transition-colors group mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-widest">Back to Directory</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                            <UserPlus className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                Register <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">New Staff</span>
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2 mt-1">
                                <Sparkles className="w-4 h-4 text-amber-400" />
                                Setting up a new account for <strong>{formData.shop_name}</strong>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-5 bg-white dark:bg-slate-900/80 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-black shadow-lg">
                        {user?.first_name?.[0]}
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Authorizing Admin</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{user?.first_name} {user?.last_name}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-10">
                    {/* Personal Details Section */}
                    <div className={sectionClasses}>
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-600">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-800 dark:text-white">Profile Identity</h2>
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Basic Employment Information</p>
                                </div>
                            </div>
                            <div className="px-4 py-1.5 bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-500/20">
                                Step 1 of 3
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { name: 'first_name', label: 'First Name', icon: UserCheck, placeholder: 'e.g. John' },
                                { name: 'last_name', label: 'Last Name', icon: null, placeholder: 'e.g. Doe' },
                                { name: 'nic', label: 'NIC Number', icon: Shield, placeholder: '1999XXXXXXXX' },
                                { name: 'phone_number', label: 'Primary Contact', icon: Phone, placeholder: '07XXXXXXXX', type: 'tel' }
                            ].map((field) => (
                                <div key={field.name} className="space-y-1">
                                    <label className={labelClasses}>
                                        {field.icon && <field.icon className="w-3.5 h-3.5" />} {field.label}
                                    </label>
                                    <input
                                        required
                                        type={field.type || "text"}
                                        name={field.name}
                                        value={field.name === 'phone_number' ? formData.phone_number[0] : formData[field.name]}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField(field.name)}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder={field.placeholder}
                                        className={inputClasses(field.name)}
                                    />
                                </div>
                            ))}
                            <div className="space-y-1">
                                <label className={labelClasses}><Calendar className="w-3.5 h-3.5" /> Date of Birth</label>
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
                                <label className={labelClasses}>Gender Recognition</label>
                                <select
                                    name="gender_id"
                                    value={formData.gender_id}
                                    onChange={handleChange}
                                    className={inputClasses('gender_id')}
                                >
                                    <option value={1}>Male</option>
                                    <option value={2}>Female</option>
                                    <option value={3}>Non-Binary / Other</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className={sectionClasses}>
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-600">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-800 dark:text-white">Residentiary</h2>
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Mailing & Contact Address</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-1">
                                <label className={labelClasses}>Full Residential Address</label>
                                <input
                                    required
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('address')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Street house number, Floor, Apartment"
                                    className={inputClasses('address')}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { name: 'town', label: 'Town / City' },
                                    { name: 'district', label: 'District' },
                                    { name: 'province', label: 'Province' }
                                ].map((field) => (
                                    <div key={field.name} className="space-y-1">
                                        <label className={labelClasses}>{field.label}</label>
                                        <input
                                            required
                                            name={field.name}
                                            value={formData[field.name]}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField(field.name)}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder={`Enter ${field.name}`}
                                            className={inputClasses(field.name)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Configuration area */}
                <div className="lg:col-span-4 space-y-10">
                    {/* Security Card - Eye Catching */}
                    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-3xl shadow-blue-900/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-blue-500/20 transition-all duration-700" />

                        <div className="flex items-center gap-3 mb-10 relative z-10">
                            <div className="p-3 bg-white/10 backdrop-blur-md rounded-[1.25rem]">
                                <Lock className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-black tracking-tight">Access Control</h3>
                        </div>

                        <div className="space-y-8 relative z-10">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">Work Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="cashier@loop.pos"
                                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:bg-white/10 focus:border-blue-500/50 outline-none transition-all placeholder-slate-600"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">System Password</label>
                                <div className="relative group">
                                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:bg-white/10 focus:border-blue-500/50 outline-none transition-all placeholder-slate-600"
                                    />
                                </div>
                            </div>

                            <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex gap-4">
                                <div className="w-8 h-8 shrink-0 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                    <Info className="w-4 h-4 text-blue-400" />
                                </div>
                                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                                    Login credentials allow system access via the terminal or administrative portal.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Preferences Card */}
                    <div className={sectionClasses}>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-600">
                                <Briefcase className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-black text-slate-800 dark:text-white">Configuration</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className={labelClasses}><Globe className="w-3.5 h-3.5" /> Language Preference</label>
                                <select
                                    name="language_id"
                                    value={formData.language_id}
                                    onChange={handleChange}
                                    className={inputClasses('language_id')}
                                >
                                    <option value={1}>English (Global)</option>
                                    <option value={2}>Sinhala (Local)</option>
                                    <option value={3}>Tamil (Local)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className={labelClasses}>Initial Status</label>
                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        { id: 1, label: 'Active Service', color: 'bg-green-500' },
                                        { id: 2, label: 'Under Review', color: 'bg-amber-500' }
                                    ].map((status) => (
                                        <button
                                            key={status.id}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, status_id: status.id }))}
                                            className={clsx(
                                                "flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300",
                                                formData.status_id === status.id
                                                    ? "border-blue-500 bg-blue-500/5 shadow-sm"
                                                    : "border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 opacity-60 hover:opacity-100"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2.5 h-2.5 rounded-full ${status.color}`} />
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{status.label}</span>
                                            </div>
                                            {formData.status_id === status.id && (
                                                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Hub */}
                    <div className="space-y-4 pt-4">
                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-[1.75rem] font-black shadow-2xl shadow-blue-500/30 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-4 disabled:opacity-70 group"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Save className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    Finalize Registration
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={onBack}
                            className="w-full py-5 bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 rounded-[1.75rem] font-black hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 flex items-center justify-center gap-3"
                        >
                            <X className="w-5 h-5" />
                            Discard Entry
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

const UserPlus = (props) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24" height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" />
    </svg>
);

const X = (props) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24" height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
);
