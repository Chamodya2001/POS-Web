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
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [taxRate, setTaxRate] = useState(0.10); // 10% tax default

    // Load cart and selected customer from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('pos_cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
        const savedCustomer = localStorage.getItem('pos_selected_customer');
        if (savedCustomer) {
            try {
                setSelectedCustomer(JSON.parse(savedCustomer));
            } catch (e) {
                console.error("Failed to parse selected customer", e);
            }
        }
    }, []);

    // Save cart to local storage on change
    useEffect(() => {
        localStorage.setItem('pos_cart', JSON.stringify(cart));
    }, [cart]);

    // Save selected customer to local storage on change
    useEffect(() => {
        if (selectedCustomer) {
            localStorage.setItem('pos_selected_customer', JSON.stringify(selectedCustomer));
        } else {
            localStorage.removeItem('pos_selected_customer');
        }
    }, [selectedCustomer]);

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
                return [...prevCart, { ...product, quantity: 1, price: parseFloat(product.price) }];
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
                    return { ...item, quantity: newQuantity };
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
        setSelectedCustomer(null);
    };

    const calculateTotal = () => {
        const subtotal = cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
        const itemDiscounts = cart.reduce((discount, item) => discount + ((parseFloat(item.discount) || 0) * item.quantity), 0);
        const tax = (subtotal - itemDiscounts) * taxRate;
        const currentTotal = subtotal - itemDiscounts + tax;
        const previousBalance = selectedCustomer ? parseFloat(selectedCustomer.loan_balance || 0) : 0;

        return {
            subtotal,
            tax,
            discount: itemDiscounts,
            total: Math.max(0, currentTotal),
            previousBalance,
            finalTotal: Math.max(0, currentTotal + previousBalance)
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
        selectedCustomer,
        setSelectedCustomer
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
