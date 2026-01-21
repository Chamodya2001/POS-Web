import React, { useState } from 'react';
import { Trash2, Plus, Minus, CreditCard, Banknote, Landmark, Printer, CheckCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const CheckoutModal = ({ isOpen, onClose, total, onComplete }) => {
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen) return null;

    const handlePayment = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            onComplete();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800">Payment</h2>
                    <p className="text-sm text-slate-500">Select payment method for order #12345</p>
                </div>

                <div className="p-6 space-y-6">
                    <div className="text-center py-4 bg-primary-50 rounded-xl border border-primary-100 border-dashed">
                        <p className="text-slate-500 text-sm mb-1">Total Amount</p>
                        <p className="text-4xl font-bold text-primary-600">${total.toFixed(2)}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { id: 'card', label: 'Card', icon: CreditCard },
                            { id: 'cash', label: 'Cash', icon: Banknote },
                            { id: 'wallet', label: 'E-Wallet', icon: Landmark },
                        ].map((method) => (
                            <button
                                key={method.id}
                                onClick={() => setPaymentMethod(method.id)}
                                className={clsx(
                                    "flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200",
                                    paymentMethod === method.id
                                        ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                )}
                            >
                                <method.icon className="w-6 h-6 mb-2" />
                                <span className="text-xs font-medium">{method.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50">
                    <button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-primary-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        {isProcessing ? (
                            <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                Confirm Payment <CheckCircle className="w-5 h-5" />
                            </>
                        )}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={isProcessing}
                        className="w-full mt-3 py-3 text-slate-500 hover:text-slate-800 font-medium text-sm text-center"
                    >
                        Cancel Transaction
                    </button>
                </div>
            </div>
        </div>
    );
};

const CartPanel = () => {
    const { cart, removeFromCart, updateQuantity, calculateTotal, clearCart } = useCart();
    const { subtotal, tax, total } = calculateTotal();
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    return (
        <div className="flex flex-col h-full bg-white border-l border-slate-200 shadow-xl shadow-slate-200/50 relative z-30">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h2 className="font-bold text-xl text-slate-800">Current Order</h2>
                    <p className="text-xs text-slate-500 mt-1">Transaction ID: #883920</p>
                </div>
                <button
                    onClick={clearCart}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Clear Cart"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Printer className="w-10 h-10" />
                        </div>
                        <p className="font-medium">Cart is empty</p>
                        <p className="text-xs">Scan items or select from grid</p>
                    </div>
                ) : (
                    <AnimatePresence initial={false}>
                        {cart.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 group"
                            >
                                <div className="w-14 h-14 bg-white rounded-lg overflow-hidden border border-slate-200 shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-slate-800 text-sm truncate">{item.name}</h4>
                                    <p className="text-xs text-primary-600 font-bold mt-0.5">${item.price.toFixed(2)}</p>
                                </div>

                                <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
                                    <button
                                        onClick={() => updateQuantity(item.id, -1)}
                                        className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-600 transition-colors"
                                    >
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="w-6 text-center text-sm font-semibold text-slate-800">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, 1)}
                                        className="w-6 h-6 flex items-center justify-center rounded-md bg-slate-900 text-white shadow-sm hover:bg-slate-800 transition-colors"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            <div className="p-6 bg-white border-t border-slate-200 shadow-[0_-5px_20px_rgba(0,0,0,0.02)] z-10">
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm text-slate-600">
                        <span>Subtotal</span>
                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600">
                        <span>Tax (10%)</span>
                        <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-slate-900 pt-3 border-t border-slate-100">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>

                <button
                    onClick={() => setIsCheckoutOpen(true)}
                    disabled={cart.length === 0}
                    className="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg shadow-lg shadow-primary-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    Proceed to Payment
                </button>
            </div>

            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                total={total}
                onComplete={() => {
                    setIsCheckoutOpen(false);
                    clearCart();
                }}
            />
        </div>
    );
};

export default CartPanel;
