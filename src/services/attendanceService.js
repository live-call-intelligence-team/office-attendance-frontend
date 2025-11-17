// src/services/attendanceService.js

import { apiHelper } from './api';

/**
 * Attendance Service
 * Handles all attendance related API calls
 */

const attendanceService = {
    /**
     * Mark attendance (Admin marks for employee)
     */
    markAttendance: async (attendanceData) => {
        try {
            const response = await apiHelper.post('/attendance', attendanceData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Employee check-in
     */
    checkIn: async () => {
        try {
            const response = await apiHelper.post('/attendance/check-in');
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Employee check-out
     */
    checkOut: async () => {
        try {
            const response = await apiHelper.post('/attendance/check-out');
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get attendance by date range
     */
    getAttendanceByDateRange: async (startDate, endDate, employeeId = null) => {
        try {
            const params = {
                startDate,
                endDate,
                ...(employeeId && { employeeId }),
            };
            const queryParams = new URLSearchParams(params).toString();
            const response = await apiHelper.get(`/attendance?${queryParams}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get attendance for specific month
     */
    getMonthlyAttendance: async (year, month, employeeId = null) => {
        try {
            const params = {
                year,
                month,
                ...(employeeId && { employeeId }),
            };
            const queryParams = new URLSearchParams(params).toString();
            const response = await apiHelper.get(`/attendance/monthly?${queryParams}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get today's attendance
     */
    getTodayAttendance: async () => {
        try {
            const response = await apiHelper.get('/attendance/today');
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get employee attendance summary
     */
    getEmployeeAttendanceSummary: async (employeeId, year, month) => {
        try {
            const params = { year, month };
            const queryParams = new URLSearchParams(params).toString();
            const response = await apiHelper.get(`/attendance/employee/${employeeId}/summary?${queryParams}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Update attendance
     */
    updateAttendance: async (attendanceId, attendanceData) => {
        try {
            const response = await apiHelper.put(`/attendance/${attendanceId}`, attendanceData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Delete attendance record
     */
    deleteAttendance: async (attendanceId) => {
        try {
            const response = await apiHelper.delete(`/attendance/${attendanceId}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get attendance statistics (Admin)
     */
    getAttendanceStats: async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const url = queryParams ? `/attendance/stats?${queryParams}` : '/attendance/stats';
            const response = await apiHelper.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get employees with low attendance
     */
    getLowAttendanceEmployees: async (threshold = 85, month, year) => {
        try {
            const params = { threshold, month, year };
            const queryParams = new URLSearchParams(params).toString();
            const response = await apiHelper.get(`/attendance/low-attendance?${queryParams}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get absent employees for today
     */
    getTodayAbsentEmployees: async () => {
        try {
            const response = await apiHelper.get('/attendance/today/absent');
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Bulk mark attendance
     */
    bulkMarkAttendance: async (attendanceArray) => {
        try {
            const response = await apiHelper.post('/attendance/bulk', { attendances: attendanceArray });
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get working hours for employee
     */
    getWorkingHours: async (employeeId, startDate, endDate) => {
        try {
            const params = { startDate, endDate };
            const queryParams = new URLSearchParams(params).toString();
            const response = await apiHelper.get(`/attendance/employee/${employeeId}/working-hours?${queryParams}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Export attendance data
     */
    exportAttendance: async (startDate, endDate, format = 'csv') => {
        try {
            const response = await apiHelper.download(
                `/attendance/export?startDate=${startDate}&endDate=${endDate}&format=${format}`,
                `attendance_${startDate}_to_${endDate}.${format}`
            );
            return response;
        } catch (error) {
            throw error;
        }
    },
};

export default attendanceService;