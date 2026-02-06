import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, CreditCard, Banknote, Landmark, Printer, CheckCircle, User, Search, X, Check, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { API_ROUTES } from '../../config/apiConfig';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const CustomerSelector = ({ selectedCustomer, onSelect, customers }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone?.includes(searchQuery)
    );

    return (
        <div className="relative mb-4">
            {!selectedCustomer ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-full flex items-center justify-between p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-slate-500 hover:bg-slate-100 hover:border-slate-400 transition-all group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center group-hover:bg-slate-300 transition-colors">
                            <User className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">Select Customer (Optional)</span>
                    </div>
                    <Plus className="w-4 h-4" />
                </button>
            ) : (
                <div className="flex items-center justify-between p-3 bg-primary-50 border border-primary-100 rounded-xl group animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border-2 border-primary-200 overflow-hidden bg-white">
                            <img src={selectedCustomer.avatar} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-800">{selectedCustomer.name}</h4>
                            <p className="text-[10px] text-primary-600 font-medium">Loan: RS {selectedCustomer.loan.toFixed(2)}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => onSelect(null)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[50]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute top-0 left-0 w-full bg-white rounded-2xl shadow-2xl border border-slate-200 z-[51] overflow-hidden"
                        >
                            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Search by name or phone..."
                                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="max-h-60 overflow-y-auto p-2 custom-scrollbar">
                                {filteredCustomers.length > 0 ? (
                                    filteredCustomers.map(customer => (
                                        <button
                                            key={customer.id}
                                            onClick={() => {
                                                onSelect(customer);
                                                setIsOpen(false);
                                                setSearchQuery('');
                                            }}
                                            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <img src={customer.avatar} className="w-8 h-8 rounded-full border border-slate-100" />
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800">{customer.name}</p>
                                                    <p className="text-[11px] text-slate-500">{customer.phone}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[11px] font-bold text-red-600">Loan: RS {customer.loan.toFixed(2)}</p>
                                                <ChevronRight className="w-3 h-3 text-slate-300 ml-auto mt-1" />
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-slate-400 flex flex-col items-center">
                                        <Search className="w-8 h-8 mb-2 opacity-20" />
                                        <p className="text-xs">No customers found</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

const CartPanel = () => {
    const { cart, updateQuantity, updateItemDiscount, calculateTotal, clearCart } = useCart();
    const { subtotal, discount, total } = calculateTotal();
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await fetch(API_ROUTES.CUSTOMERS.GET);
                const data = await response.json();
                if (data.success && data.data.length > 0) {
                    const mappedData = data.data.map(c => ({
                        id: c.customer_id,
                        name: `${c.first_name} ${c.last_name || ''}`,
                        phone: c.phone_number,
                        loan: parseFloat(c.loan_balance || 0),
                        avatar: `https://ui-avatars.com/api/?name=${c.first_name}+${c.last_name}&background=random`
                    }));
                    setCustomers(mappedData);
                } else {
                    setCustomers([
                        { id: 1, name: 'Alex Morgan', phone: '0771234567', loan: 1500.00, avatar: 'https://ui-avatars.com/api/?name=Alex+Morgan&background=random' },
                        { id: 2, name: 'Sarah Wilson', phone: '0779876543', loan: 0.00, avatar: 'https://ui-avatars.com/api/?name=Sarah+Wilson&background=random' },
                        { id: 3, name: 'James Doe', phone: '0774567890', loan: 3400.00, avatar: 'https://ui-avatars.com/api/?name=James+Doe&background=random' }
                    ]);
                }
            } catch (err) {
                console.error("Failed to fetch customers", err);
                setCustomers([
                    { id: 1, name: 'Alex Morgan', phone: '0771234567', loan: 1500.00, avatar: 'https://ui-avatars.com/api/?name=Alex+Morgan&background=random' },
                    { id: 2, name: 'Sarah Wilson', phone: '0779876543', loan: 0.00, avatar: 'https://ui-avatars.com/api/?name=Sarah+Wilson&background=random' },
                    { id: 3, name: 'James Doe', phone: '0774567890', loan: 3400.00, avatar: 'https://ui-avatars.com/api/?name=James+Doe&background=random' }
                ]);
            }
        };
        fetchCustomers();
    }, []);

    const loanBalance = selectedCustomer?.loan || 0;
    const finalTotal = total + loanBalance;

    return (
        <div className="flex flex-col h-full bg-white rounded-l-2xl border-l border-slate-200 shadow-2xl relative z-30 overflow-hidden text-slate-800">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h2 className="font-bold text-xl text-slate-800">Current Order</h2>
                    <p className="text-xs text-slate-500 mt-1">Transaction ID: #{Math.floor(100000 + Math.random() * 900000)}</p>
                </div>
                <button
                    onClick={() => {
                        clearCart();
                        setSelectedCustomer(null);
                    }}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Clear Cart"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <CustomerSelector
                    selectedCustomer={selectedCustomer}
                    onSelect={setSelectedCustomer}
                    customers={customers}
                />

                <div className="space-y-3">
                    {cart.length === 0 ? (
                        <div className="py-20 flex flex-col items-center justify-center text-slate-400 opacity-60">
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
                                    className="p-3 bg-slate-50 rounded-xl border border-slate-100 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-14 h-14 bg-white rounded-lg overflow-hidden border border-slate-200 shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-slate-800 text-sm truncate">{item.name}</h4>
                                            <p className="text-xs text-primary-600 font-bold mt-0.5">RS {item.price.toFixed(2)}</p>
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
                                    </div>

                                    {/* Item-wise Discount Section */}
                                    <div className="mt-3 flex items-center justify-between border-t border-slate-200/50 pt-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Disc (RS)</span>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={item.discount || ''}
                                                    onChange={(e) => updateItemDiscount(item.id, e.target.value)}
                                                    placeholder="0"
                                                    className="w-16 px-2 py-1 bg-white border border-slate-200 rounded text-[11px] font-bold text-green-600 focus:outline-none focus:ring-1 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-slate-400 font-medium">Item Total</p>
                                            <p className="text-xs font-bold text-slate-800">
                                                RS {((item.price - (item.discount || 0)) * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </div>

            <div className="p-6 bg-white border-t border-slate-200 shadow-[0_-5px_20px_rgba(0,0,0,0.02)] z-10">
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm text-slate-600 font-medium tracking-tight">
                        <span>Items Subtotal (Real Price)</span>
                        <span className="text-slate-900">RS {subtotal.toFixed(2)}</span>
                    </div>

                    {discount > 0 && (
                        <div className="flex justify-between text-sm text-green-600 font-bold bg-green-50/50 px-3 py-2 rounded-xl border border-green-100/50">
                            <span className="flex items-center gap-2">Total Discount</span>
                            <span>- RS {discount.toFixed(2)}</span>
                        </div>
                    )}

                    {selectedCustomer && (
                        <div className="flex justify-between text-sm text-red-600 font-bold bg-red-50 p-3 rounded-xl border border-red-100 animate-in fade-in slide-in-from-right-4">
                            <span className="flex items-center gap-2">
                                <Landmark className="w-4 h-4" /> Previous Loan Balance
                            </span>
                            <span>+ RS {loanBalance.toFixed(2)}</span>
                        </div>
                    )}

                    <div className="flex justify-between text-xl font-black text-slate-900 pt-4 border-t-2 border-slate-100 border-dashed">
                        <span>Grand Total</span>
                        <div className="text-right">
                            <span className="text-primary-600">RS {finalTotal.toFixed(2)}</span>
                        </div>
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
                total={finalTotal}
                customer={selectedCustomer}
                onComplete={() => {
                    setIsCheckoutOpen(false);
                    clearCart();
                    setSelectedCustomer(null);
                }}
            />
        </div>
    );
};

const CheckoutModal = ({ isOpen, onClose, total, customer, onComplete }) => {
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [cashPaymentType, setCashPaymentType] = useState('full'); // 'full' or 'partial'
    const [amountPaid, setAmountPaid] = useState(total);

    useEffect(() => {
        setAmountPaid(total);
        setCashPaymentType('full');
    }, [total, paymentMethod]);

    if (!isOpen) return null;

    const remainingToLoan = Math.max(0, total - (parseFloat(amountPaid) || 0));

    const handlePayment = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);

            if (paymentMethod === 'card') {
                alert(`Card payment of RS ${total.toFixed(2)} successful!`);
            } else if (paymentMethod === 'cash') {
                if (cashPaymentType === 'partial') {
                    alert(`Partial Cash payment of RS ${(parseFloat(amountPaid) || 0).toFixed(2)} successful! RS ${remainingToLoan.toFixed(2)} added to ${customer?.name}'s loan.`);
                } else {
                    alert(`Full Cash payment of RS ${total.toFixed(2)} successful!`);
                }
            } else if (paymentMethod === 'loan') {
                alert(`RS ${total.toFixed(2)} marked as on loan for ${customer?.name}!`);
            }

            onComplete();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800">Payment</h2>
                    <p className="text-sm text-slate-500">
                        {customer ? `Settling balance for ${customer.name}` : 'Select payment method'}
                    </p>
                </div>

                <div className="p-6 space-y-6">
                    <div className="text-center py-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-inner">
                        <p className="text-slate-400 text-xs mb-1 uppercase tracking-widest font-semibold">Amount to Pay</p>
                        <p className="text-4xl font-black text-white">RS {total.toFixed(2)}</p>
                        {customer && customer.loan > 0 && (
                            <p className="text-[10px] text-primary-400 mt-2 font-medium">Includes RS {customer.loan.toFixed(2)} loan settlement</p>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { id: 'card', label: 'Card', icon: CreditCard },
                            { id: 'cash', label: 'Cash', icon: Banknote },
                            { id: 'loan', label: 'Add to Loan', icon: Landmark, disabled: !customer },
                        ].map((method) => (
                            <button
                                key={method.id}
                                disabled={method.disabled}
                                onClick={() => setPaymentMethod(method.id)}
                                className={clsx(
                                    "flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200",
                                    method.disabled ? "opacity-30 cursor-not-allowed bg-slate-50 border-slate-100" :
                                        paymentMethod === method.id
                                            ? "bg-primary-600 text-white border-primary-600 shadow-lg scale-[1.02]"
                                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                )}
                            >
                                <method.icon className="w-6 h-6 mb-2" />
                                <span className="text-[10px] font-bold uppercase">{method.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Cash Payment Details - Only if Cash selected and Customer exists */}
                    {paymentMethod === 'cash' && customer && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4"
                        >
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setCashPaymentType('full');
                                        setAmountPaid(total);
                                    }}
                                    className={clsx(
                                        "flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all",
                                        cashPaymentType === 'full'
                                            ? "bg-white text-primary-600 shadow-sm border border-primary-100"
                                            : "text-slate-500 border border-transparent hover:bg-slate-100"
                                    )}
                                >
                                    Full Payment
                                </button>
                                <button
                                    onClick={() => setCashPaymentType('partial')}
                                    className={clsx(
                                        "flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all",
                                        cashPaymentType === 'partial'
                                            ? "bg-white text-primary-600 shadow-sm border border-primary-100"
                                            : "text-slate-500 border border-transparent hover:bg-slate-100"
                                    )}
                                >
                                    Partial Payment
                                </button>
                            </div>

                            {cashPaymentType === 'partial' && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Cash Amount Paid</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">RS</span>
                                            <input
                                                type="number"
                                                value={amountPaid}
                                                onChange={(e) => setAmountPaid(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center p-2 bg-red-50 rounded-lg border border-red-100">
                                        <span className="text-[10px] font-bold text-red-600 uppercase">Remaining to Loan</span>
                                        <span className="text-sm font-black text-red-700">RS {remainingToLoan.toFixed(2)}</span>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                    <button
                        onClick={handlePayment}
                        disabled={isProcessing || (paymentMethod === 'cash' && cashPaymentType === 'partial' && (!amountPaid || amountPaid <= 0))}
                        className="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-xl font-bold text-lg shadow-lg shadow-primary-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        {isProcessing ? (
                            <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                Complete Payment <CheckCircle className="w-5 h-5" />
                            </>
                        )}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={isProcessing}
                        className="w-full mt-3 py-3 text-slate-400 hover:text-slate-600 font-medium text-sm text-center transition-colors"
                    >
                        Cancel Transaction
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPanel;
