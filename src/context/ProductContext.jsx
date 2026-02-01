import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../config/apiConfig';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState(() => {
        const saved = localStorage.getItem('pos_products');
        return saved ? JSON.parse(saved) : [];
    });

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(API_ROUTES.CATEGORIES.GET);
            if (response.data.success) {
                // Map backend fields to frontend fields if necessary
                const mappedCategories = response.data.data.map(cat => ({
                    id: cat.category_id.toString(),
                    name: cat.category_name,
                    description: cat.discription,
                    image: cat.image_code,
                    status: cat.status_id,
                    candidate_id: cat.candidate_id,
                    count: 0 // Backend doesn't provide count yet
                }));
                setCategories(mappedCategories);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        localStorage.setItem('pos_products', JSON.stringify(products));
    }, [products]);

    const addProduct = (product) => {
        const newProduct = {
            ...product,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
        };
        setProducts(prev => [newProduct, ...prev]);
        return newProduct;
    };

    const updateProduct = (id, updates) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const deleteProduct = (id) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    const addCategory = async (categoryData) => {
        try {
            const response = await axios.post(API_ROUTES.CATEGORIES.SAVE, categoryData);
            if (response.data.success) {
                await fetchCategories();
                return response.data.data;
            }
        } catch (error) {
            console.error("Error adding category:", error);
            throw error;
        }
    };

    const deleteCategory = async (id) => {
        try {
            const response = await axios.delete(API_ROUTES.CATEGORIES.DELETE(id));
            if (response.data.success) {
                await fetchCategories();
            }
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    const uploadCategoryImage = async (fileData) => {
        try {
            const response = await axios.post(API_ROUTES.CATEGORIES.UPLOAD_IMAGE, fileData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error uploading category image:", error);
            throw error;
        }
    };

    return (
        <ProductContext.Provider value={{
            products,
            categories,
            loading,
            addProduct,
            updateProduct,
            deleteProduct,
            addCategory,
            deleteCategory,
            uploadCategoryImage,
            refreshCategories: fetchCategories
        }}>
            {children}
        </ProductContext.Provider>
    );
};
