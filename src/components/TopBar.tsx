import React from 'react';
import { Bell, Search, ChevronDown } from 'lucide-react';

interface TopBarProps {
  title: string;
}

export const TopBar: React.FC<TopBarProps> = ({ title }) => {
  return (
    <header className="h-20 bg-white border-b border-gray-200 sticky top-0 z-40 px-8 flex items-center justify-between shadow-sm">
      <div className="flex flex-col">
        <span className="text-sm text-gray-500 font-medium">Overview</span>
        <h1 className="text-2xl font-bold text-gray-900 capitalize">{title}</h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-wa-green focus:outline-none w-64 transition-all"
          />
        </div>

        <button className="relative p-2 text-gray-500 hover:text-wa-green transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
          <img 
            src="https://picsum.photos/100/100" 
            alt="Profile" 
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
          />
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-900">Alex Morgan</p>
            <p className="text-xs text-gray-500">Admin Workspace</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </header>
  );
};