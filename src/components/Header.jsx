import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, Calendar, Sun, Moon, LogOut, Settings, Edit3, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Header = ({ onTabChange }) => {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);
    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

                <div className="relative" ref={profileRef}>
                    <div 
                        className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 rounded-xl transition-all"
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-slate-800 dark:text-white">{user?.name || 'User'}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role?.replace('_', ' ') || 'Role'}</p>
                        </div>
                        {user?.avatar ? (
                            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white dark:ring-slate-800 shadow-md">
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="w-10 h-10 bg-gradient-to-tr from-primary-500 to-purple-500 rounded-full flex items-center justify-center shadow-md text-white font-bold ring-2 ring-white dark:ring-slate-800">
                                <User className="w-5 h-5" />
                            </div>
                        )}
                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Profile Dropdown */}
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden outline-none transform opacity-100 scale-100 transition-all origin-top-right z-50">
                            {/* Profile Header */}
                            <div className="p-5 flex flex-col items-center bg-gradient-to-b from-primary-50/50 to-transparent dark:from-primary-900/10 dark:to-transparent border-b border-slate-100 dark:border-slate-800">
                                {user?.avatar ? (
                                    <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-white dark:ring-slate-800 shadow-lg mb-3 relative group">
                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <Edit3 className="w-5 h-5 text-white" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-20 h-20 bg-gradient-to-tr from-primary-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg text-white font-bold ring-4 ring-white dark:ring-slate-800 mb-3 relative group text-2xl cursor-pointer">
                                        <span className="group-hover:hidden transition-all">{user?.name?.charAt(0) || <User className="w-8 h-8" />}</span>
                                        <Edit3 className="w-6 h-6 text-white hidden group-hover:block transition-all" />
                                    </div>
                                )}
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white capitalize">{user?.name || 'User'}</h3>
                                <p className="text-sm font-medium text-primary-500 bg-primary-50 dark:bg-primary-500/10 px-3 py-1 rounded-full mt-2 capitalize">
                                    {user?.role?.replace('_', ' ') || 'Role'}
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 truncate w-full text-center">
                                    {user?.email || 'user@example.com'}
                                </p>
                            </div>

                            {/* Menu Items */}
                            <div className="p-2">
                                <button 
                                    onClick={() => {
                                        setIsProfileOpen(false);
                                        onTabChange && onTabChange('profile');
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
                                >
                                    <User className="w-4 h-4 text-slate-400" />
                                    <span>My Profile</span>
                                </button>
                                <button 
                                    onClick={() => {
                                        setIsProfileOpen(false);
                                        onTabChange && onTabChange('settings');
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
                                >
                                    <Settings className="w-4 h-4 text-slate-400" />
                                    <span>Account Settings</span>
                                </button>
                                
                                <div className="h-px bg-slate-100 dark:bg-slate-800 my-2 mx-2"></div>
                                
                                <button 
                                    onClick={() => {
                                        setIsProfileOpen(false);
                                        logout && logout();
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors text-left"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
