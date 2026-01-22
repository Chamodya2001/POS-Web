import React from 'react';
import { LayoutDashboard, Store, ShoppingBag, Users, Settings, LogOut, Package } from 'lucide-react';
import clsx from 'clsx';

import { useAuth } from '../context/AuthContext';

const Sidebar = ({ activeTab, onTabChange }) => {
    const { logout } = useAuth();

    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'pos', icon: Store, label: 'POS System' },
        { id: 'products', icon: Package, label: 'Products' },
        { id: 'orders', icon: ShoppingBag, label: 'Orders' },
        { id: 'customers', icon: Users, label: 'Customers' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="h-screen w-20 md:w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col justify-between transition-all duration-300 z-50 fixed left-0 top-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
            <div>
                {/* ... header and nav ... */}
                <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-slate-100">
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/30">
                        <Store className="w-5 h-5 text-white" />
                    </div>
                    <span className="hidden md:block ml-3 font-bold text-lg text-slate-800 tracking-tight">LoopPOS</span>
                </div>

                <nav className="p-3 space-y-2 mt-4">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => onTabChange(item.id)}
                                className={clsx(
                                    "w-full flex items-center p-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                    isActive
                                        ? "bg-primary-50 text-primary-600 shadow-sm"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-600 rounded-r-full" />
                                )}
                                <Icon className={clsx("w-5 h-5 min-w-[20px]", isActive && "fill-current opacity-20")} />
                                <span className={clsx("hidden md:block ml-3 font-medium text-sm transition-transform duration-200", isActive ? "translate-x-1" : "group-hover:translate-x-1")}>
                                    {item.label}
                                </span>
                                {item.id === 'orders' && !isActive && (
                                    <span className="hidden md:flex ml-auto bg-red-500 text-white text-[10px] items-center justify-center w-5 h-5 rounded-full font-bold">
                                        3
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>
            </div>

            <div className="p-3 border-t border-slate-100">
                <button
                    onClick={logout}
                    className="w-full flex items-center p-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors group"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="hidden md:block ml-3 font-medium text-sm group-hover:translate-x-1 transition-transform">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
