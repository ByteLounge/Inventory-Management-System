import React, { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { motion } from 'framer-motion';
import { Building2, UserCircle, Key, Globe, Shield, Save } from 'lucide-react';

export default function Settings() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => setIsSaving(false), 1000);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Settings</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your account settings and preferences.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
                {/* Settings Sidebar */}
                <div className="w-full md:w-64 bg-gray-50/50 border-r border-gray-100 p-4">
                    <nav className="space-y-1">
                        {[
                            { id: 'profile', name: 'Profile', icon: UserCircle },
                            { id: 'company', name: 'Company Details', icon: Building2 },
                            { id: 'security', name: 'Security', icon: Key },
                            { id: 'regional', name: 'Regional', icon: Globe },
                            { id: 'roles', name: 'Roles & Permissions', icon: Shield },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab.id
                                        ? 'bg-white text-indigo-600 shadow-sm border border-gray-100'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent'
                                    }`}
                            >
                                <tab.icon className={`mr-3 h-4 w-4 flex-shrink-0 ${activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400'
                                    }`} />
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Settings Content */}
                <div className="flex-1 p-6 md:p-8">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'profile' && (
                            <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
                                <div>
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
                                    <p className="mt-1 text-sm text-gray-500">Update your personal details and public profile.</p>
                                </div>
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                                        <input type="text" defaultValue={user?.first_name} className="mt-1 block w-full border border-gray-200 rounded-md py-2 px-3 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                        <input type="text" defaultValue={user?.last_name} className="mt-1 block w-full border border-gray-200 rounded-md py-2 px-3 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                        <input type="email" defaultValue={user?.email} className="mt-1 block w-full border border-gray-200 rounded-md py-2 px-3 bg-gray-50 text-gray-500 sm:text-sm cursor-not-allowed" disabled />
                                        <p className="mt-1 text-xs text-gray-500">Email addresses cannot be changed directly. Contact support.</p>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Role</label>
                                        <input type="text" defaultValue={user?.role.toUpperCase()} className="mt-1 block w-full border border-gray-200 rounded-md py-2 px-3 bg-gray-50 text-gray-500 sm:text-sm cursor-not-allowed" disabled />
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-gray-100 flex justify-end">
                                    <button type="submit" disabled={isSaving} className="inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none disabled:opacity-50 transition-colors">
                                        {isSaving ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
                                    </button>
                                </div>
                            </form>
                        )}

                        {activeTab === 'company' && (
                            <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
                                <div>
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Company Details</h3>
                                    <p className="mt-1 text-sm text-gray-500">Manage your organization's business details.</p>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Company Name</label>
                                        <input type="text" defaultValue={user?.company_name} className="mt-1 block w-full border border-gray-200 rounded-md py-2 px-3 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Business Address</label>
                                        <textarea rows={3} className="mt-1 block w-full border border-gray-200 rounded-md py-2 px-3 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="123 Tech Lane..." />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Tax ID</label>
                                            <input type="text" className="mt-1 block w-full border border-gray-200 rounded-md py-2 px-3 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Currency</label>
                                            <select className="mt-1 block w-full border border-gray-200 rounded-md py-2 px-3 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                                <option>USD ($)</option>
                                                <option>EUR (€)</option>
                                                <option>GBP (£)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-gray-100 flex justify-end">
                                    <button type="submit" disabled={isSaving} className="inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none disabled:opacity-50 transition-colors">
                                        {isSaving ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Save Details</>}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Empty states for other tabs for demo purposes */}
                        {['security', 'regional', 'roles'].includes(activeTab) && (
                            <div className="py-12 text-center">
                                <Shield className="mx-auto h-12 w-12 text-gray-300" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Setting Area Under Construction</h3>
                                <p className="mt-1 text-sm text-gray-500">This feature is not fully implemented in the current demo phase.</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
