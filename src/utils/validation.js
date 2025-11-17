// src/utils/validation.js

/**
 * Validate email format
 */
export const validateEmail = (email) => {
    const errors = [];

    if (!email || email.trim() === '') {
        errors.push('Email is required');
        return errors;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errors.push('Invalid email format');
    }

    return errors;
};

/**
 * Validate password
 */
export const validatePassword = (password) => {
    const errors = [];

    if (!password || password.trim() === '') {
        errors.push('Password is required');
        return errors;
    }

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*]/.test(password)) {
        errors.push('Password must contain at least one special character (!@#$%^&*)');
    }

    return errors;
};

/**
 * Validate phone number (Indian format)
 */
export const validatePhone = (phone) => {
    const errors = [];

    if (!phone || phone.trim() === '') {
        errors.push('Phone number is required');
        return errors;
    }

    // Remove spaces and dashes
    const cleanPhone = phone.replace(/[\s-]/g, '');

    // Indian phone number: 10 digits starting with 6-9
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
        errors.push('Invalid phone number. Must be 10 digits starting with 6-9');
    }

    return errors;
};

/**
 * Validate employee ID
 */
export const validateEmployeeId = (employeeId) => {
    const errors = [];

    if (!employeeId || employeeId.trim() === '') {
        errors.push('Employee ID is required');
        return errors;
    }

    // Employee ID format: EMP followed by 4-6 digits
    const empIdRegex = /^EMP\d{4,6}$/;
    if (!empIdRegex.test(employeeId.toUpperCase())) {
        errors.push('Invalid Employee ID format. Example: EMP1001');
    }

    return errors;
};

/**
 * Validate name
 */
export const validateName = (name, fieldName = 'Name') => {
    const errors = [];

    if (!name || name.trim() === '') {
        errors.push(`${fieldName} is required`);
        return errors;
    }

    if (name.trim().length < 2) {
        errors.push(`${fieldName} must be at least 2 characters long`);
    }

    if (name.trim().length > 50) {
        errors.push(`${fieldName} must not exceed 50 characters`);
    }

    // Only letters and spaces allowed
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
        errors.push(`${fieldName} must contain only letters and spaces`);
    }

    return errors;
};

/**
 * Validate salary
 */
export const validateSalary = (salary) => {
    const errors = [];

    if (!salary || salary === '') {
        errors.push('Salary is required');
        return errors;
    }

    const salaryNum = parseFloat(salary);

    if (isNaN(salaryNum)) {
        errors.push('Salary must be a valid number');
    } else if (salaryNum < 0) {
        errors.push('Salary cannot be negative');
    } else if (salaryNum < 10000) {
        errors.push('Salary must be at least ₹10,000');
    } else if (salaryNum > 10000000) {
        errors.push('Salary cannot exceed ₹1,00,00,000');
    }

    return errors;
};

/**
 * Validate date
 */
export const validateDate = (date, fieldName = 'Date') => {
    const errors = [];

    if (!date) {
        errors.push(`${fieldName} is required`);
        return errors;
    }

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
        errors.push(`Invalid ${fieldName.toLowerCase()}`);
    }

    return errors;
};

/**
 * Validate date range
 */
export const validateDateRange = (startDate, endDate) => {
    const errors = [];

    if (!startDate) {
        errors.push('Start date is required');
    }

    if (!endDate) {
        errors.push('End date is required');
    }

    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start > end) {
            errors.push('End date must be after start date');
        }
    }

    return errors;
};

/**
 * Validate leave application
 */
export const validateLeaveApplication = (leaveData) => {
    const errors = {};

    // Validate leave type
    if (!leaveData.leaveType || leaveData.leaveType === '') {
        errors.leaveType = 'Please select a leave type';
    }

    // Validate dates
    if (!leaveData.startDate) {
        errors.startDate = 'Start date is required';
    }

    if (!leaveData.endDate) {
        errors.endDate = 'End date is required';
    }

    if (leaveData.startDate && leaveData.endDate) {
        const start = new Date(leaveData.startDate);
        const end = new Date(leaveData.endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (start < today) {
            errors.startDate = 'Start date cannot be in the past';
        }

        if (start > end) {
            errors.endDate = 'End date must be after start date';
        }
    }

    // Validate reason
    if (!leaveData.reason || leaveData.reason.trim() === '') {
        errors.reason = 'Reason is required';
    } else if (leaveData.reason.trim().length < 10) {
        errors.reason = 'Reason must be at least 10 characters long';
    } else if (leaveData.reason.trim().length > 500) {
        errors.reason = 'Reason must not exceed 500 characters';
    }

    return errors;
};

/**
 * Validate task data
 */
export const validateTask = (taskData) => {
    const errors = {};

    // Validate title
    if (!taskData.title || taskData.title.trim() === '') {
        errors.title = 'Task title is required';
    } else if (taskData.title.trim().length < 5) {
        errors.title = 'Task title must be at least 5 characters long';
    } else if (taskData.title.trim().length > 100) {
        errors.title = 'Task title must not exceed 100 characters';
    }

    // Validate description
    if (!taskData.description || taskData.description.trim() === '') {
        errors.description = 'Task description is required';
    } else if (taskData.description.trim().length < 10) {
        errors.description = 'Task description must be at least 10 characters long';
    }

    // Validate priority
    if (!taskData.priority) {
        errors.priority = 'Please select a priority';
    }

    // Validate due date
    if (!taskData.dueDate) {
        errors.dueDate = 'Due date is required';
    } else {
        const dueDate = new Date(taskData.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dueDate < today) {
            errors.dueDate = 'Due date cannot be in the past';
        }
    }

    // Validate assigned to
    if (!taskData.assignedTo || taskData.assignedTo === '') {
        errors.assignedTo = 'Please select an employee';
    }

    return errors;
};

/**
 * Validate employee data
 */
export const validateEmployee = (employeeData) => {
    const errors = {};

    // Validate name
    const nameErrors = validateName(employeeData.name, 'Full name');
    if (nameErrors.length > 0) {
        errors.name = nameErrors[0];
    }

    // Validate email
    const emailErrors = validateEmail(employeeData.email);
    if (emailErrors.length > 0) {
        errors.email = emailErrors[0];
    }

    // Validate phone
    const phoneErrors = validatePhone(employeeData.phone);
    if (phoneErrors.length > 0) {
        errors.phone = phoneErrors[0];
    }

    // Validate employee ID
    if (employeeData.employeeId) {
        const empIdErrors = validateEmployeeId(employeeData.employeeId);
        if (empIdErrors.length > 0) {
            errors.employeeId = empIdErrors[0];
        }
    }

    // Validate department
    if (!employeeData.department || employeeData.department === '') {
        errors.department = 'Please select a department';
    }

    // Validate salary
    const salaryErrors = validateSalary(employeeData.salary);
    if (salaryErrors.length > 0) {
        errors.salary = salaryErrors[0];
    }

    // Validate joining date
    if (!employeeData.joiningDate) {
        errors.joiningDate = 'Joining date is required';
    }

    // Validate password (only for new employee)
    if (employeeData.isNew && employeeData.password) {
        const passwordErrors = validatePassword(employeeData.password);
        if (passwordErrors.length > 0) {
            errors.password = passwordErrors[0];
        }
    }

    return errors;
};

/**
 * Validate EOD report
 */
export const validateEODReport = (eodData) => {
    const errors = {};

    if (!eodData.summary || eodData.summary.trim() === '') {
        errors.summary = 'EOD summary is required';
    } else if (eodData.summary.trim().length < 20) {
        errors.summary = 'EOD summary must be at least 20 characters long';
    } else if (eodData.summary.trim().length > 1000) {
        errors.summary = 'EOD summary must not exceed 1000 characters';
    }

    if (!eodData.tasksCompleted || eodData.tasksCompleted.trim() === '') {
        errors.tasksCompleted = 'Please list completed tasks';
    }

    return errors;
};

/**
 * Validate file upload
 */
export const validateFileUpload = (file, maxSizeInMB = 5, allowedTypes = []) => {
    const errors = [];

    if (!file) {
        errors.push('Please select a file');
        return errors;
    }

    // Check file size
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
        errors.push(`File size must not exceed ${maxSizeInMB}MB`);
    }

    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        errors.push(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
    }

    return errors;
};

/**
 * Validate OTP
 */
export const validateOTP = (otp) => {
    const errors = [];

    if (!otp || otp.trim() === '') {
        errors.push('OTP is required');
        return errors;
    }

    if (!/^\d{6}$/.test(otp)) {
        errors.push('OTP must be 6 digits');
    }

    return errors;
};

/**
 * Check if form has errors
 */
export const hasErrors = (errors) => {
    if (Array.isArray(errors)) {
        return errors.length > 0;
    }
    return Object.keys(errors).length > 0;
};

/**
 * Get first error message
 */
export const getFirstError = (errors) => {
    if (Array.isArray(errors)) {
        return errors[0] || '';
    }
    const firstKey = Object.keys(errors)[0];
    return firstKey ? errors[firstKey] : '';
};

