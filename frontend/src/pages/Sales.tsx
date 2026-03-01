import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Plus, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Sales() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState('');
    const [cartItems, setCartItems] = useState<Array<{ product_id: string, quantity: number, price: number, name: string }>>([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);

    const dummySales = [
        { id: 'ord-1001', created_at: new Date().toISOString(), total_amount: 12450.0, status: 'Completed' },
        { id: 'ord-1002', created_at: new Date().toISOString(), total_amount: 4200.5, status: 'Processing' },
        { id: 'ord-1003', created_at: new Date().toISOString(), total_amount: 8900.0, status: 'Completed' },
    ];

    const sampleWarehouses = [
        { id: 'wh1', name: 'Main Warehouse' },
        { id: 'wh2', name: 'Secondary Hub' },
    ];

    const sampleProducts = [
        { id: 'prod-1', name: 'Sample Widget', price: 49.99 },
        { id: 'prod-2', name: 'Placeholder Gadget', price: 129.99 },
    ];

    const sampleInventory = [
        { product_id: 'prod-1', quantity: 100 },
        { product_id: 'prod-2', quantity: 50 },
    ];

    const { data: sales, isLoading: salesLoading } = useQuery({
        queryKey: ['sales'],
        queryFn: async () => {
            const res = await api.get('/sales');
            return res.data;
        }
    });

    const displayedSales = (sales && sales.length > 0) ? sales : dummySales;

    const { data: warehouses } = useQuery({ queryKey: ['warehouses'], queryFn: async () => (await api.get('/warehouses')).data });
    const { data: products } = useQuery({ queryKey: ['products'], queryFn: async () => (await api.get('/products')).data });
    const { data: inventory } = useQuery({
        queryKey: ['inventory', selectedWarehouse],
        queryFn: async () => selectedWarehouse ? (await api.get(`/inventory/${selectedWarehouse}`)).data : [],
        enabled: !!selectedWarehouse
    });

    const useWarehouses = (warehouses && warehouses.length > 0) ? warehouses : sampleWarehouses;
    const useProducts = (products && products.length > 0) ? products : sampleProducts;
    const useInventory = (inventory && inventory.length > 0) ? inventory : sampleInventory;

    const createSaleMutation = useMutation({
        mutationFn: (newSale: any) => api.post('/sales', newSale),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sales'] });
            queryClient.invalidateQueries({ queryKey: ['inventory'] });
            queryClient.invalidateQueries({ queryKey: ['analytics-overview'] });
            setIsModalOpen(false);
            setCartItems([]);
            setSelectedWarehouse('');
        }
    });

    const addToCart = () => {
        if (!selectedProduct || quantity <= 0) return;
        const product = products?.find((p: any) => p.id === selectedProduct);
        if (!product) return;

        const invItem = useInventory?.find((i: any) => i.product_id === selectedProduct);
        if (!invItem || invItem.quantity < quantity) {
            alert('Insufficient stock for this product in the selected warehouse.');
            return;
        }

        setCartItems(prev => {
            const existing = prev.find(item => item.product_id === selectedProduct);
            if (existing) {
                return prev.map(item => item.product_id === selectedProduct ? { ...item, quantity: item.quantity + quantity } : item);
            }
            return [...prev, { product_id: product.id, quantity, price: product.price, name: product.name }];
        });
        setSelectedProduct('');
        setQuantity(1);
    };

    const removeFromCart = (productId: string) => {
        setCartItems(prev => prev.filter(item => item.product_id !== productId));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (cartItems.length === 0 || !selectedWarehouse) return;

        createSaleMutation.mutate({
            warehouse_id: selectedWarehouse,
            items: cartItems.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity
            }))
        });
    };

    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-primary tracking-tight">Sales</h1>
                    <p className="text-sm text-gray-500 mt-1">Record transactions and manage revenue</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                >
                    <Plus className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
                    Record Sale
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                {salesLoading ? (
                    <div className="p-12 text-center text-sm text-gray-500 animate-pulse">Loading sales history...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order Reference</th>
                                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="relative px-6 py-3.5">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {displayedSales.map((sale: any, idx: number) => (
                                    <motion.tr
                                        key={sale.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="hover:bg-gray-50/80 transition-colors group"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(sale.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{sale.id.split('-')[0].toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                            ${sale.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className="px-2.5 py-1 inline-flex text-xs font-medium rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                {sale.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="text-gray-400 hover:text-gray-900 transition-colors flex items-center justify-end w-full">
                                                View <ArrowRight className="h-4 w-4 ml-1" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                                {displayedSales.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                                            No sales records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* New Sale Modal */}
            {isModalOpen && (
                <div className="fixed z-50 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-block align-bottom bg-white rounded-xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6 border border-gray-100"
                        >
                            <div>
                                <h3 className="text-lg leading-6 font-semibold text-gray-900 mb-1 flex items-center">
                                    <ShoppingCart className="mr-2 h-5 w-5 text-gray-400" /> New Sale Transaction
                                </h3>
                                <p className="text-sm text-gray-500 mb-6">Select a warehouse and add products to the cart to checkout.</p>

                                <div className="mb-6 border-b border-gray-100 pb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Source Location</label>
                                    <select
                                        value={selectedWarehouse}
                                        onChange={(e) => { setSelectedWarehouse(e.target.value); setCartItems([]); }}
                                        className="block w-full pl-3 pr-10 py-2 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 sm:text-sm rounded-md transition-shadow"
                                    >
                                        <option value="">Select a warehouse...</option>
                                        {(useWarehouses || []).map((w: any) => (
                                            <option key={w.id} value={w.id}>{w.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {selectedWarehouse && (
                                    <div className="mb-6 bg-gray-50/50 p-4 rounded-lg border border-gray-200">
                                        <div className="flex gap-4 items-end">
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                                                <select
                                                    value={selectedProduct}
                                                    onChange={(e) => setSelectedProduct(e.target.value)}
                                                    className="block w-full pl-3 pr-10 py-2 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 sm:text-sm rounded-md transition-shadow"
                                                >
                                                    <option value="">Select product to add...</option>
                                                    {(useInventory || []).filter((i: any) => i.quantity > 0).map((i: any) => {
                                                        const prod = (useProducts || []).find((p: any) => p.id === i.product_id);
                                                        return (
                                                            <option key={i.product_id} value={i.product_id}>
                                                                {i.product_name || prod?.name} ({i.quantity} in stock) - ${prod?.price?.toFixed(2)}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            </div>
                                            <div className="w-24">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Qty</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={quantity}
                                                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                                    className="block w-full border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 sm:text-sm transition-shadow"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={addToCart}
                                                disabled={!selectedProduct}
                                                className="inline-flex justify-center rounded-md border border-gray-200 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none transition-colors disabled:opacity-50 h-[38px] items-center"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {cartItems.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Order Items</h4>
                                        <ul className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
                                            {cartItems.map(item => (
                                                <li key={item.product_id} className="py-3 px-4 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors">
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                                        <p className="text-sm text-gray-500 mt-0.5">{item.quantity} x ${item.price.toFixed(2)}</p>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <span className="text-sm font-semibold text-gray-900">${(item.quantity * item.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                                        <button onClick={() => removeFromCart(item.product_id)} className="text-gray-400 hover:text-rose-600 transition-colors">
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                            <li className="py-4 px-4 flex justify-between items-center bg-gray-50/80 border-t border-gray-200">
                                                <span className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Total</span>
                                                <span className="text-xl font-bold text-gray-900">${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                            </li>
                                        </ul>
                                    </div>
                                )}

                                <div className="mt-6 sm:flex sm:flex-row-reverse pt-2">
                                    <button type="button" onClick={handleSubmit} disabled={cartItems.length === 0 || createSaleMutation.isPending} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-6 py-2 bg-gray-900 text-sm font-medium text-white hover:bg-gray-800 transition-colors focus:outline-none sm:ml-3 sm:w-auto disabled:opacity-50">
                                        {createSaleMutation.isPending ? 'Processing...' : 'Complete Checkout'}
                                    </button>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-200 shadow-sm px-6 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto transition-colors">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </div>
    );
}
