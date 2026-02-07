import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Mail, Phone, MoreHorizontal, ShoppingBag, Star, Calendar, MapPin, Grid, List, Trash2 } from 'lucide-react';
import { API_ROUTES } from '../config/apiConfig';
import { useAuth } from '../context/AuthContext';


const CustomerCard = ({ customer, onViewProfile, onDelete, canDelete }) => (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all group relative">
        <div className="absolute top-4 right-4 flex gap-2">
            {canDelete && (
                <button
                    onClick={() => onDelete(customer.id)}
                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            )}
            <button className="text-slate-300 hover:text-slate-600">
                <MoreHorizontal className="w-5 h-5" />
            </button>
        </div>

        <div className="flex flex-col items-center text-center">
            {/* ... rest of the card ... */}
            <div className="relative">
                <div className="w-20 h-20 rounded-full p-1 bg-white border border-slate-100 shadow-sm mb-3">
                    <img src={customer.avatar} alt={customer.name} className="w-full h-full rounded-full object-cover" />
                </div>
                {customer.status === 'VIP' && (
                    <div className="absolute -right-1 -bottom-1 bg-amber-100 text-amber-600 p-1.5 rounded-full border-2 border-white" title="VIP Customer">
                        <Star className="w-4 h-4 fill-current" />
                    </div>
                )}
            </div>

            <h3 className="font-bold text-slate-800 text-lg mb-1">{customer.name}</h3>
            <p className="text-sm text-slate-500 mb-4">{customer.email}</p>

            <div className="grid grid-cols-2 gap-3 w-full mb-4">
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-400 mb-1">Orders</p>
                    <p className="font-semibold text-slate-700">{customer.orders}</p>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-400 mb-1">Spent</p>
                    <p className="font-semibold text-primary-600">RS {customer.spent.toLocaleString()}</p>
                </div>
            </div>

            <div className="flex gap-2 w-full">
                <button className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" /> Message
                </button>
                <button
                    onClick={() => onViewProfile(customer.id)}
                    className="flex-1 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-sm font-medium transition-colors"
                >
                    View Profile
                </button>

            </div>
        </div>
    </div>
);

export default function CustomersPage({ onAddCustomer, onViewProfile }) {
    const { user } = useAuth();
    const canDelete = user?.role !== 'admin';
    const [viewMode, setViewMode] = useState('grid');
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await fetch(API_ROUTES.CUSTOMERS.GET);
                const data = await response.json();
                if (data.success && data.data.length > 0) {
                    // Map API fields to match the UI component's expected fields
                    const mappedData = data.data.map(c => ({
                        id: c.customer_id,
                        name: `${c.first_name} ${c.last_name || ''}`,
                        email: c.email,
                        phone: c.phone_number,
                        orders: 0,
                        spent: 0,
                        loan: c.loan_balance,
                        status: c.status_id === 1 ? 'Active' : 'Inactive',
                        avatar: `https://ui-avatars.com/api/?name=${c.first_name}+${c.last_name}&background=random`
                    }));
                    setCustomers(mappedData);
                } else {
                    // Fallback Demo Data
                    setCustomers([
                        {
                            id: 1,
                            name: 'Alex Morgan',
                            email: 'alex.m@example.com',
                            phone: '+1 (555) 123-4567',
                            orders: 12,
                            spent: 1240.50,
                            loan: 150.75,
                            status: 'Active',
                            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100'
                        },
                        {
                            id: 2,
                            name: 'Sarah Wilson',
                            email: 'sarah.w@example.com',
                            phone: '+1 (555) 987-6543',
                            orders: 5,
                            spent: 450.20,
                            loan: 0.00,
                            status: 'Active',
                            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
                        },
                        {
                            id: 3,
                            name: 'James Doe',
                            email: 'james.d@example.com',
                            phone: '+1 (555) 456-7890',
                            orders: 24,
                            spent: 3400.00,
                            loan: 1240.00,
                            status: 'Active',
                            avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100'
                        }
                    ]);
                }

            } catch (err) {
                console.error("Failed to fetch customers", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    const handleDelete = (id) => {
        if (!canDelete) return;
        if (window.confirm('Are you sure you want to delete this customer?')) {
            setCustomers(prev => prev.filter(c => c.id !== id));
            // Add API call here later
        }
    };

    return (
        <div className="p-2 max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Customers</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage customer relationships and loyalty.</p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-white border border-slate-200 rounded-lg p-1 flex">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                    <button
                        onClick={onAddCustomer}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/25"
                    >
                        <Plus className="w-4 h-4" /> Add Customer
                    </button>

                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search customers..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    />
                </div>
                <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    {['All Customers', 'VIP', 'New', 'Inactive'].map(filter => (
                        <button key={filter} className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 bg-white whitespace-nowrap transition-all">
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {customers.map(customer => (
                        <CustomerCard key={customer.id} customer={customer} onViewProfile={onViewProfile} onDelete={handleDelete} canDelete={canDelete} />
                    ))}
                    {customers.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                            <p className="text-slate-500 font-medium">No customers found.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                                <th className="py-4 px-6">Customer</th>
                                <th className="py-4 px-6">Contact</th>
                                <th className="py-4 px-6">Loan Balance</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {customers.map(customer => (
                                <tr key={customer.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <img src={customer.avatar} className="w-10 h-10 rounded-full object-cover" />
                                            <span className="font-medium text-slate-800">{customer.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-slate-500">
                                        <div className="flex flex-col">
                                            <span>{customer.email || 'N/A'}</span>
                                            <span className="text-xs opacity-70">{customer.phone}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm font-bold text-red-600">RS {parseFloat(customer.loan || 0).toFixed(2)}</td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${customer.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                                            {customer.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => onViewProfile(customer.id)}
                                                className="text-primary-600 hover:text-primary-700 font-bold text-sm"
                                            >
                                                View
                                            </button>
                                            {canDelete && (
                                                <button
                                                    onClick={() => handleDelete(customer.id)}
                                                    className="text-slate-300 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* ... rest of the table ... */}
                    {customers.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-slate-500 font-medium">No customers found.</p>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}
