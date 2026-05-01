import React, { useRef, useState } from 'react';
import { Printer, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateReceiptHtml } from '../../utils/printReceipt';

const ReceiptPreviewModal = ({ isOpen, onClose, orderData }) => {
    const iframeRef = useRef(null);
    const [printing, setPrinting] = useState(false);

    if (!isOpen || !orderData) return null;

    const handlePrint = () => {
        setPrinting(true);
        const iframe = iframeRef.current;
        if (iframe) {
            iframe.contentWindow.print();
        }
        // Small delay to show state change
        setTimeout(() => {
            setPrinting(false);
            onClose(); // Auto close after print command is sent
        }, 1000);
    };

    const receiptHtml = generateReceiptHtml(orderData);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] border border-slate-200"
                    >
                        {/* Status Banner */}
                        <div className="bg-emerald-50 px-6 py-3 flex items-center justify-center gap-2 border-b border-emerald-100">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm font-semibold text-emerald-700">Payment Processed Successfully</span>
                        </div>

                        {/* Simple Header */}
                        <div className="p-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Print Bill</h2>
                                <p className="text-sm text-slate-500 font-medium">Order Reference: #{orderData.orderId}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Focused Preview Area */}
                        <div className="flex-1 bg-slate-50 p-8 flex justify-center overflow-y-auto">
                            <div className="bg-white shadow-sm border border-slate-200" style={{ width: '80mm', minHeight: '120mm' }}>
                                <iframe
                                    ref={iframeRef}
                                    title="Receipt Preview"
                                    className="w-full h-full border-none"
                                    style={{ width: '80mm', height: '100%', minHeight: '800px' }}
                                    srcDoc={receiptHtml}
                                />
                            </div>
                        </div>

                        {/* Clean Actions */}
                        <div className="p-6 bg-white border-t border-slate-100 grid grid-cols-2 gap-4">
                            <button
                                onClick={onClose}
                                className="h-12 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 active:scale-[0.98] transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePrint}
                                disabled={printing}
                                className="h-12 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-sm shadow-lg shadow-slate-900/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {printing ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Printer className="w-4 h-4" />
                                )}
                                {printing ? 'Printing...' : 'Print Bill'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ReceiptPreviewModal;
