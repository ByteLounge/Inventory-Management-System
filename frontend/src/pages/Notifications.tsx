import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, AlertCircle, CheckCircle2, Info } from 'lucide-react';

export default function Notifications() {
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'alert', title: 'Low Stock Alert', message: 'MacBook Pro 16" is below minimum stock level in West Coast Hub.', time: '10 mins ago', read: false },
        { id: 2, type: 'success', title: 'Shipment Received', message: 'PO-2024-001 has been fully received into inventory.', time: '1 hour ago', read: false },
        { id: 3, type: 'info', title: 'System Update', message: 'Scheduled maintenance will occur this Saturday at 2 AM UTC.', time: '5 hours ago', read: true },
        { id: 4, type: 'alert', title: 'Payment Overdue', message: 'Invoice INV-8892 is 3 days past due.', time: '1 day ago', read: true },
        { id: 5, type: 'success', title: 'New Customer', message: 'Tech Solutions Inc. has been added to your client list.', time: '2 days ago', read: true },
    ]);

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const markAsRead = (id: number) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'alert': return <AlertCircle className="h-5 w-5 text-rose-500" />;
            case 'success': return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
            case 'info': return <Info className="h-5 w-5 text-blue-500" />;
            default: return <Bell className="h-5 w-5 text-gray-500" />;
        }
    };

    const getBgColor = (type: string, read: boolean) => {
        if (read) return 'bg-white';
        switch (type) {
            case 'alert': return 'bg-rose-50';
            case 'success': return 'bg-emerald-50';
            case 'info': return 'bg-blue-50';
            default: return 'bg-gray-50';
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Notifications</h1>
                    <p className="text-sm text-gray-500 mt-1">Stay updated on your inventory alerts and system events.</p>
                </div>
                {notifications.some(n => !n.read) && (
                    <button
                        onClick={markAllRead}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <ul className="divide-y divide-gray-100">
                    {notifications.map((notification, idx) => (
                        <motion.li
                            key={notification.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => markAsRead(notification.id)}
                            className={`p-5 flex gap-4 cursor-pointer hover:bg-gray-50 transition-colors ${getBgColor(notification.type, notification.read)}`}
                        >
                            <div className="mt-0.5 flex-shrink-0">
                                {getIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className={`text-sm font-medium ${notification.read ? 'text-gray-900' : 'text-gray-900'}`}>
                                        {notification.title}
                                    </h3>
                                    <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{notification.time}</span>
                                </div>
                                <p className={`mt-1 text-sm ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                                    {notification.message}
                                </p>
                            </div>
                            {!notification.read && (
                                <div className="flex flex-col justify-center">
                                    <span className="h-2 w-2 bg-indigo-600 rounded-full"></span>
                                </div>
                            )}
                        </motion.li>
                    ))}
                    {notifications.length === 0 && (
                        <li className="p-8 text-center text-gray-500">
                            You're all caught up! No new notifications.
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}
