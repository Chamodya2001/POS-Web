import React, { useState, useEffect } from 'react';
import {
    User, Mail, Phone, MapPin, Briefcase,
    Calendar, Shield, Lock, Save, Trash2,
    Search, Sparkles, Info, Globe, UserCheck,
    X, Loader, ArrowLeft, UserPlus
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';
import { API } from '../services/appService';
import Swal from "sweetalert2";

// Employee Card Component for Sidebar
const EmployeeCard = ({ employee, isSelected, isDarkMode, onClick }) => (
    <div
        onClick={onClick}
        className={clsx(
            'group relative rounded-2xl border p-4 cursor-pointer transition-all duration-300',
            isSelected
                ? isDarkMode
                    ? 'bg-blue-600/10 border-blue-500/50 shadow-lg shadow-blue-500/10'
                    : 'bg-blue-50 border-blue-200 shadow-sm'
                : isDarkMode
                    ? 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600'
                    : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm'
        )}
    >
        <div className="flex items-center gap-4">
            <div className={clsx(
                'w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black transition-all duration-300',
                isSelected
                    ? 'bg-blue-500 text-white scale-105 shadow-lg shadow-blue-500/30'
                    : isDarkMode
                        ? 'bg-slate-700 text-slate-300'
                        : 'bg-slate-100 text-slate-600'
            )}>
                {employee.first_name?.[0]}{employee.last_name?.[0]}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                    <h3 className={clsx(
                        'font-bold text-sm truncate',
                        isDarkMode ? 'text-white' : 'text-slate-900'
                    )}>
                        {employee.first_name} {employee.last_name}
                    </h3>
                    <div className={clsx(
                        'w-2 h-2 rounded-full shrink-0',
                        employee.status_id === 1 ? 'bg-green-500' : 'bg-red-500'
                    )} />
                </div>
                <p className={clsx(
                    'text-[11px] font-medium opacity-60 truncate',
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                )}>
                    {employee.email}
                </p>
            </div>
        </div>
    </div>
);

export default function EmployeesPage({ onAddEmployee }) {
    const { theme } = useTheme();
    const { user } = useAuth();
    const isDarkMode = theme === 'dark';

    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState(null);
    const [focusedField, setFocusedField] = useState(null);

    // Initial Fetch
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await API.getEmployees();
                if (response && response.success) {
                    setEmployees(response.data);
                }
            } catch (err) {
                console.error("Failed to fetch employees", err);
            } finally {
                setFetchLoading(false);
            }
        };
        fetchEmployees();
    }, []);

    // Set form data when employee selected
    useEffect(() => {
        if (selectedEmployee) {
            setFormData({
                ...selectedEmployee,
                password: "" // Don't show password
            });
        } else {
            setFormData(null);
        }
    }, [selectedEmployee]);

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

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Prepare the data for submission
        const payload = { ...formData };

        // Remove read-only/metadata fields that cause validation errors
        delete payload.casior_id;
        delete payload.create_at;
        delete payload.update_at;

        // Ensure phone numbers are integers as required by the backend schema
        if (payload.phone_number && Array.isArray(payload.phone_number)) {
            payload.phone_number = payload.phone_number.map(num => parseInt(num) || 0);
        }

        // Only include password if the user actually typed a new one
        if (!payload.password || payload.password.trim() === "") {
            delete payload.password;
        }

        try {
            const response = await API.updateEmployee(selectedEmployee.casior_id, payload);
            if (response && response.success) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Employee updated successfully.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });

                // Update local list with the new data from server
                setEmployees(prev => prev.map(emp =>
                    emp.casior_id === selectedEmployee.casior_id ? response.data : emp
                ));
                setSelectedEmployee(response.data);
            }
        } catch (err) {
            console.error("Failed to update", err);
            // Show more helpful error message if data available
            const errorMsg = err.data ? Object.entries(err.data).map(([k, v]) => `${k}: ${v}`).join(', ') : 'Update failed.';
            Swal.fire('Validation Error', errorMsg || 'Please check your input fields.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#3b82f6',
            confirmButtonText: 'Yes, delete member'
        });

        if (result.isConfirmed) {
            try {
                await API.deleteEmployee(selectedEmployee.casior_id);
                setEmployees(prev => prev.filter(emp => emp.casior_id !== selectedEmployee.casior_id));
                setSelectedEmployee(null);
                Swal.fire('Deleted!', 'Employee removed successfully.', 'success');
            } catch (err) {
                console.error("Delete failed", err);
                Swal.fire('Error', 'Delete failed.', 'error');
            }
        }
    };

    const filteredEmployees = employees.filter(emp =>
        `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const inputClasses = (name) => clsx(
        "w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border rounded-2xl text-sm transition-all duration-300 outline-none shadow-sm",
        isDarkMode
            ? "text-white border-slate-700/50 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 placeholder-slate-600"
            : "text-slate-900 border-slate-200 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 placeholder-slate-400",
        focusedField === name && "border-blue-500 shadow-sm ring-4 ring-blue-500/5"
    );

    const labelClasses = "text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 ml-1 flex items-center gap-1.5";

    return (
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Sidebar - Employee List */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-blue-600 mb-1">
                                <UserCheck className="w-5 h-5 font-bold" />
                                <span className="text-xs font-black uppercase tracking-widest opacity-80">Directory</span>
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                Staff <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Management</span>
                            </h1>
                        </div>
                        <button
                            onClick={onAddEmployee}
                            className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105 active:scale-95 group"
                        >
                            <UserPlus className="w-5 h-5 transition-transform group-hover:rotate-12" />
                        </button>
                    </div>

                    <div className={clsx(
                        "rounded-[2rem] border overflow-hidden flex flex-col h-[calc(100vh-280px)]",
                        isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-xl shadow-slate-200/20"
                    )}>
                        {/* Search Bar */}
                        <div className="p-6 border-b border-inherit bg-slate-50/50 dark:bg-slate-800/30">
                            <div className="relative group">
                                <Search className={clsx(
                                    "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300",
                                    isDarkMode ? "text-slate-500 group-focus-within:text-blue-500" : "text-slate-400 group-focus-within:text-blue-500"
                                )} />
                                <input
                                    type="text"
                                    placeholder="Search staff members..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={clsx(
                                        "w-full pl-11 pr-4 py-3.5 rounded-2xl border text-sm outline-none transition-all duration-300",
                                        isDarkMode
                                            ? "bg-slate-800 border-slate-700 text-white placeholder-slate-600 focus:border-blue-500/50"
                                            : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500/50 shadow-sm"
                                    )}
                                />
                            </div>
                        </div>

                        {/* Scrolling List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {fetchLoading ? (
                                <div className="flex flex-col items-center justify-center h-full gap-4 opacity-50">
                                    <Loader className="w-8 h-8 animate-spin text-blue-500" />
                                    <p className="text-xs font-bold uppercase tracking-widest">Loading Directory...</p>
                                </div>
                            ) : filteredEmployees.length > 0 ? (
                                filteredEmployees.map(emp => (
                                    <EmployeeCard
                                        key={emp.casior_id}
                                        employee={emp}
                                        isSelected={selectedEmployee?.casior_id === emp.casior_id}
                                        isDarkMode={isDarkMode}
                                        onClick={() => setSelectedEmployee(emp)}
                                    />
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-40">
                                    <Search className="w-12 h-12 mb-4" />
                                    <p className="text-sm font-bold">No employees found</p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-inherit opacity-50 text-[10px] text-center font-bold uppercase tracking-widest">
                            {filteredEmployees.length} Members Total
                        </div>
                    </div>
                </div>

                {/* Right Area - Detail Form */}
                <div className="lg:col-span-8">
                    {!formData ? (
                        <div className={clsx(
                            "h-[calc(100vh-280px)] rounded-[3rem] border-2 border-dashed flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-500",
                            isDarkMode ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50/50"
                        )}>
                            <div className="w-24 h-24 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
                                <UserCheck className="w-12 h-12 text-blue-500" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Member Details</h2>
                            <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8">
                                Select a staff member from the directory to view or modify their account information.
                            </p>
                            <div className="flex gap-4">
                                <div className="px-4 py-2 rounded-xl bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                                    Full Access
                                </div>
                                <div className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                                    Real-time Sync
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdate} className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                            {/* Form Header with Quick Actions */}
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-blue-600 text-white flex items-center justify-center text-2xl font-black shadow-xl shadow-blue-500/30">
                                        {formData.first_name?.[0]}{formData.last_name?.[0]}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                                            {formData.first_name} {formData.last_name}
                                        </h2>
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            <Mail className="w-3 h-3 text-blue-500" />
                                            {formData.email}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedEmployee(null)}
                                        className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left Column: Personal + Address */}
                                <div className="space-y-8">
                                    {/* Personal Info */}
                                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/10">
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 dark:text-blue-400">
                                                <User className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Personal Profile</h3>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className={labelClasses}>First Name</label>
                                                <input
                                                    name="first_name"
                                                    value={formData.first_name || ""}
                                                    onChange={handleChange}
                                                    className={inputClasses('first_name')}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className={labelClasses}>Last Name</label>
                                                <input
                                                    name="last_name"
                                                    value={formData.last_name || ""}
                                                    onChange={handleChange}
                                                    className={inputClasses('last_name')}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className={labelClasses}>NIC Number</label>
                                                <input
                                                    name="nic"
                                                    value={formData.nic || ""}
                                                    onChange={handleChange}
                                                    className={inputClasses('nic')}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className={labelClasses}>DOB</label>
                                                <input
                                                    type="date"
                                                    name="dob"
                                                    value={formData.dob || ""}
                                                    onChange={handleChange}
                                                    className={inputClasses('dob')}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className={labelClasses}>Gender</label>
                                                <select
                                                    name="gender_id"
                                                    value={formData.gender_id || 1}
                                                    onChange={handleChange}
                                                    className={inputClasses('gender_id')}
                                                >
                                                    <option value={1}>Male</option>
                                                    <option value={2}>Female</option>
                                                    <option value={3}>Other</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className={labelClasses}>Phone</label>
                                                <input
                                                    name="phone_number"
                                                    value={formData.phone_number?.[0] || ""}
                                                    onChange={handleChange}
                                                    className={inputClasses('phone_number')}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address Info */}
                                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/10">
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl text-indigo-600 dark:text-indigo-400">
                                                <MapPin className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Location Details</h3>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-1">
                                                <label className={labelClasses}>Full Address</label>
                                                <input
                                                    name="address"
                                                    value={formData.address || ""}
                                                    onChange={handleChange}
                                                    className={inputClasses('address')}
                                                />
                                            </div>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="space-y-1">
                                                    <label className={labelClasses}>Town</label>
                                                    <input name="town" value={formData.town || ""} onChange={handleChange} className={inputClasses('town')} />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className={labelClasses}>District</label>
                                                    <input name="district" value={formData.district || ""} onChange={handleChange} className={inputClasses('district')} />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className={labelClasses}>Province</label>
                                                    <input name="province" value={formData.province || ""} onChange={handleChange} className={inputClasses('province')} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Security + Role */}
                                <div className="space-y-8">
                                    {/* Security: Stand out with dark background like AddEmploymentPage */}
                                    <div className="bg-slate-900 dark:bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden group">
                                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white/10 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-700" />

                                        <div className="flex items-center gap-3 mb-8 relative z-10">
                                            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl">
                                                <Lock className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-lg font-bold">Access Control</h3>
                                        </div>

                                        <div className="space-y-6 relative z-10">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-blue-200 uppercase tracking-widest ml-1 opacity-70">Email Address</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email || ""}
                                                    onChange={handleChange}
                                                    className="w-full px-5 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-sm focus:bg-white/20 focus:border-white/40 outline-none transition-all placeholder-white/30"
                                                />
                                            </div>
                                            <div className="space-y-1.5 pt-2">
                                                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <Shield className="w-3.5 h-3.5 text-blue-300" />
                                                        <span className="text-[10px] font-bold text-blue-100 uppercase tracking-wider">Security Notice</span>
                                                    </div>
                                                    <p className="text-[11px] text-blue-200/70 leading-relaxed">
                                                        Passwords are encrypted. To reset, use the administrative portal or the forgot password flow.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Role Preferences */}
                                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/10">
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-emerald-600 dark:text-emerald-400">
                                                <Briefcase className="w-5 h-5" />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Role & Preferences</h3>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-1">
                                                <label className={labelClasses}>Affiliated Shop</label>
                                                <input
                                                    disabled
                                                    value={formData.shop_name || "General Staff"}
                                                    className="w-full px-4 py-3.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm text-slate-500 cursor-not-allowed font-medium"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className={labelClasses}>Language</label>
                                                    <select
                                                        name="language_id"
                                                        value={formData.language_id || 1}
                                                        onChange={handleChange}
                                                        className={inputClasses('language_id')}
                                                    >
                                                        <option value={1}>English</option>
                                                        <option value={2}>Sinhala</option>
                                                        <option value={3}>Tamil</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className={labelClasses}>Account Status</label>
                                                    <select
                                                        name="status_id"
                                                        value={formData.status_id || 1}
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
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-4 flex gap-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="grow py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-[1.5rem] font-black shadow-xl shadow-blue-500/25 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
                                        >
                                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

