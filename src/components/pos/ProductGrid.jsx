import React, { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import clsx from 'clsx';
import { useProducts } from '../../context/ProductContext';


const ProductGrid = () => {
   
        const {
    candidateAllData,
    products: MOCK_PRODUCTS,
    categories: CATEGORIES,
    loading,
    } = useProducts();



    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const { addToCart } = useCart();

    const filteredProducts = MOCK_PRODUCTS.filter((product) => {
        const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="flex flex-col h-full bg-slate-50/50">
            {/* Filters & Search */}
            <div className="mb-6 space-y-4">
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
                    {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={clsx(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border",
                        activeCategory === cat.id
                            ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        )}
                    >
                        {/* Category name */}
                        <span>{cat.name}</span>

                        {/* Count badge */}
                        <span
                        className={clsx(
                            "px-2 py-0.5 rounded-full text-xs font-semibold",
                            activeCategory === cat.id
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 text-slate-500"
                        )}
                        >
                        {cat.count}
                        </span>
                    </button>
                    ))}
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 shadow-sm transition-all"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 min-h-0 grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 overflow-y-auto pr-2 pb-20 custom-scrollbar">
                {filteredProducts.map((product) => (
                    <div
                        key={product.id}
                        onClick={() => addToCart(product)}
                        className="group bg-white rounded-2xl p-3 border border-slate-100 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 hover:-translate-y-1 active:scale-95 flex flex-col h-[240px]"
                    >
                        <div className="relative h-32 mb-3 rounded-xl overflow-hidden bg-slate-100">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <button className="absolute bottom-2 right-2 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm text-primary-600 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex flex-col flex-1">
                            <h3 className="font-semibold text-slate-800 text-sm line-clamp-2 leading-tight mb-1">{product.name}</h3>
                            <p className="text-xs text-slate-500 mb-auto">{product.stock} in stock</p>
                             <p className="text-xs text-slate-500 mb-auto">Discount RS.{product.discount} </p>
                             <p className="text-xs text-slate-500 mb-auto">Stoke price RS.{product.stoke_price} </p>

                            <div className="flex items-center justify-between mt-2">
                                <span className="font-bold text-lg text-primary-600">RS {product.price.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredProducts.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-10 text-slate-400">
                        <Filter className="w-12 h-12 mb-3 opacity-20" />
                        <p className="text-sm font-medium">No results found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductGrid;
