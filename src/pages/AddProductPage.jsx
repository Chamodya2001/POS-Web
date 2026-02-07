import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Upload, Save, X, Info, Banknote, Package, Tag, Barcode, Layers, Image as ImageIcon, Plus } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useTheme } from '../context/ThemeContext';
import clsx from 'clsx';
import { AddProductPage_service } from "../pages/service/AddProductPage_service";
import config from '../helper/config';



import CategoryModal from '../components/inventory/CategoryModal';

export default function AddProductPage({ onBack }) {
    const { categories } = useProducts();

    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        cost: '',
        discount: '',
        sku: '',
        barcode: '',
        stock: '',
        lowStockThreshold: '',
        category: '',
        status: 'active',
        image_code: '',
        image: '',
        taxRate: '',
        tags: ''
    });

    const [showCategoryModal, setShowCategoryModal] = useState(false);

    // Derived values
    const netPrice = parseFloat(formData.price || 0) - parseFloat(formData.discount || 0);
    const profit = (netPrice - parseFloat(formData.cost || 0)).toFixed(2);
    const margin = netPrice > 0 ? ((profit / netPrice) * 100).toFixed(1) : 0;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            if (!formData.category) {
                alert("Please select a category");
                return;
            }

            setLoading(true);

            const payload = {
                candidate_id: 4, // later from auth
                category_id: parseInt(formData.category),
                item_name: formData.name,
                short_code: formData.sku,
                bar_code: formData.barcode,
                sale_price: Number(formData.price),
                stoke_price: Number(formData.cost),
                stoke_quantity: Number(formData.stock),
                current_quantity: Number(formData.stock),
                discount: Number(formData.discount),
                image_code: formData.image_code,
                status_id: formData.status === "active" ? 1 : 2
            };

            const response = await AddProductPage_service.addProduct(payload);

            console.log("API response:", response);

            alert("Product saved successfully");
            onBack();

        } catch (error) {
            console.error("Save failed:", error);
            alert(error.message || "Failed to save product");
        } finally {
            setLoading(false);
        }
    };

    const generateSKU = () => {
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        setFormData(prev => ({ ...prev, sku: `SKU-${random}` }));
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append('image', file); // key MUST be "image"

            const res = await AddProductPage_service.uploadItemImage(formData);
            console.log("kcd", res)
            setFormData(prev => ({ ...prev, image_code: res, image: `${config.pos_api_url}/static/images/products/${res}` }));
        } catch (err) {
            console.error("Image upload failed:", err);
            alert("Image upload failed");
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto pb-20 animate-in fade-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Add New Product</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Create a new item in your inventory</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onBack}
                        className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 active:scale-95 transition-all flex items-center gap-2"
                    >
                        {loading ? 'Saving...' : <><Save className="w-4 h-4" /> Save Product</>}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* General Information */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                            <Info className="w-5 h-5 text-primary-500" /> General Information
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Product Name</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Premium Leather Jacket"
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Enter detailed product description..."
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:text-white resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                            <Banknote className="w-5 h-5 text-green-500" /> Pricing & Costs
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Base Price (RS)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cost Price (RS)</label>
                                <input
                                    type="number"
                                    name="cost"
                                    value={formData.cost}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Discount (RS)</label>
                                <input
                                    type="number"
                                    name="discount"
                                    value={formData.discount}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:text-white"
                                />
                            </div>
                        </div>

                        {(formData.price || formData.cost) && (
                            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm">
                                <div>
                                    <span className="text-slate-500 dark:text-slate-400">Profit per item:</span>
                                    <span className={clsx("ml-2 font-bold", profit >= 0 ? "text-green-600" : "text-red-500")}>RS {profit}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500 dark:text-slate-400">Margin:</span>
                                    <span className={clsx("ml-2 font-bold", margin >= 0 ? "text-green-600" : "text-red-500")}>{margin}%</span>
                                </div>
                            </div>
                        )}

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tax Rate (%)</label>
                            <input
                                type="number"
                                name="taxRate"
                                value={formData.taxRate}
                                onChange={handleChange}
                                placeholder="0"
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Inventory */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5 text-purple-500" /> Inventory Configuration
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">SKU</label>
                                <div className="flex gap-2">
                                    <input
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleChange}
                                        placeholder="Product SKU"
                                        className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:text-white"
                                    />
                                    <button onClick={generateSKU} className="px-3 text-slate-500 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold">Generate</button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Barcode / ISBN</label>
                                <div className="relative">
                                    <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        name="barcode"
                                        value={formData.barcode}
                                        onChange={handleChange}
                                        placeholder="Scan or enter barcode"
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Stock</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Low Stock Alert</label>
                                <input
                                    type="number"
                                    name="lowStockThreshold"
                                    value={formData.lowStockThreshold}
                                    onChange={handleChange}
                                    placeholder="5"
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Sidebar Details */}
                <div className="space-y-6">
                    {/* Media */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-blue-500" /> Product Image
                        </h3>

                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />

                        <div
                            className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                            onClick={handleClick}
                        >
                            {formData.image ? (
                                <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                                    <img
                                        src={formData.image}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFormData(prev => ({ ...prev, image: '' }));
                                        }}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3">
                                        <Upload className="w-6 h-6" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Click to upload image
                                    </p>
                                    <p className="text-xs text-slate-500">SVG, PNG, JPG or GIF</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Organization */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                            <Layers className="w-5 h-5 text-orange-500" /> Organization
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:text-white"
                                >
                                    <option value="active">Active</option>
                                    <option value="draft">Draft</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                                <div className="flex gap-2">
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:text-white"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => setShowCategoryModal(true)}
                                        className="px-4 py-2 bg-primary-50 dark:bg-primary-900/10 text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl transition-all flex items-center gap-2 text-sm font-bold whitespace-nowrap"
                                    >
                                        <Plus className="w-4 h-4" /> New
                                    </button>
                                </div>
                            </div>

                            {/* <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tags</label>
                                <input
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleChange}
                                    placeholder="Separate with commas"
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:text-white"
                                />
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Reusable Category Modal */}
            <CategoryModal
                isOpen={showCategoryModal}
                onClose={() => setShowCategoryModal(false)}
                onCategoryCreated={(cat) => setFormData(prev => ({ ...prev, category: cat.id.toString() }))}
            />
        </div>
    );
}
