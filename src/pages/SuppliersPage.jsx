import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Mail, Phone, MoreHorizontal, Building2, MapPin, Grid, List, Trash2, Edit2 } from 'lucide-react';
import { API_ROUTES } from '../config/apiConfig';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

const SupplierCard = ({ supplier, onEdit, onDelete, canDelete }) => (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all group relative">
        <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={() => onEdit(supplier)} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                <Edit2 className="w-4 h-4" />
            </button>
            {canDelete && (
                <button onClick={() => onDelete(supplier.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                </button>
            )}
        </div>

        <div className="flex flex-col items-center text-center">
            {/* ... rest of the card ... */}
            <div className="w-20 h-20 rounded-2xl bg-primary-50 dark:bg-primary-900/10 flex items-center justify-center mb-4 border border-primary-100 dark:border-primary-800">
                <Building2 className="w-10 h-10 text-primary-600" />
            </div>

            <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1">{supplier.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{supplier.contactPerson}</p>

            <div className="space-y-2 w-full mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{supplier.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{supplier.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{supplier.address}</span>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-50 dark:border-slate-800 w-full">
                <span className={clsx(
                    "px-3 py-1 rounded-full text-xs font-medium",
                    supplier.status === 'Active' ? "bg-green-50 text-green-700 border border-green-100" : "bg-slate-50 text-slate-600 border border-slate-100"
                )}>
                    {supplier.status}
                </span>
            </div>
        </div>
    </div>
);

export default function SuppliersPage({ onAddSupplier, onEditSupplier }) {
    const { theme } = useTheme();
    const { user } = useAuth();
    const canDelete = user?.role !== 'admin';
    const [viewMode, setViewMode] = useState('grid');
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await fetch(API_ROUTES.SUPPLIERS.GET);
                const data = await response.json();
                if (data.success && data.data) {
                    setSuppliers(data.data.map(s => ({
                        id: s.supplier_id,
                        name: s.name,
                        contactPerson: s.contact_person,
                        email: s.email,
                        phone: s.phone,
                        address: s.address,
                        status: s.status === 1 ? 'Active' : 'Inactive'
                    })));
                } else {
                    // Demo Data
                    setSuppliers([
                        { id: 1, name: 'Global Tech Solutions', contactPerson: 'John Smith', email: 'john@globaltech.com', phone: '+94 77 123 4567', address: 'Colombo 03, Sri Lanka', status: 'Active' },
                        { id: 2, name: 'Eco Packaging Co.', contactPerson: 'Sarah Jay', email: 'sarah@ecopack.com', phone: '+94 71 987 6543', address: 'Kandy Road, Malabe', status: 'Active' },
                        { id: 3, name: 'NextGen Electronics', contactPerson: 'David Perera', email: 'david@nextgen.lk', phone: '+94 11 234 5678', address: 'Galle Road, Mount Lavinia', status: 'Inactive' },
                    ]);
                }
            } catch (err) {
                console.error("Failed to fetch suppliers", err);
                // Demo Data on error
                setSuppliers([
                    { id: 1, name: 'Global Tech Solutions', contactPerson: 'John Smith', email: 'john@globaltech.com', phone: '+1 555-0123', address: '123 Tech Lane, CA', status: 'Active' },
                    { id: 2, name: 'Eco Packaging Co.', contactPerson: 'Sarah Jay', email: 'sarah@ecopack.com', phone: '+1 555-0124', address: '456 Green St, NY', status: 'Active' },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchSuppliers();
    }, []);

    const handleDelete = async (id) => {
        if (!canDelete) return;
        if (!window.confirm('Are you sure you want to delete this supplier?')) return;

        try {
            const response = await fetch(API_ROUTES.SUPPLIERS.DELETE(id), { method: 'DELETE' });
            if (response.ok) {
                setSuppliers(prev => prev.filter(s => s.id !== id));
            }
        } catch (err) {
            console.error("Delete failed", err);
            // Even if it fails (because backend isn't ready), we'll update UI for demo
            setSuppliers(prev => prev.filter(s => s.id !== id));
        }
    };

    const filteredSuppliers = suppliers.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-2 max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Suppliers</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your supply chain and vendors.</p>
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
                        onClick={onAddSupplier}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/25 active:scale-95"
                    >
                        <Plus className="w-4 h-4" /> Add Supplier
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search suppliers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all dark:text-white"
                    />
                </div>
                <div className="flex gap-3 w-full md:w-auto overflow-x-auto">
                    {['All', 'Active', 'Inactive'].map(filter => (
                        <button key={filter} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all bg-white dark:bg-slate-900 whitespace-nowrap">
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-20">
                    <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSuppliers.map(supplier => (
                        <SupplierCard key={supplier.id} supplier={supplier} onEdit={onEditSupplier} onDelete={handleDelete} canDelete={canDelete} />
                    ))}
                    {filteredSuppliers.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                            <p className="text-slate-500">No suppliers found matching your search.</p>
                        </div>
                    )}
                </div>
            ) : (
                /* List View */
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs uppercase text-slate-500 font-semibold">
                                <th className="py-4 px-6">Supplier</th>
                                <th className="py-4 px-6">Contact Person</th>
                                <th className="py-4 px-6">Phone</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {filteredSuppliers.map(supplier => (
                                <tr key={supplier.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/10 flex items-center justify-center">
                                                <Building2 className="w-4 h-4 text-primary-600" />
                                            </div>
                                            <span className="font-semibold text-slate-800 dark:text-white">{supplier.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">{supplier.contactPerson}</td>
                                    <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">{supplier.phone}</td>
                                    <td className="py-4 px-6">
                                        <span className={clsx(
                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                            supplier.status === 'Active' ? "bg-green-50 text-green-700 border-green-100" : "bg-slate-50 text-slate-600 border-slate-100"
                                        )}>
                                            {supplier.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => onEditSupplier(supplier)} className="p-2 text-slate-400 hover:text-primary-600 transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            {canDelete && (
                                                <button onClick={() => handleDelete(supplier.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
