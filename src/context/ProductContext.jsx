import React, { createContext, useContext, useState, useEffect } from 'react';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

const INITIAL_CATEGORIES = [
    { id: 'fruits', name: 'Fruits & Veg', count: 12 },
    { id: 'dairy', name: 'Dairy & Eggs', count: 8 },
    { id: 'beverages', name: 'Beverages', count: 24 },
    { id: 'snacks', name: 'Snacks', count: 45 },
    { id: 'bakery', name: 'Bakery', count: 15 },
    { id: 'household', name: 'Household', count: 30 },
];

const INITIAL_PRODUCTS = [
    {
        id: '1',
        name: 'Fresh Organic Bananas',
        category: 'fruits',
        price: 1.99,
        cost: 1.20,
        stock: 150,
        sku: 'FRU-BAN-001',
        status: 'active',
        image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?q=80&w=200&auto=format&fit=crop'
    },
    {
        id: '2',
        name: 'Whole Grain Bread',
        category: 'bakery',
        price: 3.49,
        cost: 2.10,
        stock: 24,
        sku: 'BAK-BRD-012',
        status: 'active',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=200&auto=format&fit=crop'
    },
    {
        id: '3',
        name: 'Premium Espresso Beans',
        category: 'beverages',
        price: 14.99,
        cost: 8.50,
        stock: 5,
        sku: 'BEV-COF-099',
        status: 'active',
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=200&auto=format&fit=crop'
    },
    {
        id: '4',
        name: 'Organic Greek Yogurt',
        category: 'dairy',
        price: 4.99,
        cost: 3.00,
        stock: 42,
        sku: 'DAI-YOG-005',
        status: 'active',
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=200&auto=format&fit=crop'
    },
    {
        id: '5',
        name: 'Dark Chocolate Sea Salt',
        category: 'snacks',
        price: 2.99,
        cost: 1.50,
        stock: 85,
        sku: 'SNA-CHO-022',
        status: 'active',
        image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=200&auto=format&fit=crop'
    }
];

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState(() => {
        const saved = localStorage.getItem('pos_products');
        return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    });

    const [categories, setCategories] = useState(() => {
        const saved = localStorage.getItem('pos_categories');
        return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    });

    useEffect(() => {
        localStorage.setItem('pos_products', JSON.stringify(products));
    }, [products]);

    useEffect(() => {
        localStorage.setItem('pos_categories', JSON.stringify(categories));
    }, [categories]);

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

    const addCategory = (name) => {
        const newCategory = {
            id: name.toLowerCase().replace(/\s+/g, '-'),
            name,
            count: 0
        };
        setCategories(prev => [...prev, newCategory]);
        return newCategory;
    };

    return (
        <ProductContext.Provider value={{
            products,
            categories,
            addProduct,
            updateProduct,
            deleteProduct,
            addCategory
        }}>
            {children}
        </ProductContext.Provider>
    );
};
