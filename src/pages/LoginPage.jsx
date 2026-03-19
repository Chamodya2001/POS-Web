import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Store, ArrowRight, Lock, Mail, Loader2,
    AlertCircle, ArrowLeft, Shield, CheckCircle,
    User, LayoutDashboard, BarChart3, Users,
    Globe, Sparkles, KeyRound
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export default function LoginPage({ onBack }) {
    // View state: 'login', 'forgot', 'otp', 'reset-password', 'reset-success'
    const [view, setView] = useState('login');
    const [role, setRole] = useState('admin');

    // Form states - Admin matches the casior.casior table email found in DB
    const [email, setEmail] = useState('Lakshanumayanha6789@gmail.com');
    const [password, setPassword] = useState('admin');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // UI states
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();

    // Reset fields when switching roles
    useEffect(() => {
        if (role === 'admin') {
            setEmail('Lakshanumayanha6789@gmail.com');
            setPassword('admin');
        } else {
            // Updated to match actual database record for Super Admin
            setEmail('kd@2026');
            setPassword('superadmin');
        }
    }, [role]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password, role);
        } catch (err) {
            // Display specific error message from server if available, otherwise fallback
            const errorMessage = err.message || (typeof err === 'object' ? err.message : null) || 'Connection failed. Please check your network and try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setView('otp');
        }, 1500);
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            if (otp.join('').length !== 6) {
                setError('Please enter a valid 6-digit security code');
                return;
            }
            setView('reset-password');
        }, 1200);
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setError('Security protocol requires at least 8 characters');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setView('reset-success');
        }, 1500);
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    const inputClasses = "w-full bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl px-5 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all duration-300 font-medium tracking-tight";

    return (
        <div className="min-h-screen flex bg-slate-950 font-sans selection:bg-blue-500/30 selection:text-blue-200">
            {/* LEFT PANEL - Premium Branding & Animation */}
            <div className="hidden lg:flex w-[55%] relative overflow-hidden flex-col justify-between p-20 border-r border-white/5">
                {/* Dynamic Background Elements */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/2" />
                    <div className="absolute top-1/2 left-1/4 w-[200px] h-[200px] bg-emerald-500/5 rounded-full blur-[100px] -translate-y-1/2" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.02)_1px,transparent_0)] bg-[size:32px_32px]" />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4 text-white"
                    >
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20 rotate-3">
                            <Store className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-black tracking-tighter uppercase leading-none">Loop<span className="text-blue-500">POS</span></span>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Enterprise Solution</span>
                        </div>
                    </motion.div>

                    <div className="space-y-10 max-w-xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6">
                                <Sparkles className="w-3 h-3" />
                                Premium Enterprise Edition v4.0
                            </div>
                            <h2 className="text-6xl font-black text-white leading-[1.1] tracking-tight mb-8">
                                Secure Access to your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                                    Business Intelligence
                                </span>
                            </h2>
                            <p className="text-slate-400 text-xl leading-relaxed font-medium">
                                Professional point-of-sale management for modern commerce. Scalable, secure, and designed for high-performance retail operations.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex gap-10 pt-4"
                        >
                            {[
                                { icon: LayoutDashboard, label: 'Omni-Channel' },
                                { icon: BarChart3, label: 'Advanced Analytics' },
                                { icon: Users, label: 'Global Staffing' }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col gap-3 group cursor-default">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-blue-500/50 group-hover:bg-blue-500/5 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-blue-500/5">
                                        <item.icon className="w-6 h-6 text-slate-400 group-hover:text-blue-400 transition-colors" />
                                    </div>
                                    <span className="text-slate-500 text-[11px] font-black uppercase tracking-widest group-hover:text-slate-300 transition-colors">{item.label}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 text-[11px] font-bold uppercase tracking-widest border-t border-white/5 pt-10">
                        <p>&copy; 2026 LoopPOS Systems Incorporated</p>
                        <div className="flex gap-8">
                            <span className="hover:text-blue-400 cursor-pointer transition-colors">Privacy Shield</span>
                            <span className="hover:text-blue-400 cursor-pointer transition-colors">Compliance</span>
                            <span className="hover:text-blue-400 cursor-pointer transition-colors flex items-center gap-1.5 underline underline-offset-4">
                                <Globe className="w-3 h-3" /> Global (EN-US)
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL - High-End Authentication Card */}
            <div className="w-full lg:w-[45%] flex flex-col justify-center items-center p-8 lg:p-20 relative bg-[#020617]">

                {/* Mobile Header (Visible only on small screens) */}
                <div className="lg:hidden absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20">
                        <Store className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-lg font-black text-white uppercase tracking-tighter">Loop<span className="text-blue-500">POS</span></span>
                </div>

                {onBack && (
                    <button onClick={onBack} className="absolute top-12 right-12 p-3 text-slate-500 hover:text-white transition-all hover:bg-white/5 rounded-2xl flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                        <ArrowLeft className="w-4 h-4" /> Back to Portal
                    </button>
                )}

                <div className="w-full max-w-md space-y-10 relative">
                    <div className="space-y-3">
                        <motion.div
                            key={view}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                        >
                            <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
                                {view === 'login' && 'System Access'}
                                {view === 'forgot' && 'Identity Recovery'}
                                {view === 'otp' && 'Security Clearance'}
                                {view === 'reset-password' && 'Reset Protocol'}
                                {view === 'reset-success' && 'Confirmed'}
                            </h1>
                            <p className="text-slate-500 font-medium text-lg">
                                {view === 'login' && `Initiating ${role === 'super_admin' ? 'Candidate' : 'Staff'} protocol. Enter credentials.`}
                                {view === 'forgot' && 'Authenticate your ID to initiate reset.'}
                                {view === 'otp' && `Verifying security token sent to ${email}`}
                                {view === 'reset-password' && 'Define a new secure access key.'}
                                {view === 'reset-success' && 'Security credentials updated successfully.'}
                            </p>
                        </motion.div>
                    </div>

                    {/* VIEW: LOGIN */}
                    {view === 'login' && (
                        <div className="space-y-8">
                            {/* Role Switcher - Professional Toggle */}
                            <div className="bg-slate-900/80 p-1.5 rounded-[2rem] border border-slate-800 flex gap-1 shadow-inner">
                                <button
                                    onClick={() => setRole('admin')}
                                    className={clsx(
                                        "flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.75rem] text-xs font-black uppercase tracking-[0.15em] transition-all duration-500",
                                        role === 'admin'
                                            ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20'
                                            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                                    )}
                                >
                                    <User className="w-4 h-4" /> Staff Protocol
                                </button>
                                <button
                                    onClick={() => setRole('super_admin')}
                                    className={clsx(
                                        "flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.75rem] text-xs font-black uppercase tracking-[0.15em] transition-all duration-500",
                                        role === 'super_admin'
                                            ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20'
                                            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                                    )}
                                >
                                    <Shield className="w-4 h-4" /> Candidate Protocol
                                </button>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-6">
                                <AnimatePresence mode="wait">
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="p-5 bg-red-500/5 border border-red-500/20 rounded-[1.5rem] flex items-start gap-4 text-red-400 text-sm leading-relaxed"
                                        >
                                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                            <span className="font-semibold">{error}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Registry Email</label>
                                        <div className="relative group">
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className={inputClasses}
                                                placeholder="e.g. administrator@loop.inc"
                                            />
                                            <Mail className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center ml-1">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Security Key</label>
                                            <button
                                                type="button"
                                                onClick={() => setView('forgot')}
                                                className="text-[10px] text-blue-500 hover:text-blue-400 font-black uppercase tracking-widest transition-colors underline underline-offset-4"
                                            >
                                                Loss of access?
                                            </button>
                                        </div>
                                        <div className="relative group">
                                            <input
                                                type="password"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className={inputClasses}
                                                placeholder="••••••••"
                                            />
                                            <KeyRound className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={clsx(
                                        "w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50",
                                        role === 'admin'
                                            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-2xl shadow-blue-500/25 mt-10"
                                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xl shadow-indigo-500/25 mt-10"
                                    )}
                                >
                                    {loading ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <>
                                            Execute Login <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* VIEW: FORGOT PASSWORD */}
                    {view === 'forgot' && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            <form onSubmit={handleForgotSubmit} className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Identification Email</label>
                                    <div className="relative group">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={inputClasses}
                                            placeholder="verified@company.com"
                                            required
                                        />
                                        <Mail className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 bg-white text-slate-950 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-3"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Request Reset Token'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setView('login')}
                                    className="w-full text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3"
                                >
                                    <ArrowLeft className="w-3 h-3" /> Back to Authorization
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {/* VIEW: OTP */}
                    {view === 'otp' && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-10"
                        >
                            <form onSubmit={handleOtpSubmit} className="space-y-10">
                                <div className="flex gap-4 justify-center">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`otp-${index}`}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            className="w-14 h-16 bg-slate-900 border-2 border-slate-800 rounded-2xl text-center text-3xl font-black text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-800"
                                            placeholder="0"
                                        />
                                    ))}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Clearance'}
                                </button>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => setView('forgot')}
                                        className="text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.2em]"
                                    >
                                        Resend Security Code
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {/* VIEW: RESET SUCCESS */}
                    {view === 'reset-success' && (
                        <div className="text-center space-y-10 py-6">
                            <div className="w-24 h-24 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto border border-emerald-500/20 shadow-2xl shadow-emerald-500/5 rotate-12">
                                <CheckCircle className="w-12 h-12 text-emerald-500 -rotate-12" />
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Security Updated</h3>
                                <p className="text-slate-500 font-medium">Your credentials have been re-validated. You may now proceed with the new access key.</p>
                            </div>

                            <button
                                onClick={() => setView('login')}
                                className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                            >
                                Continue to Dashboard <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {/* High-End Quick Access Controls */}
                    <div className="pt-12 border-t border-slate-900 flex flex-col items-center gap-4">
                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-[0.25em]">Automated Selection</span>
                        <div className="flex gap-3">
                            <button
                                onClick={() => { setRole('admin'); setView('login'); setEmail('Lakshanumayanha6789@gmail.com'); setPassword('admin'); }}
                                className="px-5 py-2.5 rounded-xl bg-slate-900/50 hover:bg-blue-600/10 text-[9px] font-black text-slate-500 hover:text-blue-400 uppercase tracking-widest transition-all border border-slate-800 hover:border-blue-500/30"
                            >
                                <span className="opacity-50 mr-2">/</span> Load Staff (Casior)
                            </button>
                            <button
                                onClick={() => { setRole('super_admin'); setView('login'); setEmail('kd@2026'); setPassword('superadmin'); }}
                                className="px-5 py-2.5 rounded-xl bg-slate-900/50 hover:bg-indigo-600/10 text-[9px] font-black text-slate-500 hover:text-indigo-400 uppercase tracking-widest transition-all border border-slate-800 hover:border-indigo-500/30"
                            >
                                <span className="opacity-50 mr-2">/</span> Load SuperAdmin
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
