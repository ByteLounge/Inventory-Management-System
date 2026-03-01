// import React from 'react'; // Unused
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import {
    Command,
    LayoutDashboard,
    Package,
    Boxes,
    Users,
    ShoppingCart,
    Bell,
    LogOut,
    Settings
} from 'lucide-react';
import { motion } from 'framer-motion';

const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Inventory', href: '/inventory', icon: Boxes },
    { name: 'Warehouses', href: '/warehouses', icon: Command },
    { name: 'Suppliers', href: '/suppliers', icon: Users },
    { name: 'Sales', href: '/sales', icon: ShoppingCart },
];

export default function Layout() {
    const { user, logout, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#fdfdfd] text-gray-500">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex h-screen bg-[#fdfdfd]">
            {/* Sidebar */}
            <div className="w-64 bg-[#fdfdfd] border-r border-gray-200 flex flex-col hidden md:flex">
                <div className="h-16 flex items-center px-6 border-b border-gray-200 shrink-0">
                    <Command className="h-5 w-5 text-gray-900 mr-2.5" />
                    <span className="text-lg font-semibold text-gray-900 tracking-tight">{user.company_name}</span>
                </div>

                <nav className="flex-1 overflow-y-auto py-6">
                    <ul className="space-y-1 px-3">
                        <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Overview</div>
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href
                                || (item.href !== '/' && location.pathname.startsWith(item.href));
                            return (
                                <li key={item.name}>
                                    <a
                                        href={item.href}
                                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        <item.icon className={`mr-3 h-4 w-4 flex-shrink-0 transition-colors ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'
                                            }`} />
                                        {item.name}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="p-4 border-t border-gray-200 bg-[#fdfdfd]">
                    <div className="flex items-center px-2 py-2 mb-2 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex-shrink-0 h-8 w-8 rounded-md bg-gray-200 flex items-center justify-center text-gray-900 font-bold text-sm">
                            {user.first_name[0]}
                        </div>
                        <div className="ml-3 truncate">
                            <p className="text-sm font-medium text-gray-900">{user.first_name}</p>
                            <p className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    >
                        <LogOut className="mr-3 h-4 w-4 text-gray-400 group-hover:text-rose-500" />
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden bg-gray-50/30">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10">
                    <div className="flex items-center flex-1">
                        {/* Mobile menu button could go here */}
                    </div>

                    <div className="flex items-center space-x-5">
                        <a href="/notifications" className="text-gray-400 hover:text-indigo-600 relative transition-colors">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-0 right-0 block h-1.5 w-1.5 rounded-full bg-rose-500 ring-2 ring-white" />
                        </a>
                        <div className="w-px h-5 bg-gray-200 mx-2"></div>
                        <a href="/settings" className="text-gray-400 hover:text-indigo-600 transition-colors">
                            <Settings className="h-5 w-5" />
                        </a>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="h-full"
                    >
                        <Outlet />
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
