import React from 'react';
import { Search, Bell, User, Calendar, Sun, Moon } from 'lucide-react'; // Added Sun, Moon
import { useTheme } from '../context/ThemeContext'; // Added Hook

const Header = () => {
    const { theme, toggleTheme } = useTheme(); // Consumed Hook
    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <header className="h-16 glass-effect dark:bg-slate-900/80 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 fixed top-0 right-0 left-20 md:left-64 z-50 transition-all duration-300 backdrop-blur-md">

            {/* Search Bar - hidden on mobile */}
            <div className="hidden md:flex items-center flex-1 max-w-lg">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search products, orders, or customers..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6 ml-auto">
                <div className="hidden md:flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700 transition-colors">
                    <Calendar className="w-4 h-4" />
                    <span>{currentDate}</span>
                </div>

                <button
                    onClick={toggleTheme}
                    className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-800 dark:text-white">Admin User</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Super Admin</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-tr from-primary-500 to-purple-500 rounded-full flex items-center justify-center shadow-md text-white font-bold ring-2 ring-white dark:ring-slate-800">
                        <User className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
