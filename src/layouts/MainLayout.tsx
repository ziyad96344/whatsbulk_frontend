import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { Outlet, useLocation } from 'react-router-dom';

export const MainLayout = () => {
    const location = useLocation();
    // Extract title from path, e.g. /campaigns -> Campaigns
    const title = location.pathname.split('/')[1] || 'Dashboard';

    return (
        <div className="flex min-h-screen bg-[#F0F4F8] text-slate-800 font-sans">
            <Sidebar />

            <main className="ml-64 flex-1 flex flex-col min-h-screen transition-all duration-300">
                <TopBar title={title} />

                <div className="p-8 flex-1 overflow-y-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
