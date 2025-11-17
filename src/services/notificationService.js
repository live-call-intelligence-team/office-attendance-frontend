// src/services/notificationService.js

import { apiHelper } from './api';

/**
 * Notification Service
 * Handles all notification related API calls
 */

const notificationService = {
    /**
     * Get all notifications for current user
     */
    getAllNotifications: async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const url = queryParams ? `/notifications?${queryParams}` : '/notifications';
            const response = await apiHelper.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get unread notifications count
     */
    getUnreadCount: async () => {
        try {
            const response = await apiHelper.get('/notifications/unread/count');
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get unread notifications
     */
    getUnreadNotifications: async () => {
        try {
            const response = await apiHelper.get('/notifications/unread');
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Mark notification as read
     */
    markAsRead: async (notificationId) => {
        try {
            const response = await apiHelper.patch(`/notifications/${notificationId}/read`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Mark all notifications as read
     */
    markAllAsRead: async () => {
        try {
            const response = await apiHelper.patch('/notifications/read-all');
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Delete notification
     */
    deleteNotification: async (notificationId) => {
        try {
            const response = await apiHelper.delete(`/notifications/${notificationId}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Delete all notifications
     */
    deleteAllNotifications: async () => {
        try {
            const response = await apiHelper.delete('/notifications/all');
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Send notification (Admin)
     */
    sendNotification: async (notificationData) => {
        try {
            const response = await apiHelper.post('/notifications/send', notificationData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Send bulk notification (Admin)
     */
    sendBulkNotification: async (notificationData) => {
        try {
            const response = await apiHelper.post('/notifications/send-bulk', notificationData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get notification settings
     */
    getNotificationSettings: async () => {
        try {
            const response = await apiHelper.get('/notifications/settings');
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Update notification settings
     */
    updateNotificationSettings: async (settings) => {
        try {
            const response = await apiHelper.put('/notifications/settings', settings);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Send email notification (Admin)
     */
    sendEmailNotification: async (emailData) => {
        try {
            const response = await apiHelper.post('/notifications/email', emailData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Send reminder to absent employees (Admin)
     */
    sendAbsenteeReminder: async (date) => {
        try {
            const response = await apiHelper.post('/notifications/absent-reminder', { date });
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Send EOD reminder (Admin)
     */
    sendEODReminder: async () => {
        try {
            const response = await apiHelper.post('/notifications/eod-reminder');
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get notification history (Admin)
     */
    getNotificationHistory: async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const url = queryParams ? `/notifications/history?${queryParams}` : '/notifications/history';
            const response = await apiHelper.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
};

export default notificationService;