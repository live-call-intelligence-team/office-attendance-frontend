// src/utils/helpers.js

import { ATTENDANCE_STATUS, LEAVE_STATUS, TASK_STATUS } from './constants';

// Format currency
export const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0,
    }).format(amount);
};

// Get status color for badges
export const getStatusColor = (status) => {
    const statusColors = {
        // Attendance Status
        [ATTENDANCE_STATUS.PRESENT]: 'bg-green-100 text-green-800',
        [ATTENDANCE_STATUS.ABSENT]: 'bg-red-100 text-red-800',
        [ATTENDANCE_STATUS.HALF_DAY]: 'bg-yellow-100 text-yellow-800',
        [ATTENDANCE_STATUS.LEAVE]: 'bg-blue-100 text-blue-800',
        [ATTENDANCE_STATUS.WFH]: 'bg-purple-100 text-purple-800',

        // Leave Status
        [LEAVE_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
        [LEAVE_STATUS.APPROVED]: 'bg-green-100 text-green-800',
        [LEAVE_STATUS.REJECTED]: 'bg-red-100 text-red-800',

        // Task Status
        [TASK_STATUS.TODO]: 'bg-gray-100 text-gray-800',
        [TASK_STATUS.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
        [TASK_STATUS.COMPLETED]: 'bg-green-100 text-green-800',
        [TASK_STATUS.OVERDUE]: 'bg-red-100 text-red-800',

        // Employee Status
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-red-100 text-red-800',
        on_leave: 'bg-blue-100 text-blue-800',
    };

    return statusColors[status] || 'bg-gray-100 text-gray-800';
};

// Capitalize first letter
export const capitalizeFirst = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Capitalize all words
export const capitalizeWords = (str) => {
    if (!str) return '';
    return str
        .split(' ')
        .map(word => capitalizeFirst(word))
        .join(' ');
};

// Truncate text
export const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

// Get initials from name
export const getInitials = (name) => {
    if (!name) return 'NA';
    const parts = name.split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

// Generate random color
export const getRandomColor = () => {
    const colors = [
        'bg-red-500',
        'bg-blue-500',
        'bg-green-500',
        'bg-yellow-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-indigo-500',
        'bg-teal-500',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

// Parse error message from API
export const parseErrorMessage = (error) => {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }
    if (error.message) {
        return error.message;
    }
    return 'An unexpected error occurred';
};

// Check if date is today
export const isToday = (date) => {
    const today = new Date();
    const compareDate = new Date(date);

    return (
        today.getDate() === compareDate.getDate() &&
        today.getMonth() === compareDate.getMonth() &&
        today.getFullYear() === compareDate.getFullYear()
    );
};

// Check if date is in past
export const isPast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    return compareDate < today;
};

// Check if date is in future
export const isFuture = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    return compareDate > today;
};

// Calculate percentage
export const calculatePercentage = (value, total) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
};

// Format file size
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Validate email
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate phone
export const isValidPhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
};

// Generate employee ID
export const generateEmployeeId = () => {
    const prefix = 'EMP';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
};

// Sort array of objects
export const sortBy = (array, key, order = 'asc') => {
    return [...array].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];

        if (order === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });
};

// Group array by key
export const groupBy = (array, key) => {
    return array.reduce((result, item) => {
        const group = item[key];
        if (!result[group]) {
            result[group] = [];
        }
        result[group].push(item);
        return result;
    }, {});
};

// Debounce function
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Deep clone object
export const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

// Check if object is empty
export const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
};

// Generate unique ID
export const generateId = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
};

// Sleep function
export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

