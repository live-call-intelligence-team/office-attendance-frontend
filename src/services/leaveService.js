// src/services/leaveService.js

import { apiHelper } from './api';

/**
 * Leave Service
 * Handles all leave management related API calls
 */

const leaveService = {
    /**
     * Apply for leave (Employee)
     */
    applyLeave: async (leaveData) => {
        try {
            const response = await apiHelper.post('/leaves', leaveData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get all leave applications (Admin can see all, Employee sees their own)
     */
    getAllLeaves: async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const url = queryParams ? `/leaves?${queryParams}` : '/leaves';
            const response = await apiHelper.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get leave by ID
     */
    getLeaveById: async (leaveId) => {
        try {
            const response = await apiHelper.get(`/leaves/${leaveId}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get employee's leave history
     */
    getEmployeeLeaves: async (employeeId) => {
        try {
            const response = await apiHelper.get(`/leaves/employee/${employeeId}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get pending leave requests (Admin)
     */
    getPendingLeaves: async () => {
        try {
            const response = await apiHelper.get('/leaves/pending');
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Approve leave (Admin)
     */
    approveLeave: async (leaveId, remarks = '') => {
        try {
            const response = await apiHelper.patch(`/leaves/${leaveId}/approve`, { remarks });
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Reject leave (Admin)
     */
    rejectLeave: async (leaveId, remarks) => {
        try {
            const response = await apiHelper.patch(`/leaves/${leaveId}/reject`, { remarks });
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Cancel leave (Employee can cancel their own pending leave)
     */
    cancelLeave: async (leaveId) => {
        try {
            const response = await apiHelper.patch(`/leaves/${leaveId}/cancel`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get leave balance for employee
     */
    getLeaveBalance: async (employeeId) => {
        try {
            const response = await apiHelper.get(`/leaves/employee/${employeeId}/balance`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get leave statistics (Admin)
     */
    getLeaveStats: async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const url = queryParams ? `/leaves/stats?${queryParams}` : '/leaves/stats';
            const response = await apiHelper.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get leave calendar (shows all approved leaves)
     */
    getLeaveCalendar: async (year, month) => {
        try {
            const params = { year, month };
            const queryParams = new URLSearchParams(params).toString();
            const response = await apiHelper.get(`/leaves/calendar?${queryParams}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Update leave application (before approval)
     */
    updateLeave: async (leaveId, leaveData) => {
        try {
            const response = await apiHelper.put(`/leaves/${leaveId}`, leaveData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Check leave eligibility
     */
    checkLeaveEligibility: async (leaveType, startDate, endDate) => {
        try {
            const params = { leaveType, startDate, endDate };
            const queryParams = new URLSearchParams(params).toString();
            const response = await apiHelper.get(`/leaves/check-eligibility?${queryParams}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Export leave data
     */
    exportLeaves: async (startDate, endDate, format = 'csv') => {
        try {
            const response = await apiHelper.download(
                `/leaves/export?startDate=${startDate}&endDate=${endDate}&format=${format}`,
                `leaves_${startDate}_to_${endDate}.${format}`
            );
            return response;
        } catch (error) {
            throw error;
        }
    },
};

export default leaveService;