import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Plus, Search, Edit2, Trash2, Mail, Phone, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Suppliers() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const dummySuppliers = [
        { id: 'sup-1', name: 'Acme Corp', contact_name: 'John Doe', email: 'john@acme.com', phone: '555-0101', lead_time_days: 5 },
        { id: 'sup-2', name: 'Global Supply Co', contact_name: 'Anna Smith', email: 'anna@globalsupply.com', phone: '555-0202', lead_time_days: 10 },
    ];

    const { data: suppliers, isLoading } = useQuery({
        queryKey: ['suppliers'],
        queryFn: async () => {
            const res = await api.get('/suppliers');
            return res.data;
        }
    });

    const createSupplierMutation = useMutation({
        mutationFn: (newSupplier: any) => api.post('/suppliers', newSupplier),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['suppliers'] });
            setIsModalOpen(false);
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        createSupplierMutation.mutate({
            name: formData.get('name'),
            contact_name: formData.get('contact_name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            lead_time_days: parseInt(formData.get('lead_time_days') as string) || null,
        });
    };

    const filteredSuppliers = suppliers?.filter((s: any) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.contact_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const displaySuppliers = (!isLoading && filteredSuppliers && filteredSuppliers.length > 0)
        ? filteredSuppliers
        : dummySuppliers;

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-primary tracking-tight">Suppliers</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage vendor contacts and lead times</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                >
                    <Plus className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
                    New Supplier
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="relative w-full max-w-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            name="search"
                            className="block w-full pl-10 sm:text-sm border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                            placeholder="Search suppliers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="p-12 text-center text-sm text-gray-500 animate-pulse">Loading suppliers...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Details</th>
                                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Lead Time</th>
                                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="relative px-6 py-3.5">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {displaySuppliers.map((supplier: any, idx: number) => (
                                    <motion.tr
                                        key={supplier.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="hover:bg-gray-50/80 transition-colors group"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                                            {supplier.contact_name && (
                                                <div className="text-xs text-gray-500 mt-0.5">Contact: {supplier.contact_name}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {supplier.email && (
                                                <div className="flex items-center text-sm text-gray-600 mb-1">
                                                    <Mail className="h-3 w-3 mr-2" />
                                                    {supplier.email}
                                                </div>
                                            )}
                                            {supplier.phone && (
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Phone className="h-3 w-3 mr-2" />
                                                    {supplier.phone}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Clock className="h-4 w-4 mr-2" />
                                                {supplier.lead_time_days ? `${supplier.lead_time_days} days` : 'Not set'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                Active
                                            </span>
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
                                {!isLoading && displaySuppliers.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                                            No suppliers mapped. Add your first vendor details here.
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
                                <h3 className="text-lg leading-6 font-semibold text-gray-900 mb-1">New Supplier</h3>
                                <p className="text-sm text-gray-500 mb-6">Create a profile for an external vendor.</p>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                        <input type="text" name="name" required className="block w-full border-gray-200 rounded-md sm:text-sm py-2 px-3 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-shadow" placeholder="e.g. Global Tech Dist." />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                                        <input type="text" name="contact_name" className="block w-full border-gray-200 rounded-md sm:text-sm py-2 px-3 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-shadow" placeholder="e.g. Jane Smith" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <input type="email" name="email" className="block w-full border-gray-200 rounded-md sm:text-sm py-2 px-3 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-shadow" placeholder="contact@supplier.com" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                            <input type="text" name="phone" className="block w-full border-gray-200 rounded-md sm:text-sm py-2 px-3 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-shadow" placeholder="555-0100" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Lead Time (Days)</label>
                                            <input type="number" min="0" name="lead_time_days" className="block w-full border-gray-200 rounded-md sm:text-sm py-2 px-3 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-shadow" placeholder="e.g. 5" />
                                        </div>
                                    </div>
                                    <div className="mt-6 sm:flex sm:flex-row-reverse pt-2">
                                        <button type="submit" disabled={createSupplierMutation.isPending} className="w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-gray-900 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50 sm:ml-3 sm:w-auto">
                                            {createSupplierMutation.isPending ? 'Saving...' : 'Save Supplier'}
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
