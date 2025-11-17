// src/store/notificationStore.js

import { create } from 'zustand';

/**
 * Notification Store using Zustand
 * Manages notifications state
 */
const useNotificationStore = create((set, get) => ({
    notifications: [],
    unreadCount: 0,
    loading: false,

    // Set notifications
    setNotifications: (notifications) =>
        set({
            notifications,
            unreadCount: notifications.filter((n) => !n.isRead).length,
        }),

    // Add notification
    addNotification: (notification) =>
        set((state) => ({
            notifications: [notification, ...state.notifications],
            unreadCount: !notification.isRead ? state.unreadCount + 1 : state.unreadCount,
        })),

    // Mark notification as read
    markAsRead: (notificationId) =>
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n._id === notificationId ? { ...n, isRead: true } : n
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
        })),

    // Mark all as read
    markAllAsRead: () =>
        set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
            unreadCount: 0,
        })),

    // Delete notification
    deleteNotification: (notificationId) =>
        set((state) => {
            const notification = state.notifications.find((n) => n._id === notificationId);
            return {
                notifications: state.notifications.filter((n) => n._id !== notificationId),
                unreadCount: notification && !notification.isRead
                    ? Math.max(0, state.unreadCount - 1)
                    : state.unreadCount,
            };
        }),

    // Clear all notifications
    clearAllNotifications: () =>
        set({
            notifications: [],
            unreadCount: 0,
        }),

    // Set loading
    setLoading: (loading) => set({ loading }),

    // Get unread notifications
    getUnreadNotifications: () => {
        const { notifications } = get();
        return notifications.filter((n) => !n.isRead);
    },

    // Set unread count
    setUnreadCount: (count) => set({ unreadCount: count }),
}));

export default useNotificationStore;