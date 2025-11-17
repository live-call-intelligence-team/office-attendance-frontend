// src/services/announcementService.js

import api from './api';

const announcementService = {
    // Announcements
    getAllAnnouncements: async () => {
        try {
            const response = await api.get('/announcements');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getEmployeeAnnouncements: async () => {
        try {
            const response = await api.get('/announcements/employee');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createAnnouncement: async (data) => {
        try {
            const response = await api.post('/announcements', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteAnnouncement: async (id) => {
        try {
            const response = await api.delete(`/announcements/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Polls
    getAllPolls: async () => {
        try {
            const response = await api.get('/polls');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getEmployeePolls: async () => {
        try {
            const response = await api.get('/polls/employee');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createPoll: async (data) => {
        try {
            const response = await api.post('/polls', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    votePoll: async (pollId, optionIds) => {
        try {
            const response = await api.post(`/polls/${pollId}/vote`, { optionIds });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deletePoll: async (id) => {
        try {
            const response = await api.delete(`/polls/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default announcementService;