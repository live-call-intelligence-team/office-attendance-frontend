// src/services/analyticsService.js

import { apiHelper } from './api';

/**
 * Analytics Service
 * Handles all analytics and reporting related API calls
 */

const analyticsService = {
    /**
     * Get dashboard overview (Admin)
     */
    getDashboardOverview: async () => {
        try {
            const response = await apiHelper.get('/analytics/dashboard');
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get attendance analytics
     */
    getAttendanceAnalytics: async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const url = queryParams ? `/analytics/attendance?${queryParams}` : '/analytics/attendance';
            const response = await apiHelper.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get work/task analytics
     */
    getWorkAnalytics: async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const url = queryParams ? `/analytics/work?${queryParams}` : '/analytics/work';
            const response = await apiHelper.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get leave analytics
     */
    getLeaveAnalytics: async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const url = queryParams ? `/analytics/leaves?${queryParams}` : '/analytics/leaves';
            const response = await apiHelper.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get employee performance analytics
     */
    getEmployeePerformanceAnalytics: async (employeeId, period = 'month') => {
        try {
            const params = { period };
            const queryParams = new URLSearchParams(params).toString();
            const response = await apiHelper.get(`/analytics/employee/${employeeId}/performance?${queryParams}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get department-wise analytics
     */
    getDepartmentAnalytics: async (department = null) => {
        try {
            const url = department
                ? `/analytics/departments/${department}`
                : '/analytics/departments';
            const response = await apiHelper.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get productivity metrics
     */
    getProductivityMetrics: async (startDate, endDate) => {
        try {
            const params = { startDate, endDate };
            const queryParams = new URLSearchParams(params).toString();
            const response = await apiHelper.get(`/analytics/productivity?${queryParams}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get attendance trends
     */
    getAttendanceTrends: async (period = 'month', employeeId = null) => {
        try {
            const params = {
                period,
                ...(employeeId && { employeeId })
            };
            const queryParams = new URLSearchParams(params).toString();
            const response = await apiHelper.get(`/analytics/attendance/trends?${queryParams}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get task completion trends
     */
    getTaskCompletionTrends: async (period = 'month') => {
        try {
            const params = { period };
            const queryParams = new URLSearchParams(params).toString();
            const response = await apiHelper.get(`/analytics/tasks/trends?${queryParams}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get top performers
     */
    getTopPerformers: async (metric = 'overall', limit = 5) => {
        try {
            const params = { metric, limit };
            const queryParams = new URLSearchParams(params).toString();
            const response = await apiHelper.get(`/analytics/top-performers?${queryParams}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get employees with low performance
     */
    getLowPerformers: async (threshold = 60, limit = 5) => {
        try {
            const params = { threshold, limit };
            const queryParams = new URLSearchParams(params).toString();
            const response = await apiHelper.get(`/analytics/low-performers?${queryParams}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get working hours analytics
     */
    getWorkingHoursAnalytics: async (startDate, endDate, employeeId = null) => {
        try {
            const params = {
                startDate,
                endDate,
                ...(employeeId && { employeeId })
            };
            const queryParams = new URLSearchParams(params).toString();
            const response = await apiHelper.get(`/analytics/working-hours?${queryParams}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get EOD submission analytics
     */
    getEODAnalytics: async (startDate, endDate) => {
        try {
            const params = { startDate, endDate };
            const queryParams = new URLSearchParams(params).toString();
            const response = await apiHelper.get(`/analytics/eod?${queryParams}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get monthly comparison report
     */
    getMonthlyComparison: async (month1, year1, month2, year2) => {
        try {
            const params = { month1, year1, month2, year2 };
            const queryParams = new URLSearchParams(params).toString();
            const response = await apiHelper.get(`/analytics/monthly-comparison?${queryParams}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get real-time analytics
     */
    getRealTimeAnalytics: async () => {
        try {
            const response = await apiHelper.get('/analytics/realtime');
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get custom report
     */
    getCustomReport: async (reportConfig) => {
        try {
            const response = await apiHelper.post('/analytics/custom-report', reportConfig);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Export analytics data
     */
    exportAnalytics: async (reportType, filters = {}, format = 'pdf') => {
        try {
            const params = { ...filters, format };
            const queryParams = new URLSearchParams(params).toString();
            const response = await apiHelper.download(
                `/analytics/${reportType}/export?${queryParams}`,
                `${reportType}_report.${format}`
            );
            return response;
        } catch (error) {
            throw error;
        }
    },
};

export default analyticsService;