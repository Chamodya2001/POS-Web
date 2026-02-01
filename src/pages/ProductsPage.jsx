import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, Edit, Trash2 } from 'lucide-react';
// import { useProducts } from '../context/ProductContext';
//import { Product_service } from '../context/service/Product_service';
import AddProductPage from './AddProductPage';
import clsx from 'clsx';
import { useCandidateData } from '../context/CandidateContext';

export default function ProductsPage() {
    const { candidateData, loading, error, updateCandidateData } = useCandidateData();
    console.log("Candidate Data in ProductsPage:", candidateData);

    // candidateData may contain different keys depending on API response; adjust as needed
    const products = candidateData?.items || candidateData?.products || candidateData?.productList || [];

    const handleDelete = async (id) => {
        try {
            await Product_service.deleteProduct(id);
            // update local candidate data to remove deleted product (optimistic update)
            updateCandidateData({
                ...candidateData,
                products: products.filter(p => p.id !== id)
            });
        } catch (err) {
            console.error('Failed to delete product', err);
            // optionally show user feedback here
        }
    };
    const [isAdding, setIsAdding] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');

    if (isAdding) {
        return <AddProductPage onBack={() => setIsAdding(false)} />;
    }

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.sku?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="h-full flex flex-col animate-in fade-in zoom-in-95 duration-300">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Products</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage your product inventory</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary-500/20 active:scale-95 transition-all"
                >
                    <Plus className="w-5 h-5" /> Add Product
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search products by name or SKU..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:text-white shadow-sm"
                    />
                </div>
                <div className="relative w-full md:w-48">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:text-white shadow-sm appearance-none"
                    >
                        <option value="all">All Categories</option>
                        {/* We could map actual categories here if we pulled them from context */}
                        <option value="fruits">Fruits & Veg</option>
                        <option value="dairy">Dairy</option>
                        <option value="bakery">Bakery</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">SKU</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700">
                                                {product.image ? (
                                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">IMG</div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-800 dark:text-white">{product.name}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{product.description || 'No description'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 capitalize">
                                            {product.category || 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-mono">
                                        {product.sku || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={clsx(
                                                "font-medium",
                                                product.stock <= 5 ? "text-red-600 dark:text-red-400" : "text-slate-700 dark:text-slate-300"
                                            )}>
                                                {product.stock || 0}
                                            </span>
                                            {product.stock <= 5 && (
                                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Low Stock"></span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-800 dark:text-white">
                                        ${parseFloat(product.price).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={clsx(
                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
                                            product.status === 'active'
                                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                                        )}>
                                            {product.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                        No products found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
