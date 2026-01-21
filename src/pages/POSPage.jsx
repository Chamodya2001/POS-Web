import React from 'react';
import ProductGrid from '../components/pos/ProductGrid';
import CartPanel from '../components/pos/CartPanel';

const POSPage = () => {
    return (
        <div className="flex flex-col md:flex-row h-full gap-4 pb-4">
            {/* Left Side - Products */}
            <div className="flex-1 min-w-0 h-full overflow-hidden">
                <ProductGrid />
            </div>

            {/* Right Side - Cart */}
            <div className="w-full md:w-[400px] xl:w-[450px] shrink-0 h-full">
                <CartPanel />
            </div>
        </div>
    );
};

export default POSPage;
