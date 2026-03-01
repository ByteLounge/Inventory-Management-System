import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Products() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // dummy dataset shown when backend isn't responding or returns empty
    const dummyProducts = [
        { id: 'prod-1', sku: 'ABC-123', name: 'Sample Widget', price: 49.99, cost: 25.00 },
        { id: 'prod-2', sku: 'XYZ-987', name: 'Placeholder Gadget', price: 129.99, cost: 79.99 },
        { id: 'prod-3', sku: 'LMN-456', name: 'Test Item', price: 9.99, cost: 4.99 },
    ];

    const { data: products, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const res = await api.get('/products');
            return res.data;
        }
    });

    const createProductMutation = useMutation({
        mutationFn: (newProduct: any) => api.post('/products', newProduct),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            setIsModalOpen(false);
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        createProductMutation.mutate({
            sku: formData.get('sku'),
            name: formData.get('name'),
            price: parseFloat(formData.get('price') as string),
            cost: parseFloat(formData.get('cost') as string),
            min_stock_level: parseInt(formData.get('min_stock_level') as string) || 10
        });
    };

    const filteredProducts = products?.filter((p: any) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const displayProducts = (!isLoading && filteredProducts && filteredProducts.length > 0)
        ? filteredProducts
        : dummyProducts;

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-primary tracking-tight">Products</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your product catalog and pricing</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
                >
                    <Plus className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
                    New Product
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
                            placeholder="Search by SKU or Name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="p-12 text-center text-sm text-gray-500 animate-pulse">Loading catalog...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
                                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cost</th>
                                    <th scope="col" className="relative px-6 py-3.5">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {displayProducts.map((product: any, idx: number) => (
                                    <motion.tr
                                        key={product.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="hover:bg-gray-50/80 transition-colors group"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {product.sku}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {product.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                            ${product.price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ${product.cost.toFixed(2)}
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
                                {!isLoading && displayProducts.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                                            No products found matching your search.
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
                <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-block align-bottom bg-white rounded-xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 border border-gray-100"
                        >
                            <div>
                                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                                    <h3 className="text-lg leading-6 font-semibold text-gray-900" id="modal-title">
                                        New Product
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">Add a new item to your catalog.</p>
                                    <div className="mt-6">
                                        <form onSubmit={handleSubmit} className="space-y-5">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                                                <input type="text" name="sku" required className="block w-full rounded-md sm:text-sm border-gray-200 py-2 px-3 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors" placeholder="e.g. LAP-001" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                                <input type="text" name="name" required className="block w-full rounded-md sm:text-sm border-gray-200 py-2 px-3 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors" placeholder="e.g. MacBook Pro 16" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                                    <input type="number" step="0.01" name="price" required className="block w-full rounded-md sm:text-sm border-gray-200 py-2 px-3 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors" placeholder="0.00" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cost ($)</label>
                                                    <input type="number" step="0.01" name="cost" required className="block w-full rounded-md sm:text-sm border-gray-200 py-2 px-3 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors" placeholder="0.00" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock Alert Level</label>
                                                <input type="number" name="min_stock_level" defaultValue={10} className="block w-full rounded-md sm:text-sm border-gray-200 py-2 px-3 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors" />
                                            </div>
                                            <div className="mt-6 sm:flex sm:flex-row-reverse pt-2">
                                                <button type="submit" disabled={createProductMutation.isPending} className="w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-gray-900 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none sm:ml-3 sm:w-auto transition-colors disabled:opacity-50">
                                                    {createProductMutation.isPending ? 'Saving...' : 'Save Product'}
                                                </button>
                                                <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-200 px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto transition-colors">
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </div>
    );
}
