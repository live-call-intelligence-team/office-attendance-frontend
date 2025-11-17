// src/services/employeeService.js

import { apiHelper } from './api';

/**
 * Employee Service
 * Handles all employee management related API calls
 */

const employeeService = {
    /**
     * Get all employees (Admin only)
     */
    getAllEmployees: async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const url = queryParams ? `/employees?${queryParams}` : '/employees';
            const response = await apiHelper.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get employee by ID
     */
    getEmployeeById: async (employeeId) => {
        try {
            const response = await apiHelper.get(`/employees/${employeeId}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Create new employee (Admin only)
     */
    createEmployee: async (employeeData) => {
        try {
            const response = await apiHelper.post('/employees', employeeData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Update employee (Admin only)
     */
    updateEmployee: async (employeeId, employeeData) => {
        try {
            const response = await apiHelper.put(`/employees/${employeeId}`, employeeData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Delete employee (Admin only)
     */
    deleteEmployee: async (employeeId) => {
        try {
            const response = await apiHelper.delete(`/employees/${employeeId}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get employees by department
     */
    getEmployeesByDepartment: async (department) => {
        try {
            const response = await apiHelper.get(`/employees/department/${department}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Search employees
     */
    searchEmployees: async (searchTerm) => {
        try {
            const response = await apiHelper.get(`/employees/search?q=${searchTerm}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get employee statistics (Admin only)
     */
    getEmployeeStats: async () => {
        try {
            const response = await apiHelper.get('/employees/stats');
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Update employee status (Active/Inactive)
     */
    updateEmployeeStatus: async (employeeId, status) => {
        try {
            const response = await apiHelper.patch(`/employees/${employeeId}/status`, { status });
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get employee performance data
     */
    getEmployeePerformance: async (employeeId, filters = {}) => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const url = queryParams
                ? `/employees/${employeeId}/performance?${queryParams}`
                : `/employees/${employeeId}/performance`;
            const response = await apiHelper.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Bulk upload employees (Admin only)
     */
    bulkUploadEmployees: async (file, onUploadProgress) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await apiHelper.upload('/employees/bulk-upload', formData, onUploadProgress);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Export employees data
     */
    exportEmployees: async (format = 'csv') => {
        try {
            const response = await apiHelper.download(`/employees/export?format=${format}`, `employees.${format}`);
            return response;
        } catch (error) {
            throw error;
        }
    },
};

export default employeeService;