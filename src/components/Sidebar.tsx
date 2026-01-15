import React from 'react';
import { LayoutDashboard, Send, Users, FileText, Settings, LogOut, MessageCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const currentPath = location.pathname.split('/')[1] || 'dashboard';

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'campaigns', label: 'Campaigns', icon: Send },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <aside className="w-64 bg-wa-dark text-white h-screen fixed left-0 top-0 flex flex-col border-r border-gray-800 z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-wa-green rounded-full flex items-center justify-center">
          <MessageCircle className="text-white w-6 h-6" />
        </div>
        <span className="font-bold text-xl tracking-tight">WhatsBulk</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = currentPath === item.id;
          return (
            <Link
              key={item.id}
              to={`/${item.id}`}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                  ? 'bg-wa-green text-white shadow-lg shadow-wa-green/20'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
            >
              <item.icon size={20} className={isActive ? 'animate-pulse' : ''} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-gray-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 text-gray-400 hover:text-red-400 transition-colors w-full px-4 py-2"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};