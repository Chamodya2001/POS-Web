import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext";
import AddProductPage from "./AddProductPage";
import clsx from "clsx";

export default function ProductsPage({ initialCategoryId, onClearFilter }) {
  const {
    products,
    deleteProduct,
    categories,
    setProducts,
    measurements,
    updateProduct,
  } = useProducts();
  const { user } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState(
    initialCategoryId || "all",
  );
  const [isEditProduct, setIsEditProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updatedProductData, setUpdatedProductData] = useState({});
  const [originalProductData, setOriginalProductData] = useState({});
  const fileInputRef = useRef(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  useEffect(() => {
    if (initialCategoryId) {
      setFilterCategory(initialCategoryId);
    }
  }, [initialCategoryId]);

  // Populate form data when edit modal opens
  useEffect(() => {
    if (isEditProduct && selectedProduct) {
      const product = products.find((p) => p.id === selectedProduct);
      if (product) {
        console.log("Editing product:", product);
        setOriginalProductData(product);
        setUpdatedProductData({});
        setEditImagePreview(product.image || null);
      }
    }
  }, [isEditProduct, selectedProduct, products]);

  const handleUpdate = (e) => {
    const { name, value } = e.target;
    setUpdatedProductData((prev) => ({ ...prev, [name]: value }));
  };

  if (isAdding) {
    return <AddProductPage onBack={() => setIsAdding(false)} />;
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      (product.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.sku || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    const aStock = a.stock || 0;
    const bStock = b.stock || 0;
    
    // Items with stock > 0 come first
    if (aStock > 0 && bStock <= 0) return -1;
    if (aStock <= 0 && bStock > 0) return 1;
    
    // Maintain secondary order (could be name or default)
    return 0;
  });

  return (
    <div className="h-full flex flex-col animate-in fade-in zoom-in-95 duration-300">
      {/* Header / Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Products
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage your product inventory
          </p>
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
            onChange={(e) => {
              setFilterCategory(e.target.value);
              if (onClearFilter) onClearFilter();
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:text-white shadow-sm appearance-none"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                            IMG
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white">
                          {product.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                          {product.description || "No description"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 capitalize">
                      {product.category || "Uncategorized"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-mono">
                    {product.sku || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={clsx(
                          "font-medium",
                          product.stock <= 5
                            ? "text-red-600 dark:text-red-400"
                            : "text-slate-700 dark:text-slate-300",
                        )}
                      >
                        {product.stock || 0}
                      </span>
                      {product.stock <= 5 && (
                        <span
                          className="w-2 h-2 rounded-full bg-red-500 animate-pulse"
                          title="Low Stock"
                        ></span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800 dark:text-white">
                    RS {parseFloat(product.price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={clsx(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
                        product.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
                      )}
                    >
                      {product.status || "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedProduct(product.id);
                          setIsEditProduct(true);
                        }}
                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {user?.role !== "admin" && (
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
                  >
                    No products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Product Modal */}
      {isEditProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300 ">
            <div className="p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/10 text-primary-600 rounded-xl flex items-center justify-center">
                    <Edit className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Edit Product
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      Modify the details of your product.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditProduct(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsEditProduct(false);
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                      PRODUCT NAME
                    </label>
                    <input
                      required
                      value={
                        updatedProductData.name !== undefined
                          ? updatedProductData.name
                          : originalProductData.name || ""
                      }
                      name="name"
                      onChange={handleUpdate}
                      className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:text-white shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                      IMAGE UPLOAD
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const dataUrl = event.target.result;
                            setEditImagePreview(dataUrl);
                            // store preview/data in updatedProductData so it can be sent later
                            setUpdatedProductData((prev) => ({ ...prev, image_code: dataUrl }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />

                    {editImagePreview ? (
                      <div className="mb-2 w-full flex items-center justify-center">
                        <img
                          src={editImagePreview}
                          alt="preview"
                          className="w-28 h-28 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                        />
                      </div>
                    ) : null}

                    <button
                      type="button"
                      className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    >
                      Upload Image
                    </button>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                      DESCRIPTION
                    </label>
                    <textarea
                      value={
                        updatedProductData.description !== undefined
                          ? updatedProductData.description
                          : originalProductData.description || ""
                      }
                      name="description"
                      onChange={handleUpdate}
                      placeholder="Describe this product..."
                      rows={3}
                      className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/50 outline-none transition-all dark:text-white resize-none"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                      CATEGORY
                    </label>
                    <select
                      value={
                        updatedProductData.category !== undefined
                          ? String(updatedProductData.category)
                          : categories.find(
                              (cat) =>
                                cat.id === originalProductData.category,
                            )?.id || "all"
                      }
                      name="category_id"
                      onChange={handleUpdate}
                      className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:text-white shadow-sm appearance-none"
                    >
                      <option value="">Select category</option>
                      {categories
                        .filter((c) => c.id !== "all")
                        .map((cat) => (
                          <option key={cat.id} value={String(cat.id)}>
                            {cat.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                      BASE PRICE
                    </label>
                    <input
                      type="number"
                      value={
                        updatedProductData.price !== undefined
                          ? updatedProductData.price
                          : originalProductData.price || ""
                      }
                      name="price"
                      onChange={handleUpdate}
                      className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:text-white shadow-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                      COST PRICE
                    </label>
                    <input
                      type="number"
                      value={
                        updatedProductData.cost_price !== undefined
                          ? updatedProductData.cost_price
                          : originalProductData.cost_price || ""
                      }
                      name="cost_price"
                      onChange={handleUpdate}
                      className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:text-white shadow-sm"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                      DISCOUNT
                    </label>
                    <input
                      type="number"
                      value={
                        updatedProductData.discount !== undefined
                          ? updatedProductData.discount
                          : originalProductData.discount || ""
                      }
                      name="discount"
                      onChange={handleUpdate}
                      className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:text-white shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                      SKU
                    </label>
                    <input
                      value={
                        updatedProductData.sku !== undefined
                          ? updatedProductData.sku
                          : originalProductData.sku || ""
                      }
                      name="sku"
                      onChange={handleUpdate}
                      className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:text-white shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                      STATUS
                    </label>
                    <select
                      value={
                        updatedProductData.status !== undefined
                          ? updatedProductData.status
                          : originalProductData.status || ""
                      }
                      name="status"
                      onChange={handleUpdate}
                      className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:text-white shadow-sm appearance-none"
                    >
                      <option value="active">Active</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                  </div>

                  {/* <div className='space-y-2'>
                                        <label className='text-xs font-bold text-slate-400 uppercase tracking-widest ml-1'>CURRENT STOCK</label>
                                        <input
                                            type='number'
                                            value={updatedProductData.stock !== undefined ? updatedProductData.stock : (originalProductData.stock || '')}
                                            name="stock"
                                            onChange={handleUpdate}
                                            className='w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:text-white shadow-sm'
                                        />

                                    </div> */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                      LOW STOCK ALERT
                    </label>
                    <input
                      type="number"
                      value={
                        updatedProductData.low_stock_alert !== undefined
                          ? updatedProductData.low_stock_alert
                          : originalProductData.low_stock_alert || ""
                      }
                      name="low_stock_alert"
                      onChange={handleUpdate}
                      className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:text-white shadow-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                      BARCODE
                    </label>
                    <input
                      value={
                        updatedProductData.bar_code !== undefined
                          ? updatedProductData.bar_code
                          : originalProductData.bar_code || ""
                      }
                      name="bar_code"
                      onChange={handleUpdate}
                      className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:text-white shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                      UNIT OF MEASUREMENT
                    </label>

                    <select
                      name="measurement_id"
                      value={
                        updatedProductData.measurement_id !== undefined
                          ? String(updatedProductData.measurement_id)
                          : originalProductData.measurement_id
                            ? String(originalProductData.measurement_id)
                            : ""
                      }
                      onChange={handleUpdate}
                      className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:text-white shadow-sm"
                    >
                      <option value="">Select Measurement</option>

                      {Object.entries(measurements).map(([key, value]) => (
                        <option key={key} value={String(key)}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-4 pt-4 md:col-span-2">
                    <button
                      type="button"
                      onClick={() => setIsEditProduct(false)}
                      className="flex-1 px-6 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      onClick={() => {
                        // Only send changed fields merged with original data
                        const dataToSend = {
                          ...originalProductData,
                          ...updatedProductData,
                        };
                        updateProduct(selectedProduct, dataToSend);
                        setIsEditProduct(false);
                        setUpdatedProductData({});
                        setOriginalProductData({});
                      }}
                      className="flex-1 px-6 py-3.5 bg-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all active:scale-95"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
