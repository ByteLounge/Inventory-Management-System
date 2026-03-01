import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { ArrowLeftRight, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Inventory() {
    const queryClient = useQueryClient();

    // dummy data to show when backend is not available or returns empty lists
    const dummyWarehouses = [
        { id: 'wh1', name: 'Main Warehouse' },
        { id: 'wh2', name: 'Secondary Hub' },
    ];

    const dummyInventory = [
        { id: 'inv1', product_name: 'Widget A', product_sku: 'WID-A', quantity: 120, min_stock_level: 50 },
        { id: 'inv2', product_name: 'Gadget B', product_sku: 'GAD-B', quantity: 0, min_stock_level: 20 },
        { id: 'inv3', product_name: 'Thing C', product_sku: 'THC-C', quantity: 15, min_stock_level: 30 },
    ];

    const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);

    const { data: warehouses } = useQuery({
        queryKey: ['warehouses'],
        queryFn: async () => {
            const res = await api.get('/warehouses');
            if (res.data.length > 0 && !selectedWarehouse) {
                setSelectedWarehouse(res.data[0].id);
            }
            return res.data;
        }
    });

    // pick either real warehouses or dummy ones
    const displayWarehouses = (warehouses && warehouses.length > 0) ? warehouses : dummyWarehouses;

    // ensure we always have a selected warehouse for the UI
    React.useEffect(() => {
        if (!selectedWarehouse && displayWarehouses.length) {
            setSelectedWarehouse(displayWarehouses[0].id);
        }
    }, [displayWarehouses, selectedWarehouse]);

    const { data: inventory, isLoading } = useQuery({
        queryKey: ['inventory', selectedWarehouse],
        queryFn: async () => {
            if (!selectedWarehouse) return [];
            const res = await api.get(`/inventory/${selectedWarehouse}`);
            return res.data;
        },
        enabled: !!selectedWarehouse
    });

    const shownInventory = (inventory && inventory.length > 0) ? inventory : dummyInventory;

    const { data: products } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const res = await api.get('/products');
            return res.data;
        }
    });

    const moveMutation = useMutation({
        mutationFn: (movement: any) => api.post('/inventory/move', movement),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventory', selectedWarehouse] });
            queryClient.invalidateQueries({ queryKey: ['analytics-low-stock'] });
            setIsMoveModalOpen(false);
        }
    });

    const handleMove = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        moveMutation.mutate({
            warehouse_id: selectedWarehouse,
            product_id: formData.get('product_id'),
            type: formData.get('type'),
            quantity: parseInt(formData.get('quantity') as string),
            notes: formData.get('notes')
        });
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-primary tracking-tight">Inventory</h1>
                    <p className="text-sm text-gray-500 mt-1">Track levels and execute stock movements</p>
                </div>
                <button
                    onClick={() => setIsMoveModalOpen(true)}
                    disabled={!selectedWarehouse}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                    <ArrowLeftRight className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
                    Stock IN/OUT
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-100 flex items-center bg-gray-50/50">
                    <div className="flex-1 max-w-sm">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Location</label>
                        <select
                            value={selectedWarehouse}
                            onChange={(e) => setSelectedWarehouse(e.target.value)}
                            className="block w-full pl-3 pr-10 py-2 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 sm:text-sm rounded-md transition-shadow"
                        >
                            {displayWarehouses.map((w: any) => (
                                <option key={w.id} value={w.id}>{w.name}</option>
                            ))}
                            {!displayWarehouses.length && <option value="">No locations available</option>}
                        </select>
                    </div>
                </div>

                {isLoading ? (
                    <div className="p-12 text-center text-sm text-gray-500 animate-pulse">Loading stock levels...</div>
                ) : !selectedWarehouse ? (
                    <div className="p-12 text-center text-sm text-gray-500">Please select a location to view its inventory.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead>
                                <tr className="bg-white">
                                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
                                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Available Stock</th>
                                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {shownInventory.map((item: any, idx: number) => {
                                    const isLow = item.quantity <= item.min_stock_level && item.quantity > 0;
                                    const isOut = item.quantity === 0;

                                    return (
                                        <motion.tr
                                            key={item.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.03 }}
                                            className="hover:bg-gray-50/80 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {item.product_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.product_sku}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                {item.quantity}
                                                <span className="text-xs text-gray-400 ml-2 font-normal">/ {item.min_stock_level} min</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {isOut ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100"><Activity className="w-3 h-3 mr-1" /> Out of Stock</span>
                                                ) : isLow ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100"><Activity className="w-3 h-3 mr-1" /> Low Stock</span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">Optimal</span>
                                                )}
                                            </td>
                                        </motion.tr>
                                    )
                                })}
                                {inventory?.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">
                                            No inventory records found for this location. Use the Stock Move button to add items.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {isMoveModalOpen && (
                <div className="fixed z-50 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsMoveModalOpen(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-block align-bottom bg-white rounded-xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 border border-gray-100"
                        >
                            <div>
                                <h3 className="text-lg leading-6 font-semibold text-gray-900 mb-1">Log Stock Movement</h3>
                                <p className="text-sm text-gray-500 mb-6">Record incoming shipments or manual stock reductions.</p>
                                <form onSubmit={handleMove} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
                                        <select name="type" required className="block w-full pl-3 pr-10 py-2 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 sm:text-sm rounded-md transition-shadow">
                                            <option value="IN">ADD Stock (IN)</option>
                                            <option value="OUT">REMOVE Stock (OUT)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                                        <select name="product_id" required className="block w-full pl-3 pr-10 py-2 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 sm:text-sm rounded-md transition-shadow">
                                            <option value="">Select a product...</option>
                                            {products?.map((p: any) => (
                                                <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                        <input type="number" min="1" name="quantity" required className="block w-full border-gray-200 rounded-md sm:text-sm py-2 px-3 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-shadow" placeholder="e.g. 50" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Reference Notes</label>
                                        <input type="text" name="notes" className="block w-full border-gray-200 rounded-md sm:text-sm py-2 px-3 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-shadow" placeholder="PO Number, reason, etc." />
                                    </div>
                                    <div className="mt-6 sm:flex sm:flex-row-reverse pt-2">
                                        <button type="submit" disabled={moveMutation.isPending} className="w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-gray-900 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none sm:ml-3 sm:w-auto transition-colors disabled:opacity-50">
                                            {moveMutation.isPending ? 'Processing...' : 'Confirm Movement'}
                                        </button>
                                        <button type="button" onClick={() => setIsMoveModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-200 px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto transition-colors">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </div>
    );
}
