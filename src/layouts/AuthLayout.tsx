import React from 'react';
import { Outlet } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

export const AuthLayout = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col sm:justify-center items-center pt-6 sm:pt-0">
            <div className="mb-6 flex items-center gap-3">
                <div className="w-12 h-12 bg-wa-green rounded-full flex items-center justify-center shadow-lg shadow-wa-green/20">
                    <MessageCircle className="text-white w-7 h-7" />
                </div>
                <span className="text-3xl font-bold text-gray-900 tracking-tight">WhatsBulk</span>
            </div>

            <div className="w-full sm:max-w-md bg-white shadow-xl shadow-slate-200/50 overflow-hidden sm:rounded-2xl border border-gray-100">
                <Outlet />
            </div>

            <div className="mt-8 text-center text-xs text-gray-400">
                &copy; {new Date().getFullYear()} WhatsBulk SaaS. All rights reserved.
            </div>
        </div>
    );
};
