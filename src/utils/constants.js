// src/utils/constants.js

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// Session Configuration
export const SESSION_CONFIG = {
  TOKEN_KEY: 'auth_token',
  USER_KEY: 'user_data',
  TIMEOUT: 30 * 60 * 1000,
  WARNING_TIME: 5 * 60 * 1000,
  REFRESH_INTERVAL: 5 * 60 * 1000,
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
  MANAGER: 'manager',
};

// Employee Status
export const EMPLOYEE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ON_LEAVE: 'on_leave',
  TERMINATED: 'terminated',
};

// Attendance Status
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  HALF_DAY: 'half_day',
  LEAVE: 'leave',
  WFH: 'wfh',
  HOLIDAY: 'holiday',
  WEEK_OFF: 'week_off',
};

// Leave Types
export const LEAVE_TYPES = {
  CASUAL: 'casual',
  SICK: 'sick',
  VACATION: 'vacation',
  MATERNITY: 'maternity',
  PATERNITY: 'paternity',
  COMPENSATORY: 'compensatory',
};

// Annual Leave Balance
export const ANNUAL_LEAVE_BALANCE = {
  CASUAL: 12,
  SICK: 12,
  VACATION: 15,
};

// Leave Status
export const LEAVE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
};

// Task Status
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ON_HOLD: 'on_hold',
};

// Task Priority
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

// Departments
export const DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Finance',
  'Marketing',
  'Sales',
  'Operations',
  'Customer Support',
  'IT',
  'Legal',
  'Administration',
];

// Designations
export const DESIGNATIONS = [
  'Software Engineer',
  'Senior Software Engineer',
  'Tech Lead',
  'Engineering Manager',
  'HR Manager',
  'HR Executive',
  'Finance Manager',
  'Accountant',
  'Marketing Manager',
  'Sales Executive',
  'Customer Support Executive',
  'System Administrator',
  'Product Manager',
  'Designer',
  'QA Engineer',
];

// Work Shift
export const WORK_SHIFT = {
  START: '09:00',
  END: '18:00',
  LUNCH_START: '13:00',
  LUNCH_END: '14:00',
  HALF_DAY_HOURS: 4,
  FULL_DAY_HOURS: 8,
};

// Pagination
export const ITEMS_PER_PAGE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  DATETIME: 'MMM dd, yyyy hh:mm a',
  TIME: 'hh:mm a',
  FULL: 'EEEE, MMMM dd, yyyy',
};

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#4F46E5',
  SUCCESS: '#10B981',
  DANGER: '#EF4444',
  WARNING: '#F59E0B',
  INFO: '#3B82F6',
  PURPLE: '#8B5CF6',
  PINK: '#EC4899',
  TEAL: '#14B8A6',
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024,
  ALLOWED_TYPES: {
    IMAGES: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'],
    DOCUMENTS: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    ALL: [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
  },
};

// Notification Types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
};

// Export Formats
export const EXPORT_FORMATS = {
  CSV: 'csv',
  EXCEL: 'xlsx',
  PDF: 'pdf',
};

// Regex Patterns
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{10}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  EMPLOYEE_ID: /^EMP[0-9]{9}$/,
};

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid 10-digit phone number',
  INVALID_PASSWORD: 'Password must be at least 8 characters',
  PASSWORD_MISMATCH: 'Passwords do not match',
  MIN_LENGTH: (min) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max) => `Must not exceed ${max} characters`,
  INVALID_DATE: 'Please select a valid date',
  INVALID_FILE: 'Invalid file type or size',
  NETWORK_ERROR: 'Network error. Please check your connection',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  SERVER_ERROR: 'Server error. Please try again later',
  SESSION_EXPIRED: 'Your session has expired. Please login again',
  NOT_FOUND: 'The requested resource was not found',
  GENERIC_ERROR: 'Something went wrong. Please try again',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful',
  LOGOUT: 'Logout successful',
  CREATE: 'Created successfully',
  UPDATE: 'Updated successfully',
  DELETE: 'Deleted successfully',
  SAVE: 'Saved successfully',
  SUBMIT: 'Submitted successfully',
  UPLOAD: 'Uploaded successfully',
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logout successful!',
  DATA_SAVED: 'Data saved successfully!',
  DATA_DELETED: 'Data deleted successfully!',
  DATA_UPDATED: 'Data updated successfully!',
};

// Application Settings
export const APP_SETTINGS = {
  NAME: 'Office Attendance System',
  SHORT_NAME: 'OAS',
  VERSION: '1.0.0',
  DESCRIPTION: 'Comprehensive office attendance and management system',
  COMPANY_NAME: 'Your Company Name',
  SUPPORT_EMAIL: 'support@yourcompany.com',
  SUPPORT_PHONE: '+91-1234567890',
};

// Working Days
export const WORKING_DAYS = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY_FIRST: 6,
  SATURDAY_THIRD: 6,
  SUNDAY: 0,
};

// Salary Configuration
export const SALARY_CONFIG = {
  PER_DAY_DEDUCTION_FACTOR: 30,
  LATE_ARRIVAL_PENALTY: 500,
  EARLY_LEAVE_PENALTY: 500,
  OVERTIME_MULTIPLIER: 1.5,
};

// Performance Thresholds
export const PERFORMANCE_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 75,
  AVERAGE: 60,
  POOR: 0,
};

// Refresh Interval
export const REFRESH_INTERVAL = 5 * 60 * 1000;

// Toast Configuration
export const TOAST_CONFIG = {
  POSITION: 'top-right',
  AUTO_CLOSE: 3000,
  HIDE_PROGRESS_BAR: false,
  CLOSE_ON_CLICK: true,
  PAUSE_ON_HOVER: true,
  DRAGGABLE: true,
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    VERIFY_OTP: '/auth/verify-otp',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  EMPLOYEES: {
    GET_ALL: '/employees',
    GET_BY_ID: '/employees/:id',
    CREATE: '/employees',
    UPDATE: '/employees/:id',
    DELETE: '/employees/:id',
    EXPORT: '/employees/export',
  },
  ATTENDANCE: {
    GET_ALL: '/attendance',
    MARK: '/attendance/mark',
    CHECK_IN: '/attendance/check-in',
    CHECK_OUT: '/attendance/check-out',
    MONTHLY: '/attendance/monthly',
    EXPORT: '/attendance/export',
  },
  LEAVES: {
    GET_ALL: '/leaves',
    APPLY: '/leaves/apply',
    APPROVE: '/leaves/:id/approve',
    REJECT: '/leaves/:id/reject',
    CANCEL: '/leaves/:id/cancel',
    BALANCE: '/leaves/balance',
  },
  TASKS: {
    GET_ALL: '/tasks',
    CREATE: '/tasks',
    UPDATE: '/tasks/:id',
    DELETE: '/tasks/:id',
    ADD_COMMENT: '/tasks/:id/comments',
    UPDATE_STATUS: '/tasks/:id/status',
  },
};

// Storage Utility
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting ${key} from storage:`, error);
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key} in storage:`, error);
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
    }
  },
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};
