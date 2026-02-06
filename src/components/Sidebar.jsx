import React from 'react';
import {
    LayoutDashboard, Store, ShoppingBag, Users,
    Settings, LogOut, Package, UserCheck, UserPlus, BarChart3, Building2, TrendingUp, Tag
} from 'lucide-react';
import clsx from 'clsx';

import { useAuth } from '../context/AuthContext';

const Sidebar = ({ activeTab, onTabChange }) => {
    const { logout, user } = useAuth();

    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'pos', icon: Store, label: 'POS System' },
        { id: 'products', icon: Package, label: 'Products' },
        { id: 'categories', icon: Tag, label: 'Categories' },
        { id: 'stock', icon: TrendingUp, label: 'Stock Manage' },
        { id: 'orders', icon: ShoppingBag, label: 'Orders' },
        { id: 'customers', icon: Users, label: 'Customers' },
        { id: 'add-customer', icon: UserPlus, label: 'Add Customer' },
        { id: 'suppliers', icon: Building2, label: 'Suppliers' },
        { id: 'add-supplier', icon: UserPlus, label: 'Add Supplier' },
        { id: 'employment', icon: UserCheck, label: 'Add Employment' },
        { id: 'employee-report', icon: BarChart3, label: 'Employee Report' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ].filter(item => {
        if (user?.role === 'admin') {
            return !['orders', 'employment', 'employee-report'].includes(item.id);
        }
        return true;
    });

    return (
        <div className="h-screen w-20 md:w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col transition-all duration-300 z-50 fixed left-0 top-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
            {/* Sidebar Header */}
            <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/30">
                    <Store className="w-5 h-5 text-white" />
                </div>
                <span className="hidden md:block ml-3 font-bold text-lg text-slate-800 dark:text-white tracking-tight">LoopPOS</span>
            </div>

            {/* Scrollable Navigation Area */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-2 mt-2 custom-scrollbar">
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
                                    ? "bg-primary-50 dark:bg-primary-900/10 text-primary-600 dark:text-primary-400 shadow-sm"
                                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
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

            {/* Sidebar Footer */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900">
                <button
                    onClick={logout}
                    className="w-full flex items-center p-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors group"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="hidden md:block ml-3 font-medium text-sm group-hover:translate-x-1 transition-transform">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
