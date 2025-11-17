// src/components/common/NotificationBell.jsx

import { useState, useEffect } from 'react';
import { FiBell, FiX } from 'react-icons/fi';
import useNotificationStore from '../../store/notificationStore';
import { getRelativeTime } from '../../utils/dateUtils';
import { getStatusColor } from '../../utils/helpers';

const NotificationBell = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();

    // Get only recent notifications (last 10)
    const recentNotifications = notifications.slice(0, 10);

    const handleNotificationClick = (notification) => {
        if (!notification.isRead) {
            markAsRead(notification._id);
        }
        // Handle navigation based on notification type
        // This can be expanded based on your needs
    };

    const handleMarkAllRead = () => {
        markAllAsRead();
    };

    return (
        <div className="relative">
            {/* Bell Icon */}
            <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
                <FiBell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowNotifications(false)}
                    ></div>

                    {/* Notification Panel */}
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-20 animate-fadeIn">
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Notifications
                                </h3>
                                {unreadCount > 0 && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                                    </p>
                                )}
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-96 overflow-y-auto">
                            {recentNotifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <FiBell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">No notifications yet</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {recentNotifications.map((notification) => (
                                        <div
                                            key={notification._id}
                                            onClick={() => handleNotificationClick(notification)}
                                            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.isRead ? 'bg-blue-50' : ''
                                                }`}
                                        >
                                            <div className="flex items-start">
                                                <div
                                                    className={`w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${!notification.isRead ? 'bg-primary-600' : 'bg-gray-300'
                                                        }`}
                                                ></div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        {getRelativeTime(notification.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {recentNotifications.length > 0 && (
                            <div className="p-3 border-t border-gray-200 text-center">
                                <button
                                    onClick={() => {
                                        setShowNotifications(false);
                                        // Navigate to notifications page if exists
                                    }}
                                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                                >
                                    View all notifications
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationBell;