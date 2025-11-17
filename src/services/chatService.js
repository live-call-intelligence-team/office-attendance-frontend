// src/services/chatService.js

import api from './api';

const chatService = {
    // Group messages
    getGroupMessages: async () => {
        try {
            const response = await api.get('/chat/group');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    sendGroupMessage: async (data) => {
        try {
            const response = await api.post('/chat/group', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Private messages
    getPrivateMessages: async (userId) => {
        try {
            const response = await api.get(`/chat/private/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    sendPrivateMessage: async (userId, data) => {
        try {
            const response = await api.post(`/chat/private/${userId}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default chatService;