// import React from 'react'; // Unused
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './lib/AuthContext';
import Layout from './layouts/Layout';

import Login from './pages/Login';
import Register from './pages/Register';

// Create a client
const queryClient = new QueryClient();

// real page components
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import Warehouses from './pages/Warehouses';
import Suppliers from './pages/Suppliers';
import Sales from './pages/Sales';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route path="/" element={<Layout />}>
                            <Route index element={<Dashboard />} />
                            <Route path="products" element={<Products />} />
                            <Route path="inventory" element={<Inventory />} />
                            <Route path="warehouses" element={<Warehouses />} />
                            <Route path="suppliers" element={<Suppliers />} />
                            <Route path="sales" element={<Sales />} />
                            <Route path="settings" element={<Settings />} />
                            <Route path="notifications" element={<Notifications />} />
                        </Route>

                        {/* Catch all */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;
