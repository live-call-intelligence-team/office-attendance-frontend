// src/utils/publicHolidays.js

/**
 * Public Holidays for India (2025)
 * Adjust these dates according to your region
 */
export const publicHolidays2025 = [
    { date: '2025-01-26', name: 'Republic Day' },
    { date: '2025-03-14', name: 'Holi' },
    { date: '2025-03-31', name: 'Eid ul-Fitr' },
    { date: '2025-04-10', name: 'Mahavir Jayanti' },
    { date: '2025-04-14', name: 'Dr. Ambedkar Jayanti' },
    { date: '2025-04-18', name: 'Good Friday' },
    { date: '2025-05-01', name: 'May Day' },
    { date: '2025-05-12', name: 'Buddha Purnima' },
    { date: '2025-08-15', name: 'Independence Day' },
    { date: '2025-08-27', name: 'Janmashtami' },
    { date: '2025-10-02', name: 'Gandhi Jayanti' },
    { date: '2025-10-22', name: 'Dussehra' },
    { date: '2025-11-01', name: 'Diwali' },
    { date: '2025-11-05', name: 'Guru Nanak Jayanti' },
    { date: '2025-12-25', name: 'Christmas' },
];

/**
 * Public Holidays for India (2024)
 */
export const publicHolidays2024 = [
    { date: '2024-01-26', name: 'Republic Day' },
    { date: '2024-03-08', name: 'Maha Shivaratri' },
    { date: '2024-03-25', name: 'Holi' },
    { date: '2024-03-29', name: 'Good Friday' },
    { date: '2024-04-11', name: 'Eid ul-Fitr' },
    { date: '2024-04-17', name: 'Ram Navami' },
    { date: '2024-04-21', name: 'Mahavir Jayanti' },
    { date: '2024-05-01', name: 'May Day' },
    { date: '2024-05-23', name: 'Buddha Purnima' },
    { date: '2024-06-17', name: 'Eid ul-Adha' },
    { date: '2024-07-17', name: 'Muharram' },
    { date: '2024-08-15', name: 'Independence Day' },
    { date: '2024-08-26', name: 'Janmashtami' },
    { date: '2024-09-16', name: 'Milad un-Nabi' },
    { date: '2024-10-02', name: 'Gandhi Jayanti' },
    { date: '2024-10-12', name: 'Dussehra' },
    { date: '2024-10-31', name: 'Diwali' },
    { date: '2024-11-01', name: 'Diwali Holiday' },
    { date: '2024-11-15', name: 'Guru Nanak Jayanti' },
    { date: '2024-12-25', name: 'Christmas' },
];

/**
 * Get all public holidays for a specific year
 */
export const getPublicHolidays = (year) => {
    switch (year) {
        case 2024:
            return publicHolidays2024;
        case 2025:
            return publicHolidays2025;
        default:
            return [];
    }
};

/**
 * Check if a date is a public holiday
 */
export const isPublicHoliday = (date) => {
    const checkDate = new Date(date);
    const year = checkDate.getFullYear();
    const dateString = checkDate.toISOString().split('T')[0];

    const holidays = getPublicHolidays(year);
    return holidays.some(holiday => holiday.date === dateString);
};

/**
 * Get public holiday name for a date
 */
export const getPublicHolidayName = (date) => {
    const checkDate = new Date(date);
    const year = checkDate.getFullYear();
    const dateString = checkDate.toISOString().split('T')[0];

    const holidays = getPublicHolidays(year);
    const holiday = holidays.find(h => h.date === dateString);

    return holiday ? holiday.name : null;
};

/**
 * Get upcoming public holidays
 */
export const getUpcomingHolidays = (count = 5) => {
    const today = new Date();
    const year = today.getFullYear();
    const todayString = today.toISOString().split('T')[0];

    const holidays = getPublicHolidays(year);

    return holidays
        .filter(holiday => holiday.date >= todayString)
        .slice(0, count);
};

/**
 * Get public holidays in a month
 */
export const getPublicHolidaysInMonth = (year, month) => {
    const holidays = getPublicHolidays(year);

    return holidays.filter(holiday => {
        const holidayDate = new Date(holiday.date);
        return holidayDate.getMonth() === month;
    });
};

/**
 * Count public holidays between two dates
 */
export const countPublicHolidaysBetweenDates = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const year = start.getFullYear();

    const holidays = getPublicHolidays(year);

    return holidays.filter(holiday => {
        const holidayDate = new Date(holiday.date);
        return holidayDate >= start && holidayDate <= end;
    }).length;
};

/**
 * Add custom holiday (for admin to add company-specific holidays)
 */
let customHolidays = [];

export const addCustomHoliday = (date, name) => {
    const dateString = new Date(date).toISOString().split('T')[0];
    customHolidays.push({ date: dateString, name });
};

/**
 * Get all holidays including custom ones
 */
export const getAllHolidays = (year) => {
    const publicHols = getPublicHolidays(year);
    const customHols = customHolidays.filter(h => {
        const holidayYear = new Date(h.date).getFullYear();
        return holidayYear === year;
    });

    return [...publicHols, ...customHols].sort((a, b) =>
        new Date(a.date) - new Date(b.date)
    );
};

/**
 * Remove custom holiday
 */
export const removeCustomHoliday = (date) => {
    const dateString = new Date(date).toISOString().split('T')[0];
    customHolidays = customHolidays.filter(h => h.date !== dateString);
};

/**
 * Get custom holidays
 */
export const getCustomHolidays = () => {
    return customHolidays;
};

