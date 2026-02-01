import React, { useState } from 'react';
import {
    Tag, Plus, Search, Trash2,
    Layers, ChevronRight, Hash,
    MoreVertical, Edit3, Grid, List
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useTheme } from '../context/ThemeContext';
import clsx from 'clsx';

export default function CategoriesPage() {
    const { categories, addCategory, deleteCategory } = useProducts();
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    const [viewMode, setViewMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    const handleAdd = (e) => {
        e.preventDefault();
        if (newCategoryName.trim()) {
            addCategory(newCategoryName);
            setNewCategoryName('');
            setShowAddModal(false);
        }
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-2 max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Product Categories</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Organize your inventory with custom categories.</p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 flex">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={clsx("p-2 rounded-lg transition-all", viewMode === 'grid' ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white' : 'text-slate-400')}
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={clsx("p-2 rounded-lg transition-all", viewMode === 'list' ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white' : 'text-slate-400')}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/25 active:scale-95"
                    >
                        <Plus className="w-4 h-4" /> New Category
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all dark:text-white"
                    />
                </div>
                <div className="flex gap-4 px-2">
                    <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Total: <span className="text-slate-900 dark:text-white font-bold">{categories.length}</span>
                    </div>
                </div>
            </div>

            {/* Grid View */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCategories.map(category => (
                        <div key={category.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                            <div className="absolute -right-2 -top-2 opacity-5 scale-150 rotate-12 group-hover:scale-125 transition-transform duration-500">
                                <Layers className="w-24 h-24 text-primary-600" />
                            </div>

                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-primary-50 dark:bg-primary-900/10 text-primary-600 rounded-2xl border border-primary-100 dark:border-primary-800">
                                    <Tag className="w-5 h-5" />
                                </div>
                                <button
                                    onClick={() => deleteCategory(category.id)}
                                    className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <h3 className="font-bold text-slate-800 dark:text-white text-lg group-hover:text-primary-600 transition-colors uppercase tracking-tight">{category.name}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{category.count || 0} Products</p>

                            <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                                <span className="text-xs font-mono text-slate-400">ID: {category.id.substring(0, 8)}</span>
                                <button className="text-primary-600 hover:gap-2 transition-all flex items-center gap-1 text-xs font-bold">
                                    VIEW ITEMS <ChevronRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Empty State */}
                    {filteredCategories.length === 0 && (
                        <div className="col-span-full py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center">
                            <Layers className="w-12 h-12 text-slate-200 mb-2" />
                            <p className="text-slate-400 font-medium">No categories found.</p>
                        </div>
                    )}
                </div>
            ) : (
                /* List View */
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                <th className="px-8 py-5">Category Name</th>
                                <th className="px-8 py-5">ID</th>
                                <th className="px-8 py-5">Product Count</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {filteredCategories.map(category => (
                                <tr key={category.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-lg group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                                <Tag className="w-4 h-4" />
                                            </div>
                                            <span className="font-bold text-slate-800 dark:text-white uppercase tracking-tight">{category.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                                            <Hash className="w-3 h-3" /> {category.id}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-xs font-bold">
                                            {category.count || 0} Products
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 text-slate-400 hover:text-primary-600 rounded-xl transition-all">
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteCategory(category.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 rounded-xl transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Modal Overlay */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/10 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Plus className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Create New Category</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Enter a unique name for your new item group.</p>

                            <form onSubmit={handleAdd}>
                                <div className="space-y-4 mb-8">
                                    <div className="text-left">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Category Name</label>
                                        <input
                                            autoFocus
                                            required
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                            placeholder="e.g. Organic Dairy"
                                            className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-4 focus:ring-primary-500/10 outline-none transition-all dark:text-white"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-xl shadow-primary-500/20 hover:bg-primary-500 transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-5 h-5" /> Create
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
