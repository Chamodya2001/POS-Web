import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, activeTab, onTabChange }) => {
    // Removed internal state for activeTab

    return (
        <div className="h-screen bg-slate-50/50 dark:bg-slate-950 flex overflow-hidden">
            <Sidebar activeTab={activeTab} onTabChange={onTabChange} />

            <div className="flex-1 flex flex-col ml-20 md:ml-64 transition-all duration-300 h-full relative">
                <Header />

                <main className="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar pt-20 px-4 pb-4 md:px-6 md:pb-6">
                    <div className="max-w-[1600px] mx-auto h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
