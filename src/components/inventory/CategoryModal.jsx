import React, { useState, useRef } from 'react';
import { Tag, Plus, X, Image as ImageIcon } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import clsx from 'clsx';

const CategoryModal = ({ isOpen, onClose, onCategoryCreated }) => {
    const { addCategory, uploadCategoryImage } = useProducts();
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        category_name: '',
        discription: '',
        image_code: '',
        candidate_id: 17,
        status_id: 1
    });

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const data = new FormData();
            data.append('image', file);

            const response = await uploadCategoryImage(data);
            if (response.success) {
                setFormData(prev => ({ ...prev, image_code: response.data.image_code }));
            }
        } catch (error) {
            alert("Upload failed: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        try {
            const cat = await addCategory(formData);
            if (cat) {
                if (onCategoryCreated) onCategoryCreated(cat);
                setFormData({
                    category_name: '',
                    discription: '',
                    image_code: '',
                    candidate_id: 17,
                    status_id: 1
                });
                onClose();
            }
        } catch (error) {
            alert('Failed to add category: ' + error.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/10 text-primary-600 rounded-xl flex items-center justify-center">
                                <Tag className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">New Category</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Fill in the details for the new product category.</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Category Name</label>
                                <input
                                    required
                                    value={formData.category_name}
                                    onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                                    placeholder="e.g. Fruits"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-4 focus:ring-primary-500/10 outline-none transition-all dark:text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Image Upload</label>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all flex items-center justify-between"
                                >
                                    <span className="text-slate-500 dark:text-slate-400 truncate">
                                        {uploading ? 'Uploading...' : (formData.image_code || 'Select an image')}
                                    </span>
                                    <ImageIcon className="w-4 h-4 text-slate-400" />
                                </div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                <textarea
                                    value={formData.discription}
                                    onChange={(e) => setFormData({ ...formData, discription: e.target.value })}
                                    placeholder="Describe this category..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-4 focus:ring-primary-500/10 outline-none transition-all dark:text-white resize-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Candidate ID</label>
                                <input
                                    type="number"
                                    value={formData.candidate_id}
                                    onChange={(e) => setFormData({ ...formData, candidate_id: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-4 focus:ring-primary-500/10 outline-none transition-all dark:text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Status ID</label>
                                <select
                                    value={formData.status_id}
                                    onChange={(e) => setFormData({ ...formData, status_id: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-4 focus:ring-primary-500/10 outline-none transition-all dark:text-white"
                                >
                                    <option value={1}>Active</option>
                                    <option value={0}>Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={uploading}
                                className="flex-1 px-6 py-3.5 bg-primary-600 text-white rounded-xl font-bold shadow-xl shadow-primary-500/20 hover:bg-primary-500 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {uploading ? 'Processing...' : 'Create Category'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CategoryModal;
