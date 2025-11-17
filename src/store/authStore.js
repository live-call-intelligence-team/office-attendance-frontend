// src/store/authStore.js

import { create } from 'zustand';
import authService from '../services/authService';

/**
 * Auth Store using Zustand
 * Alternative to Context API for global state management
 */
const useAuthStore = create((set, get) => ({
    user: authService.getUserData(),
    token: authService.getToken(),
    isAuthenticated: authService.isAuthenticated(),

    // Set user
    setUser: (user) => set({ user, isAuthenticated: true }),

    // Set token
    setToken: (token) => set({ token }),

    // Clear auth (logout)
    clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),

    // Get user role
    getUserRole: () => get().user?.role || null,

    // Check if admin
    isAdmin: () => get().user?.role === 'ADMIN',

    // Check if employee
    isEmployee: () => get().user?.role === 'EMPLOYEE',
}));

export default useAuthStore;