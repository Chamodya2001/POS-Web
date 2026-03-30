import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, Shield, Edit3, Camera, MapPin, Briefcase, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserProfilePage = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    
    // Fallback data if user properties are missing
    const userData = {
        name: user?.name || 'User Name',
        email: user?.email || 'user@example.com',
        role: user?.role || 'admin',
        phone: user?.phone || '+1 (555) 123-4567',
        address: user?.address || '123 Business Avenue, Tech District, CA 90210',
        joinedDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'January 2024',
        department: user?.department || 'Management',
        status: 'Active'
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">My Profile</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your account settings and preferences</p>
                </div>
                <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors shadow-sm shadow-primary-500/20"
                >
                    {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                    <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-effect rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col items-center relative overflow-hidden">
                        {/* Background Decoration */}
                        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-primary-500/20 to-purple-500/20 dark:from-primary-500/10 dark:to-purple-500/10 opacity-50 z-0"></div>
                        
                        <div className="relative z-10 w-32 h-32 rounded-full ring-4 ring-white dark:ring-slate-900 shadow-xl mb-4 group cursor-pointer mt-8">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={userData.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-tr from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                                    {userData.name.charAt(0)}
                                </div>
                            )}
                            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-8 h-8 text-white" />
                            </div>
                            {/* Online Badge */}
                            <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-white dark:border-slate-900 rounded-full"></div>
                        </div>

                        <h2 className="text-xl font-bold text-slate-800 dark:text-white z-10 capitalize text-center">{userData.name}</h2>
                        <p className="text-primary-600 dark:text-primary-400 font-medium text-sm mt-1 z-10 capitalize flex items-center gap-1.5 bg-primary-50 dark:bg-primary-500/10 px-3 py-1 rounded-full">
                            <Shield className="w-3.5 h-3.5" />
                            {userData.role.replace('_', ' ')}
                        </p>

                        <div className="w-full mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-4">
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-slate-500 dark:text-slate-500">Email Format</p>
                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{userData.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-slate-500 dark:text-slate-500">Phone</p>
                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{userData.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-slate-500 dark:text-slate-500">Location</p>
                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{userData.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Details & Settings */}
                <div className="lg:col-span-2 space-y-6">
                    {isEditing ? (
                        <div className="glass-effect rounded-2xl p-6 border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Edit Profile Information</h3>
                            </div>
                            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsEditing(false); }}>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                                    <input type="text" defaultValue={userData.name} className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-shadow" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                                        <input type="text" defaultValue={userData.phone} className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-shadow" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                                        <input type="email" defaultValue={userData.email} readOnly className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-500 cursor-not-allowed outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address</label>
                                    <textarea defaultValue={userData.address} rows={3} className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-shadow" />
                                </div>
                                
                                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsEditing(false)} 
                                        className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors shadow-sm shadow-primary-500/20"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>Save Changes</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <>
                            {/* Professional Details */}
                            <div className="glass-effect rounded-2xl p-6 border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Professional Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</label>
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                            <Briefcase className="w-5 h-5 text-primary-500" />
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{userData.department}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Role Type</label>
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                            <Shield className="w-5 h-5 text-purple-500" />
                                            <span className="text-sm font-medium pl-1 capitalize text-slate-700 dark:text-slate-200">{userData.role.replace('_', ' ')}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date Joined</label>
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                            <Calendar className="w-5 h-5 text-green-500" />
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{userData.joinedDate}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Account Status</label>
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{userData.status}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Security & Preferences */}
                            <div className="glass-effect rounded-2xl p-6 border border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Security Settings</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                        <div>
                                            <p className="font-semibold text-slate-800 dark:text-white">Change Password</p>
                                            <p className="text-sm text-slate-500 mt-1">Update your password to keep your account secure</p>
                                        </div>
                                        <button 
                                            onClick={() => setIsChangingPassword(true)}
                                            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                                        >
                                            Update
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                        <div>
                                            <p className="font-semibold text-slate-800 dark:text-white">Two-Factor Authentication</p>
                                            <p className="text-sm text-slate-500 mt-1">Add an extra layer of security to your account</p>
                                        </div>
                                        <button className="px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors">
                                            Enable
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Change Password Modal */}
            {isChangingPassword && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Change Password</h3>
                            <button 
                                onClick={() => setIsChangingPassword(false)}
                                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); setIsChangingPassword(false); }}>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                                <input type="password" required className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-shadow" placeholder="••••••••" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
                                <input type="password" required className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-shadow" placeholder="••••••••" />
                            </div>
                            
                            <div className="mt-6 flex justify-end gap-3 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setIsChangingPassword(false)} 
                                    className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors shadow-sm shadow-primary-500/20"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>Update Password</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfilePage;
