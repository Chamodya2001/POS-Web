import React, { useState } from 'react';
import { Trash2, Plus, Minus, CreditCard, Banknote, Printer, CheckCircle, User, Search, X, UserPlus, Wallet } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { API } from '../../services/appService';
import { printReceipt } from '../../utils/printReceipt';
import ReceiptPreviewModal from './ReceiptPreviewModal';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const CheckoutModal = ({ isOpen, onClose, orderTotal, previousBalance, cart, onComplete }) => {
    const [paymentMethod, setPaymentMethod] = useState('card');
    const { selectedCustomer } = useCart();
    const { user } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [cashPaymentType, setCashPaymentType] = useState('full'); // 'full' or 'partial'
    const grandTotal = orderTotal + previousBalance;
    const [cashPaidAmount, setCashPaidAmount] = useState(grandTotal);

    if (!isOpen) return null;

    const handlePayment = async () => {
        setIsProcessing(true);
        setError(null);

        try {
            const orderData = {
                candidate_id: user?.candidate_id || 1,
                casior_id: user?.casior_id || 1,
                customer_id: selectedCustomer ? selectedCustomer.customer_id : null,
                total_amount: orderTotal,
                payment_method: paymentMethod,
                status_id: 1, // Completed
                items: cart.map(item => ({
                    item_id: item.id,
                    item_name: item.name,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            const response = await API.saveOrder(orderData);

            if (response.success) {
                const orderId = response.data?.order_process_id || 'N/A';

                // Sync Loan Balance if a customer is selected
                if (selectedCustomer) {
                    let newBalance = grandTotal; // Default for 'loan' or 'card' where nothing/full is paid against the debt? 
                    // Wait: if it's 'card' or 'cash' (full), they paid the grandTotal, so newBalance is 0.
                    // If it's 'loan', they paid 0, so newBalance is grandTotal.
                    // If it's 'partial cash', they paid cashPaidAmount, so newBalance is grandTotal - cashPaidAmount.

                    if (paymentMethod === 'loan') {
                        newBalance = grandTotal;
                    } else if (paymentMethod === 'cash') {
                        if (cashPaymentType === 'full') {
                            newBalance = 0;
                        } else {
                            newBalance = grandTotal - (parseFloat(cashPaidAmount) || 0);
                        }
                    } else if (paymentMethod === 'card') {
                        // Assuming card covers the full grand total
                        newBalance = 0;
                    }

                    try {
                        await API.saveLoan({
                            candidate_id: user?.candidate_id || 1,
                            customer_id: selectedCustomer.customer_id,
                            loan_balance: Math.max(0, newBalance),
                            status_id: 1 // ACTIVE
                        });
                    } catch (loanErr) {
                        console.error("Failed to sync loan balance:", loanErr);
                        // We don't block completion if loan sync fails but log it
                    }
                }

                const refinedPaymentMethod = paymentMethod === 'cash' && cashPaymentType === 'partial' ? 'partial_cash' : paymentMethod;

                const receiptData = {
                    orderId: orderId,
                    items: orderData.items,
                    orderTotal: orderTotal,
                    previousBalance: previousBalance,
                    grandTotal: grandTotal,
                    cashPaidAmount: parseFloat(cashPaidAmount),
                    paymentMethod: refinedPaymentMethod,
                    user: user,
                    customer: selectedCustomer
                };

                onComplete({
                    paymentMethod: refinedPaymentMethod,
                    orderId: orderId,
                    receiptData: receiptData
                });
            } else {
                setError(response.message || "Failed to save order");
            }
        } catch (err) {
            setError("Failed to process payment. Please try again.");
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
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
                        <p className="text-slate-500 text-sm mb-1">Grand Total</p>
                        <p className="text-4xl font-bold text-primary-600">RS {grandTotal.toFixed(2)}</p>
                        {previousBalance > 0 && (
                            <p className="text-[10px] text-slate-400 mt-1 font-bold italic">
                                (Ordered: RS {orderTotal.toFixed(2)} + Prev: RS {previousBalance.toFixed(2)})
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { id: 'card', label: 'Card', icon: CreditCard },
                            { id: 'cash', label: 'Cash', icon: Banknote },
                            { id: 'loan', label: 'Loan', icon: Wallet },
                        ].map((method) => (
                            <button
                                key={method.id}
                                onClick={() => {
                                    setPaymentMethod(method.id);
                                    setError(null);
                                }}
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

                    {paymentMethod === 'cash' && (
                        <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                            <div className="flex p-1 bg-slate-100 rounded-xl">
                                <button
                                    onClick={() => {
                                        setCashPaymentType('full');
                                        setCashPaidAmount(grandTotal);
                                        setError(null);
                                    }}
                                    className={clsx(
                                        "flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all",
                                        cashPaymentType === 'full'
                                            ? "bg-white text-slate-800 shadow-sm"
                                            : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    Full Payment
                                </button>
                                <button
                                    onClick={() => {
                                        setCashPaymentType('partial');
                                        setError(null);
                                    }}
                                    className={clsx(
                                        "flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all",
                                        cashPaymentType === 'partial'
                                            ? "bg-white text-slate-800 shadow-sm"
                                            : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    Partial Payment
                                </button>
                            </div>

                            {cashPaymentType === 'partial' && (
                                <div className="space-y-3">
                                    <div className="relative">
                                        <p className="text-xs font-bold text-slate-500 mb-1.5 ml-1">Paid Amount (Cash)</p>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">RS</span>
                                            <input
                                                type="number"
                                                value={cashPaidAmount}
                                                onChange={(e) => setCashPaidAmount(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-bold text-lg"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-3 bg-primary-50 border border-primary-100 rounded-xl flex items-center justify-between">
                                        <span className="text-xs font-bold text-primary-600 uppercase">Balance to Loan</span>
                                        <span className="font-black text-primary-700">RS {(grandTotal - (parseFloat(cashPaidAmount) || 0)).toFixed(2)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {(paymentMethod === 'loan' || (paymentMethod === 'cash' && cashPaymentType === 'partial')) && (
                        <div className={clsx(
                            "p-4 rounded-xl border flex items-center justify-between transition-all",
                            selectedCustomer ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200 animate-pulse"
                        )}>
                            <div className="flex items-center gap-3">
                                <div className={clsx(
                                    "p-2 rounded-lg",
                                    selectedCustomer ? "bg-amber-100 text-amber-600" : "bg-red-100 text-red-600"
                                )}>
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase">Confirm Customer</p>
                                    <p className={clsx(
                                        "font-bold text-sm",
                                        selectedCustomer ? "text-slate-900" : "text-red-600"
                                    )}>
                                        {selectedCustomer ? `${selectedCustomer.first_name} ${selectedCustomer.last_name || ''}` : "Walk-in Customer"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 slide-in-from-top-2 animate-in duration-200">
                            <X className="w-4 h-4 shrink-0" />
                            <p className="text-xs font-bold">{error}</p>
                        </div>
                    )}
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
    const { cart, removeFromCart, updateQuantity, calculateTotal, clearCart, selectedCustomer, setSelectedCustomer } = useCart();
    const { subtotal, tax, total, previousBalance, finalTotal } = calculateTotal();
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);
    const [lastOrderData, setLastOrderData] = useState(null);

    // Customer Selection State
    const [isCustomerSearchOpen, setIsCustomerSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [customers, setCustomers] = useState([]);
    const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);

    const fetchCustomers = async () => {
        setIsLoadingCustomers(true);
        try {
            const response = await API.getCustomers();
            if (response.success) {
                setCustomers(response.data);

                // If we have a selected customer, refresh their data from the new list
                if (selectedCustomer) {
                    const latestData = response.data.find(c => c.customer_id === selectedCustomer.customer_id);
                    if (latestData) {
                        setSelectedCustomer(latestData);
                    }
                }
            }
        } catch (err) {
            console.error("Failed to fetch customers", err);
        } finally {
            setIsLoadingCustomers(false);
        }
    };

    // Auto-refresh customer data on mount to get latest balances
    React.useEffect(() => {
        fetchCustomers();
    }, []);

    const filteredCustomers = customers.filter(c =>
        `${c.first_name} ${c.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.phone_number && c.phone_number.includes(searchQuery))
    );

    const handleSelectCustomer = (customer) => {
        setSelectedCustomer(customer);
        setIsCustomerSearchOpen(false);
        setSearchQuery('');
    };

    const toggleCustomerSearch = () => {
        if (!isCustomerSearchOpen && customers.length === 0) {
            fetchCustomers();
        }
        setIsCustomerSearchOpen(!isCustomerSearchOpen);
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-l-2xl border-l border-slate-200 shadow-2xl relative z-30 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-baseline gap-2">
                        <h2 className="font-bold text-lg text-slate-800">Current Order</h2>
                        <span className="text-[10px] text-slate-400 font-medium">#883920</span>
                    </div>
                    <button
                        onClick={clearCart}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Clear Cart"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                {/* Customer Selector */}
                <div className="relative">
                    {!selectedCustomer ? (
                        <button
                            onClick={toggleCustomerSearch}
                            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs flex items-center justify-between hover:bg-slate-100 transition-all group"
                        >
                            <div className="flex items-center gap-2 text-slate-500 group-hover:text-slate-700">
                                <UserPlus className="w-3.5 h-3.5" />
                                <span className="font-bold">Add Customer</span>
                            </div>
                            <Search className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                    ) : (
                        <div className="flex items-center justify-between p-2 bg-primary-50 border border-primary-200 rounded-lg animate-in fade-in zoom-in duration-300">
                            <div className="flex items-center gap-2 min-w-0">
                                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                                    <User className="w-4 h-4 text-primary-600" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-slate-800 truncate leading-tight">
                                        {selectedCustomer.first_name} {selectedCustomer.last_name}
                                    </p>
                                    <p className="text-[10px] font-bold mt-0.5 leading-none">
                                        Bal: <span className={parseFloat(selectedCustomer.loan_balance || 0) > 0 ? "text-red-500" : "text-green-600"}>
                                            RS {parseFloat(selectedCustomer.loan_balance || 0).toFixed(2)}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedCustomer(null)}
                                className="p-1 hover:bg-primary-200 text-primary-600 rounded-md transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}

                    {/* Customer Search Dropdown */}
                    <AnimatePresence>
                        {isCustomerSearchOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden"
                            >
                                <div className="p-3 border-b border-slate-100">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            autoFocus
                                            type="text"
                                            placeholder="Search by name or phone..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                        />
                                    </div>
                                </div>
                                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                    {isLoadingCustomers ? (
                                        <div className="p-8 flex justify-center">
                                            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    ) : filteredCustomers.length > 0 ? (
                                        filteredCustomers.map(customer => (
                                            <button
                                                key={customer.customer_id}
                                                onClick={() => handleSelectCustomer(customer)}
                                                className="w-full p-3 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left"
                                            >
                                                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                                                    <User className="w-4 h-4 text-slate-500" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-slate-800">{customer.first_name} {customer.last_name}</p>
                                                    <p className="text-xs text-slate-500">{customer.phone_number || "No phone"}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Balance</p>
                                                    <p className={clsx(
                                                        "text-xs font-bold",
                                                        parseFloat(customer.loan_balance || 0) > 0 ? "text-red-500" : "text-green-600"
                                                    )}>
                                                        RS {parseFloat(customer.loan_balance || 0).toFixed(2)}
                                                    </p>
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-slate-500">
                                            <p className="text-sm">No customers found</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
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
                                className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100 group"
                            >
                                <div className="w-10 h-10 bg-white rounded-md overflow-hidden border border-slate-200 shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-800 text-[13px] truncate leading-tight">{item.name}</h4>
                                    <p className="text-[11px] text-primary-600 font-black mt-0.5">RS {item.price.toFixed(2)}</p>
                                </div>

                                <div className="flex items-center gap-1.5 bg-white rounded-md border border-slate-200 p-0.5 shadow-sm">
                                    <button
                                        onClick={() => updateQuantity(item.id, -1)}
                                        className="w-5 h-5 flex items-center justify-center rounded hover:bg-slate-100 text-slate-600 transition-colors"
                                    >
                                        <Minus className="w-2.5 h-2.5" />
                                    </button>
                                    <span className="w-4 text-center text-xs font-black text-slate-800">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, 1)}
                                        disabled={item.quantity >= item.stock}
                                        className={clsx(
                                            "w-5 h-5 flex items-center justify-center rounded shadow-sm transition-colors",
                                            item.quantity >= item.stock 
                                                ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                                                : "bg-slate-900 text-white hover:bg-slate-800"
                                        )}
                                    >
                                        <Plus className="w-2.5 h-2.5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            <div className="px-4 py-3 bg-white border-t border-slate-200 shadow-[0_-5px_20px_rgba(0,0,0,0.02)] z-10">
                <div className="space-y-1.5 mb-3">
                    <div className="flex justify-between text-xs text-slate-500 italic">
                        <span>Current Order Total</span>
                        <span>RS {total.toFixed(2)}</span>
                    </div>
                    {selectedCustomer && (
                        <div className="flex justify-between text-xs font-bold text-red-500 italic">
                            <span>Previous Balance</span>
                            <span>RS {previousBalance.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-lg font-black text-slate-900 pt-1.5 border-t border-slate-900">
                        <span>GRAND TOTAL</span>
                        <span>RS {finalTotal.toFixed(2)}</span>
                    </div>
                </div>

                <button
                    onClick={() => setIsCheckoutOpen(true)}
                    disabled={cart.length === 0}
                    className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold text-base shadow-lg shadow-primary-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    Checkout RS {finalTotal.toFixed(2)}
                </button>
            </div>

            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                orderTotal={total}
                previousBalance={previousBalance}
                cart={cart}
                onComplete={async (data) => {
                    setIsCheckoutOpen(false);
                    setLastOrderData(data.receiptData);
                    setIsReceiptOpen(true);
                    await fetchCustomers(); // Refresh balances in the list
                    clearCart();
                }}
            />

            <ReceiptPreviewModal
                isOpen={isReceiptOpen}
                onClose={() => setIsReceiptOpen(false)}
                orderData={lastOrderData}
            />
        </div>
    );
};

export default CartPanel;
