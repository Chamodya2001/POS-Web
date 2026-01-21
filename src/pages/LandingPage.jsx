import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Zap, Shield, BarChart3 as BarChart,
    Smartphone, ArrowRight, ShoppingCart,
    CheckCircle, Star, Package,
    Layout as LayoutIcon, MessageSquare
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useProducts } from '../context/ProductContext';
import clsx from 'clsx';

const Navbar = ({ onLoginClick }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={clsx(
            "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-6 py-4",
            scrolled ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 py-3" : "bg-transparent"
        )}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                        <ShoppingCart className="text-white w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                        LoopPOS
                    </span>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <a href="#features" className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-white transition-colors">Features</a>
                    <a href="#products" className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-white transition-colors">Showcase</a>
                    <a href="#testimonials" className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-white transition-colors">Clients</a>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={onLoginClick}
                        className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/10"
                    >
                        Merchant Login
                    </button>
                </div>
            </div>
        </nav>
    );
};

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group"
    >
        <div className="w-14 h-14 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Icon className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
            {description}
        </p>
    </motion.div>
);

export default function LandingPage({ onStart }) {
    const { products } = useProducts();
    const featuredProducts = products.slice(0, 4);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-x-hidden">
            <Navbar onLoginClick={onStart} />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary-100/50 via-transparent to-transparent dark:from-primary-900/10" />

                <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="px-4 py-1.5 bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 rounded-full text-primary-700 dark:text-primary-400 text-xs font-bold uppercase tracking-wider mb-8"
                    >
                        Elevate your Retail Experience
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-[1.1]"
                    >
                        Modern POS for the <br />
                        <span className="text-primary-600 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">Next Gen Retailer.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed"
                    >
                        Synchronize your sales, inventory, and analytics in real-time. Beautifully designed, lightning fast, and works on any device.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                    >
                        <button
                            onClick={onStart}
                            className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-primary-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            Get Started Free <ArrowRight className="w-5 h-5" />
                        </button>
                        <button className="px-8 py-4 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                            View Live Demo
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 px-6 bg-white dark:bg-slate-950 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">Powerful from Day One</h2>
                        <p className="text-slate-500 dark:text-slate-400">Everything you need to grow your business at your fingertips.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <FeatureCard
                            icon={Zap}
                            title="Lightning Fast"
                            description="Optimized for speed. Transactions complete in milliseconds so you never lose a customer."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={Package}
                            title="Inventory Sync"
                            description="Real-time stock tracking across all channels. Say goodbye to overselling."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={LayoutIcon}
                            title="Advanced Reports"
                            description="Gain deep insights with customizable analytics and profit tracking."
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={Shield}
                            title="Bank-grade Security"
                            description="Protected with AES encryption and 2FA. Your data is your business."
                            delay={0.4}
                        />
                    </div>
                </div>
            </section>

            {/* Product Showcase */}
            <section id="products" className="py-24 px-6 bg-slate-50 dark:bg-slate-900/30">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">Browse Our Shop</h2>
                            <p className="text-slate-500 dark:text-slate-400">Experience our checkout flow firsthand with these sample items.</p>
                        </div>
                        <button className="hidden md:flex items-center gap-2 text-primary-600 font-bold hover:gap-3 transition-all">
                            View All Items <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.length > 0 ? featuredProducts.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group"
                            >
                                <div className="h-56 relative overflow-hidden">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute top-3 right-3">
                                        <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-full text-xs font-bold shadow-sm">
                                            {product.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h4 className="font-bold text-slate-800 dark:text-white mb-2">{product.name}</h4>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-black text-primary-600">${product.price}</span>
                                        <button className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-primary-600 hover:text-white transition-all">
                                            <ShoppingCart className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )) : (
                            <p className="col-span-4 text-center text-slate-500">No products available to showcase.</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-16 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-12 border-b border-slate-800 pb-16">
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                                <ShoppingCart className="text-white w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">LoopPOS</span>
                        </div>
                        <p className="max-w-xs mb-8">Empowering small and medium businesses with professional retail tools.</p>
                        <div className="flex gap-4">
                            {/* Social Icons */}
                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-primary-600 transition-colors cursor-pointer"><MessageSquare className="w-5 h-5 text-white" /></div>
                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-primary-600 transition-colors cursor-pointer"><Smartphone className="w-5 h-5 text-white" /></div>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6">Solution</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="hover:text-white cursor-pointer transition-colors">Point of Sale</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Inventory</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Reports</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="hover:text-white cursor-pointer transition-colors">About</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Contact</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6">Legal</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="hover:text-white cursor-pointer transition-colors">Privacy</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Terms</li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-wide">
                    <p>© 2026 LoopPOS Technologies. All rights reserved.</p>
                    <div className="flex gap-8">
                        <span>Built with ❤️ for Retailers</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
