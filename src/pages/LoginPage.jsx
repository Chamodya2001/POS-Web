import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Store, ArrowRight, Lock, Mail, Loader2, AlertCircle, ArrowLeft, Shield, CheckCircle, User, LayoutDashboard, BarChart3, Users } from 'lucide-react';

export default function LoginPage({ onBack }) {
    // View state: 'login', 'forgot', 'otp', 'reset-password', 'reset-success'
    const [view, setView] = useState('login');
    const [role, setRole] = useState('admin');

    // Form states
    const [email, setEmail] = useState('admin@looopos.com');
    const [password, setPassword] = useState('admin');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // UI states
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();

    useEffect(() => {
        if (role === 'admin') {
            setEmail('admin@looopos.com');
            setPassword('admin');
        } else {
            setEmail('super@looopos.com');
            setPassword('superadmin');
        }
    }, [role]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
        } catch (err) {
            setError('Invalid email or password');
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
                setError('Please enter a valid 6-digit code');
                return;
            }
            setView('reset-password');
        }, 1500);
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
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

    return (
        <div className="min-h-screen flex bg-slate-900 font-sans">
            {/* LEFT PANEL - Branding & Visuals (Hidden on mobile) */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-slate-950 flex-col justify-between p-16">
                {/* Background Patterns */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-900/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex items-center gap-3 text-white">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <Store className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">LoopPOS</span>
                    </div>

                    <div className="space-y-8 max-w-lg">
                        <h2 className="text-5xl font-bold text-white leading-tight">
                            Streamline your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">
                                retail operations
                            </span>
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Experience the future of point of sale. Simple, powerful, and built for growth. Manage inventory, sales, and customers in one place.
                        </p>

                        <div className="flex gap-6 pt-4">
                            <div className="flex flex-col gap-2">
                                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                                    <LayoutDashboard className="w-5 h-5 text-primary-400" />
                                </div>
                                <span className="text-slate-300 text-sm font-medium">Smart Dashboard</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                                    <BarChart3 className="w-5 h-5 text-primary-400" />
                                </div>
                                <span className="text-slate-300 text-sm font-medium">Analytics</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                                    <Users className="w-5 h-5 text-primary-400" />
                                </div>
                                <span className="text-slate-300 text-sm font-medium">CRM</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-slate-500 text-sm border-t border-slate-800 pt-8">
                        <p>&copy; 2026 LoopPOS Systems</p>
                        <div className="flex gap-4">
                            <span className="hover:text-slate-300 cursor-pointer transition-colors">Privacy Policy</span>
                            <span className="hover:text-slate-300 cursor-pointer transition-colors">Terms of Service</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL - Authentication Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-slate-900 relative">
                {onBack && (
                    <button onClick={onBack} className="absolute top-8 left-8 p-2 text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                )}

                <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
                            {view === 'login' && 'Welcome back'}
                            {view === 'forgot' && 'Reset your password'}
                            {view === 'otp' && 'Verify identity'}
                            {view === 'reset-password' && 'New Password'}
                            {view === 'reset-success' && 'All set!'}
                        </h1>
                        <p className="text-slate-400 text-sm">
                            {view === 'login' && 'Please enter your details to sign in.'}
                            {view === 'forgot' && 'Enter your email to receive a reset code.'}
                            {view === 'otp' && `Enter the code sent to ${email}`}
                            {view === 'reset-password' && 'Enter your new password below.'}
                            {view === 'reset-success' && 'Your password has been reset successfully.'}
                        </p>
                    </div>

                    {/* VIEW: LOGIN */}
                    {view === 'login' && (
                        <div className="space-y-6">
                            {/* Role Switcher */}
                            <div className="bg-slate-800/50 p-1.5 rounded-xl border border-slate-700 flex gap-1">
                                <button
                                    onClick={() => setRole('admin')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${role === 'admin'
                                            ? 'bg-slate-700 text-white shadow-sm ring-1 ring-white/10'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                                        }`}
                                >
                                    <User className="w-4 h-4" /> Admin
                                </button>
                                <button
                                    onClick={() => setRole('super_admin')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${role === 'super_admin'
                                            ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/25'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                                        }`}
                                >
                                    <Shield className="w-4 h-4" /> Super Admin
                                </button>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-5">
                                {error && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm">
                                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                <div className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Work Email</label>
                                        <div className="relative group">
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all font-medium"
                                                placeholder="name@company.com"
                                            />
                                            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-slate-300 transition-colors" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-center ml-1">
                                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                                            <button
                                                type="button"
                                                onClick={() => setView('forgot')}
                                                className="text-xs text-primary-400 hover:text-primary-300 font-medium transition-colors"
                                            >
                                                Forgot password?
                                            </button>
                                        </div>
                                        <div className="relative group">
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all font-medium"
                                                placeholder="••••••••"
                                            />
                                            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-slate-300 transition-colors" />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-sm shadow-xl shadow-primary-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-5 h-5" /></>}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* VIEW: FORGOT PASSWORD */}
                    {view === 'forgot' && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300">
                            <form onSubmit={handleForgotSubmit} className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Work Email</label>
                                    <div className="relative group">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all font-medium"
                                            placeholder="name@company.com"
                                            required
                                        />
                                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-slate-300 transition-colors" />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-sm shadow-xl shadow-primary-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Verification Code'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setView('login')}
                                    className="w-full py-2 text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft className="w-3 h-3" /> Back to Login
                                </button>
                            </form>
                        </div>
                    )}

                    {/* VIEW: OTP */}
                    {view === 'otp' && (
                        <div className="space-y-8 animate-in slide-in-from-right duration-300">
                            <form onSubmit={handleOtpSubmit} className="space-y-8">
                                <div className="flex gap-3 justify-center">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`otp-${index}`}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            className="w-12 h-14 bg-slate-800/50 border border-slate-700 rounded-xl text-center text-2xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all placeholder:text-slate-700"
                                            placeholder="·"
                                        />
                                    ))}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-sm shadow-xl shadow-primary-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Code'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setView('forgot')}
                                    className="w-full text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft className="w-3 h-3" /> Wrong Email?
                                </button>
                            </form>
                        </div>
                    )}

                    {/* VIEW: RESET PASSWORD (NEW) */}
                    {view === 'reset-password' && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300">
                            <form onSubmit={handleResetSubmit} className="space-y-5">
                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-200 text-sm">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">New Password</label>
                                    <div className="relative group">
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all font-medium"
                                            placeholder="••••••••"
                                        />
                                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-slate-300 transition-colors" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Confirm Password</label>
                                    <div className="relative group">
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all font-medium"
                                            placeholder="••••••••"
                                        />
                                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-slate-300 transition-colors" />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-sm shadow-xl shadow-primary-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Set New Password'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* VIEW: SUCCESS */}
                    {view === 'reset-success' && (
                        <div className="text-center space-y-6 animate-in slide-in-from-right duration-300 py-4">
                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto ring-1 ring-green-500/30">
                                <CheckCircle className="w-10 h-10 text-green-500" />
                            </div>

                            <button
                                onClick={() => setView('login')}
                                className="w-full py-3.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-sm shadow-xl shadow-primary-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                Continue to Login <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {/* Quick Access / Demo Credentials (Subtle) */}
                    <div className="pt-8 border-t border-slate-800">
                        <div className="flex gap-2 justify-center">
                            <button
                                onClick={() => { setRole('admin'); setEmail('admin@looopos.com'); setPassword('admin'); setView('login'); }}
                                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-400 hover:text-white transition-colors border border-slate-700 hover:border-slate-600"
                            >
                                Fill Admin
                            </button>
                            <button
                                onClick={() => { setRole('super_admin'); setEmail('super@looopos.com'); setPassword('superadmin'); setView('login'); }}
                                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-400 hover:text-white transition-colors border border-slate-700 hover:border-slate-600"
                            >
                                Fill Super Admin
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
