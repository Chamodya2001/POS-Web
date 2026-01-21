import React, { useState } from 'react';
import { User, Bell, Shield, Smartphone, CreditCard, Mail, Globe, Save, Moon, Volume2, Lock, LogOut } from 'lucide-react';
import clsx from 'clsx';

const SECTIONS = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'devices', label: 'Connected Devices', icon: Smartphone },
];

const Toggle = ({ enabled, onChange }) => (
    <button
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={clsx(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/50",
            enabled ? 'bg-primary-600' : 'bg-slate-200'
        )}
    >
        <span
            className={clsx(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm",
                enabled ? 'translate-x-6' : 'translate-x-1'
            )}
        />
    </button>
);

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [settings, setSettings] = useState({
        notifications: true,
        sound: true,
        darkMode: false,
        emailMarketing: true,
        twoFactor: true,
    });

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="p-2 max-w-[1200px] mx-auto h-[calc(100vh-100px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row h-full gap-6">

                {/* Settings Sidebar */}
                <div className="w-full md:w-64 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden shrink-0 h-fit">
                    <div className="p-4 border-b border-slate-100">
                        <h2 className="font-bold text-slate-800">Settings</h2>
                        <p className="text-xs text-slate-500">Manage your preferences</p>
                    </div>
                    <nav className="p-2 space-y-1">
                        {SECTIONS.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveTab(section.id)}
                                className={clsx(
                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                                    activeTab === section.id
                                        ? "bg-primary-50 text-primary-700 shadow-sm"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <section.icon className={clsx("w-4 h-4", activeTab === section.id && "fill-current opacity-20")} />
                                {section.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">{SECTIONS.find(s => s.id === activeTab)?.label}</h2>
                            <p className="text-sm text-slate-500">Update your {activeTab} settings.</p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20 active:scale-95">
                            <Save className="w-4 h-4" /> Save Changes
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">

                        {activeTab === 'general' && (
                            <div className="space-y-6 max-w-2xl">
                                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                                        <User className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-800">Store Profile</h4>
                                        <p className="text-sm text-slate-500 mb-3">This information will be displayed on receipts.</p>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50">Change Logo</button>
                                            <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-red-600 shadow-sm hover:bg-red-50 hover:border-red-100">Remove</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">Store Name</label>
                                        <input type="text" defaultValue="LoopPOS Store" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                                        <input type="email" defaultValue="contact@looopos.com" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">Phone</label>
                                        <input type="tel" defaultValue="+1 (555) 000-0000" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">Currency</label>
                                        <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500">
                                            <option>USD ($)</option>
                                            <option>EUR (€)</option>
                                            <option>GBP (£)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    <h4 className="font-bold text-slate-800 mb-4">Preferences</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-slate-100 rounded-lg"><Moon className="w-4 h-4 text-slate-600" /></div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800">Dark Mode</p>
                                                    <p className="text-xs text-slate-500">Adjust the appearance of the application</p>
                                                </div>
                                            </div>
                                            <Toggle enabled={settings.darkMode} onChange={() => handleToggle('darkMode')} />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-slate-100 rounded-lg"><Volume2 className="w-4 h-4 text-slate-600" /></div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800">Sound Effects</p>
                                                    <p className="text-xs text-slate-500">Play sounds on interactions</p>
                                                </div>
                                            </div>
                                            <Toggle enabled={settings.sound} onChange={() => handleToggle('sound')} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6 max-w-2xl">
                                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
                                    <Shield className="w-5 h-5 text-amber-600 shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-amber-800 text-sm">Security Recommendation</h4>
                                        <p className="text-xs text-amber-700 mt-1">We recommend enabling Two-Factor Authentication for enhanced account security.</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between py-3 border-b border-slate-50">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary-50 rounded-lg"><Lock className="w-4 h-4 text-primary-600" /></div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-800">Two-Factor Authentication</p>
                                                <p className="text-xs text-slate-500">Secure your account with 2FA</p>
                                            </div>
                                        </div>
                                        <Toggle enabled={settings.twoFactor} onChange={() => handleToggle('twoFactor')} />
                                    </div>

                                    <div className="pt-4">
                                        <button className="text-sm text-primary-600 font-medium hover:text-primary-700 hover:underline">Change Password</button>
                                    </div>

                                    <div className="pt-8 mt-8 border-t border-slate-100">
                                        <button className="flex items-center gap-2 text-red-600 font-medium hover:bg-red-50 px-4 py-2 rounded-xl transition-colors">
                                            <LogOut className="w-4 h-4" /> Sign out of all devices
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-6 max-w-2xl">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-800">Email Notifications</p>
                                            <p className="text-xs text-slate-500">Receive emails about new orders</p>
                                        </div>
                                        <Toggle enabled={settings.notifications} onChange={() => handleToggle('notifications')} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-800">Marketing Emails</p>
                                            <p className="text-xs text-slate-500">Receive offers and updates</p>
                                        </div>
                                        <Toggle enabled={settings.emailMarketing} onChange={() => handleToggle('emailMarketing')} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
