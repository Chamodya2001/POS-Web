import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(); // Create the context

export const useCart = () => { // Custom hook for easy access
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [discount, setDiscount] = useState(0);
    const [taxRate, setTaxRate] = useState(0.10); // 10% tax default

    // Load cart from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('pos_cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    // Save cart to local storage on change
    useEffect(() => {
        localStorage.setItem('pos_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId, delta) => {
        setCart((prevCart) => {
            return prevCart.map((item) => {
                if (item.id === productId) {
                    const newQuantity = Math.max(0, item.quantity + delta);
                    return { ...item, quantity: newQuantity }; // Allow 0 to stay, or filter out later if desired. Logic: if 0, maybe keep it but show transparent. Or just remove. Let's keep 0 but user can remove. Actually better to remove if 0.
                }
                return item;
            }).filter(item => item.quantity > 0);
        });
    };

    const updateItemDiscount = (productId, newDiscount) => {
        setCart((prevCart) => {
            return prevCart.map((item) => {
                if (item.id === productId) {
                    return { ...item, discount: Math.max(0, parseFloat(newDiscount) || 0) };
                }
                return item;
            });
        });
    };

    const clearCart = () => {
        setCart([]);
        setDiscount(0);
    };

    const calculateTotal = () => {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const discount = cart.reduce((discount, item) => discount + ((item.discount || 0) * item.quantity), 0);
        // const tax = subtotal * taxRate;
        const total = subtotal - discount;
        return {
            subtotal,
            // tax,
            discount,
            total: Math.max(0, total)
        };
    };

    const value = {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateItemDiscount,
        clearCart,
        calculateTotal,
        discount,
        setDiscount,
        // taxRate
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
