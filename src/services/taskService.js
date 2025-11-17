// src/services/taskService.js

import { apiHelper } from './api';

/**
 * Task Service
 * Handles all task/work assignment related API calls
 */

const taskService = {
    /**
     * Get all tasks (Admin sees all, Employee sees assigned tasks)
     */
    getAllTasks: async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const url = queryParams ? `/tasks?${queryParams}` : '/tasks';
            const response = await apiHelper.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get task by ID
     */
    getTaskById: async (taskId) => {
        try {
            const response = await apiHelper.get(`/tasks/${taskId}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Create new task (Admin assigns to employee)
     */
    createTask: async (taskData) => {
        try {
            const response = await apiHelper.post('/tasks', taskData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Update task
     */
    updateTask: async (taskId, taskData) => {
        try {
            const response = await apiHelper.put(`/tasks/${taskId}`, taskData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Delete task
     */
    deleteTask: async (taskId) => {
        try {
            const response = await apiHelper.delete(`/tasks/${taskId}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get tasks assigned to specific employee
     */
    getEmployeeTasks: async (employeeId, filters = {}) => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const url = queryParams
                ? `/tasks/employee/${employeeId}?${queryParams}`
                : `/tasks/employee/${employeeId}`;
            const response = await apiHelper.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Update task status (Employee updates their task status)
     */
    updateTaskStatus: async (taskId, status) => {
        try {
            const response = await apiHelper.patch(`/tasks/${taskId}/status`, { status });
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Update task priority
     */
    updateTaskPriority: async (taskId, priority) => {
        try {
            const response = await apiHelper.patch(`/tasks/${taskId}/priority`, { priority });
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Add comment to task
     */
    addTaskComment: async (taskId, comment) => {
        try {
            const response = await apiHelper.post(`/tasks/${taskId}/comments`, { comment });
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get task comments
     */
    getTaskComments: async (taskId) => {
        try {
            const response = await apiHelper.get(`/tasks/${taskId}/comments`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Upload task attachment
     */
    uploadTaskAttachment: async (taskId, file, onUploadProgress) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await apiHelper.upload(
                `/tasks/${taskId}/attachments`,
                formData,
                onUploadProgress
            );
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get task attachments
     */
    getTaskAttachments: async (taskId) => {
        try {
            const response = await apiHelper.get(`/tasks/${taskId}/attachments`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Delete task attachment
     */
    deleteTaskAttachment: async (taskId, attachmentId) => {
        try {
            const response = await apiHelper.delete(`/tasks/${taskId}/attachments/${attachmentId}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get overdue tasks
     */
    getOverdueTasks: async () => {
        try {
            const response = await apiHelper.get('/tasks/overdue');
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get today's tasks
     */
    getTodayTasks: async () => {
        try {
            const response = await apiHelper.get('/tasks/today');
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get task statistics (Admin)
     */
    getTaskStats: async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const url = queryParams ? `/tasks/stats?${queryParams}` : '/tasks/stats';
            const response = await apiHelper.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get employee task performance
     */
    getEmployeeTaskPerformance: async (employeeId, startDate, endDate) => {
        try {
            const params = { startDate, endDate };
            const queryParams = new URLSearchParams(params).toString();
            const response = await apiHelper.get(`/tasks/employee/${employeeId}/performance?${queryParams}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Bulk assign tasks
     */
    bulkAssignTasks: async (tasksArray) => {
        try {
            const response = await apiHelper.post('/tasks/bulk-assign', { tasks: tasksArray });
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Reassign task to another employee
     */
    reassignTask: async (taskId, newEmployeeId) => {
        try {
            const response = await apiHelper.patch(`/tasks/${taskId}/reassign`, { employeeId: newEmployeeId });
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Mark task as completed
     */
    markTaskCompleted: async (taskId, completionNotes = '') => {
        try {
            const response = await apiHelper.patch(`/tasks/${taskId}/complete`, { notes: completionNotes });
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get task completion rate
     */
    getTaskCompletionRate: async (employeeId, period = 'month') => {
        try {
            const params = { period };
            const queryParams = new URLSearchParams(params).toString();
            const response = await apiHelper.get(`/tasks/employee/${employeeId}/completion-rate?${queryParams}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Export tasks
     */
    exportTasks: async (startDate, endDate, format = 'csv') => {
        try {
            const response = await apiHelper.download(
                `/tasks/export?startDate=${startDate}&endDate=${endDate}&format=${format}`,
                `tasks_${startDate}_to_${endDate}.${format}`
            );
            return response;
        } catch (error) {
            throw error;
        }
    },
};

export default taskService;