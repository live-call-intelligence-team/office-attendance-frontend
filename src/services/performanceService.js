// src/services/performanceService.js

import api from './api';

const performanceService = {
    getEmployeePerformance: async (employeeId, month, year) => {
        try {
            const response = await api.get(`/performance/${employeeId}`, {
                params: { month, year }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getPerformanceHistory: async (employeeId) => {
        try {
            const response = await api.get(`/performance/${employeeId}/history`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default performanceService;