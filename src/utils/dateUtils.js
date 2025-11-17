// src/utils/dateUtils.js

import { format, parseISO, isValid, differenceInDays, differenceInHours, differenceInMinutes, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, subDays, isSameDay, isWeekend, getDay } from 'date-fns';

/**
 * Format date to display format
 */
export const formatDate = (date, dateFormat = 'MMM dd, yyyy') => {
    if (!date) return '';
    try {
        const parsedDate = typeof date === 'string' ? parseISO(date) : date;
        return isValid(parsedDate) ? format(parsedDate, dateFormat) : '';
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
};

/**
 * Format date to API format (YYYY-MM-DD)
 */
export const formatDateForAPI = (date) => {
    if (!date) return '';
    try {
        const parsedDate = typeof date === 'string' ? parseISO(date) : date;
        return isValid(parsedDate) ? format(parsedDate, 'yyyy-MM-dd') : '';
    } catch (error) {
        console.error('Error formatting date for API:', error);
        return '';
    }
};

/**
 * Format time
 */
export const formatTime = (date, timeFormat = 'hh:mm a') => {
    if (!date) return '';
    try {
        const parsedDate = typeof date === 'string' ? parseISO(date) : date;
        return isValid(parsedDate) ? format(parsedDate, timeFormat) : '';
    } catch (error) {
        console.error('Error formatting time:', error);
        return '';
    }
};

/**
 * Format date and time
 */
export const formatDateTime = (date) => {
    if (!date) return '';
    return `${formatDate(date)} ${formatTime(date)}`;
};

/**
 * Get current date
 */
export const getCurrentDate = () => {
    return new Date();
};

/**
 * Get current month start and end dates
 */
export const getCurrentMonthDates = () => {
    const now = new Date();
    return {
        startDate: startOfMonth(now),
        endDate: endOfMonth(now),
    };
};

/**
 * Get current week start and end dates
 */
export const getCurrentWeekDates = () => {
    const now = new Date();
    return {
        startDate: startOfWeek(now, { weekStartsOn: 1 }), // Monday
        endDate: endOfWeek(now, { weekStartsOn: 1 }),
    };
};

/**
 * Calculate difference in days
 */
export const getDaysDifference = (startDate, endDate) => {
    try {
        const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
        const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
        return differenceInDays(end, start);
    } catch (error) {
        console.error('Error calculating days difference:', error);
        return 0;
    }
};

/**
 * Calculate working hours between two timestamps
 */
export const calculateWorkingHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    try {
        const start = typeof checkIn === 'string' ? parseISO(checkIn) : checkIn;
        const end = typeof checkOut === 'string' ? parseISO(checkOut) : checkOut;
        const hours = differenceInHours(end, start);
        const minutes = differenceInMinutes(end, start) % 60;
        return parseFloat((hours + minutes / 60).toFixed(2));
    } catch (error) {
        console.error('Error calculating working hours:', error);
        return 0;
    }
};

/**
 * Format duration in hours and minutes
 */
export const formatDuration = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
};

/**
 * Check if date is weekend (Saturday or Sunday)
 */
export const isWeekendDay = (date) => {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isWeekend(parsedDate);
};

/**
 * Check if date is Saturday
 */
export const isSaturday = (date) => {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return getDay(parsedDate) === 6;
};

/**
 * Check if date is Sunday
 */
export const isSunday = (date) => {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return getDay(parsedDate) === 0;
};

/**
 * Get week number of the month (1st, 2nd, 3rd, 4th, 5th)
 */
export const getWeekOfMonth = (date) => {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    const firstDayOfMonth = startOfMonth(parsedDate);
    const dayOfMonth = parsedDate.getDate();
    const firstDayWeekday = firstDayOfMonth.getDay();
    return Math.ceil((dayOfMonth + firstDayWeekday) / 7);
};

/**
 * Check if Saturday is working day (1st and 3rd Saturday working)
 */
export const isSaturdayWorkingDay = (date) => {
    if (!isSaturday(date)) return false;
    const weekNumber = getWeekOfMonth(date);
    return weekNumber === 1 || weekNumber === 3;
};

/**
 * Check if it's a week off (2nd, 4th Saturday or Sunday)
 */
export const isWeekOff = (date) => {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;

    if (isSunday(date)) return true;

    if (isSaturday(date)) {
        const weekNumber = getWeekOfMonth(date);
        return weekNumber === 2 || weekNumber === 4;
    }

    return false;
};

/**
 * Get all dates in a month
 */
export const getAllDatesInMonth = (year, month) => {
    const dates = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = endOfMonth(firstDay);

    let currentDay = firstDay;
    while (currentDay <= lastDay) {
        dates.push(new Date(currentDay));
        currentDay = addDays(currentDay, 1);
    }

    return dates;
};

/**
 * Get working days in a month (excluding week offs)
 */
export const getWorkingDaysInMonth = (year, month) => {
    const allDates = getAllDatesInMonth(year, month);
    return allDates.filter(date => !isWeekOff(date));
};

/**
 * Count working days between two dates
 */
export const countWorkingDays = (startDate, endDate) => {
    let count = 0;
    let currentDate = typeof startDate === 'string' ? parseISO(startDate) : new Date(startDate);
    const end = typeof endDate === 'string' ? parseISO(endDate) : new Date(endDate);

    while (currentDate <= end) {
        if (!isWeekOff(currentDate)) {
            count++;
        }
        currentDate = addDays(currentDate, 1);
    }

    return count;
};

/**
 * Get relative time (e.g., "2 hours ago", "yesterday")
 */
export const getRelativeTime = (date) => {
    if (!date) return '';

    const now = new Date();
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    const diffInMinutes = differenceInMinutes(now, parsedDate);

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;

    const diffInHours = differenceInHours(now, parsedDate);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

    const diffInDays = differenceInDays(now, parsedDate);
    if (diffInDays === 1) return 'yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) > 1 ? 's' : ''} ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} month${Math.floor(diffInDays / 30) > 1 ? 's' : ''} ago`;

    return `${Math.floor(diffInDays / 365)} year${Math.floor(diffInDays / 365) > 1 ? 's' : ''} ago`;
};

/**
 * Check if two dates are the same day
 */
export const isSameDate = (date1, date2) => {
    const parsed1 = typeof date1 === 'string' ? parseISO(date1) : date1;
    const parsed2 = typeof date2 === 'string' ? parseISO(date2) : date2;
    return isSameDay(parsed1, parsed2);
};

/**
 * Get month name
 */
export const getMonthName = (monthNumber) => {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNumber];
};

/**
 * Get day name
 */
export const getDayName = (date) => {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, 'EEEE');
};

