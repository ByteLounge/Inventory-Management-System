import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Warehouses() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const dummyWarehouses = [
        { id: 'wh-1', name: 'Main Warehouse', location: 'New York, NY' },
        { id: 'wh-2', name: 'East Hub', location: 'Boston, MA' },
    ];

    const { data: warehouses, isLoading } = useQuery({
        queryKey: ['warehouses'],
        queryFn: async () => {
            const res = await api.get('/warehouses');
            return res.data;
        }
    });

    const displayWarehouses = (warehouses && warehouses.length > 0) ? warehouses : dummyWarehouses;

    const createWarehouseMutation = useMutation({
        mutationFn: (newWarehouse: any) => api.post('/warehouses', newWarehouse),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['warehouses'] });
            setIsModalOpen(false);
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        createWarehouseMutation.mutate({
            name: formData.get('name'),
            location: formData.get('location')
        });
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-primary tracking-tight">Locations</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your warehouses and distribution centers</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                >
                    <Plus className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
                    New Location
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                {isLoading ? (
                    <div className="p-12 text-center text-sm text-gray-500 animate-pulse">Loading locations...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location / Address</th>
                                    <th scope="col" className="relative px-6 py-3.5">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {displayWarehouses.map((warehouse: any, idx: number) => (
                                    <motion.tr
                                        key={warehouse.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="hover:bg-gray-50/80 transition-colors group"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {warehouse.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <MapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                                                {warehouse.location}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="text-gray-400 hover:text-gray-900 mr-4 transition-colors">
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button className="text-gray-400 hover:text-rose-600 transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                                {!isLoading && displayWarehouses.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center text-sm text-gray-500">
                                            No locations found. Add your first warehouse to start managing inventory.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed z-50 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-block align-bottom bg-white rounded-xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 border border-gray-100"
                        >
                            <div>
                                <h3 className="text-lg leading-6 font-semibold text-gray-900 mb-1">New Location</h3>
                                <p className="text-sm text-gray-500 mb-6">Register a new warehouse or distribution center.</p>
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse Name</label>
                                        <input type="text" name="name" required className="block w-full border-gray-200 rounded-md sm:text-sm py-2 px-3 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-shadow" placeholder="e.g. West Coast Hub" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Location / Address</label>
                                        <input type="text" name="location" required className="block w-full border-gray-200 rounded-md sm:text-sm py-2 px-3 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-shadow" placeholder="e.g. Los Angeles, CA" />
                                    </div>
                                    <div className="mt-6 sm:flex sm:flex-row-reverse pt-2">
                                        <button type="submit" disabled={createWarehouseMutation.isPending} className="w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-gray-900 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50 sm:ml-3 sm:w-auto">
                                            {createWarehouseMutation.isPending ? 'Saving...' : 'Save Location'}
                                        </button>
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-200 px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto transition-colors">
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
