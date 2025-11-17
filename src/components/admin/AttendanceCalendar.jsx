// src/components/admin/AttendanceCalendar.jsx

import { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi';
import {
    getAllDatesInMonth,
    getWeekOfMonth,
    isSaturday,
    isSunday,
    getDayName,
    formatDate
} from '../../utils/dateUtils';
import { isPublicHoliday, getPublicHolidayName } from '../../utils/publicHolidays';
import { ATTENDANCE_STATUS } from '../../utils/constants';
import { getStatusColor } from '../../utils/helpers';

const AttendanceCalendar = ({
    year,
    month,
    attendanceData = [],
    onDateClick,
    selectedDate
}) => {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Get all dates in the month
    const dates = getAllDatesInMonth(year, month);

    // Get the first day of the month to calculate offset
    const firstDayOfMonth = new Date(year, month, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 6 = Saturday

    // Calculate empty cells before the first date
    const emptyCells = Array(startingDayOfWeek).fill(null);

    // Check if date is a working Saturday (1st and 3rd)
    const isWorkingSaturday = (date) => {
        if (!isSaturday(date)) return false;
        const weekNumber = getWeekOfMonth(date);
        return weekNumber === 1 || weekNumber === 3;
    };

    // Check if date is week off (2nd, 4th Saturday or Sunday)
    const isWeekOff = (date) => {
        if (isSunday(date)) return true;
        if (isSaturday(date)) {
            const weekNumber = getWeekOfMonth(date);
            return weekNumber === 2 || weekNumber === 4 || weekNumber === 5;
        }
        return false;
    };

    // Get attendance status for a date
    const getAttendanceForDate = (date) => {
        const dateString = date.toISOString().split('T')[0];
        return attendanceData.find(att => {
            const attDate = new Date(att.date).toISOString().split('T')[0];
            return attDate === dateString;
        });
    };

    // Get cell background color based on status
    const getCellColor = (date) => {
        const attendance = getAttendanceForDate(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const cellDate = new Date(date);
        cellDate.setHours(0, 0, 0, 0);

        // Future dates
        if (cellDate > today) {
            return 'bg-gray-50 text-gray-400';
        }

        // Check public holiday first
        if (isPublicHoliday(date)) {
            return 'bg-orange-100 text-orange-800 border-orange-300';
        }

        // Check week off
        if (isWeekOff(date)) {
            return 'bg-gray-200 text-gray-600';
        }

        // Check attendance status
        if (attendance) {
            switch (attendance.status) {
                case ATTENDANCE_STATUS.PRESENT:
                    return 'bg-green-100 text-green-800 border-green-300';
                case ATTENDANCE_STATUS.ABSENT:
                    return 'bg-red-100 text-red-800 border-red-300';
                case ATTENDANCE_STATUS.HALF_DAY:
                    return 'bg-yellow-100 text-yellow-800 border-yellow-300';
                case ATTENDANCE_STATUS.LEAVE:
                    return 'bg-blue-100 text-blue-800 border-blue-300';
                case ATTENDANCE_STATUS.WFH:
                    return 'bg-purple-100 text-purple-800 border-purple-300';
                default:
                    return 'bg-white text-gray-900';
            }
        }

        // No attendance marked for past/today
        return 'bg-white text-gray-900 border-gray-300';
    };

    // Get status badge for a date
    const getStatusBadge = (date) => {
        const attendance = getAttendanceForDate(date);

        if (isPublicHoliday(date)) {
            const holidayName = getPublicHolidayName(date);
            return (
                <span className="text-xs font-medium">
                    🎉 {holidayName?.split(' ')[0]}
                </span>
            );
        }

        if (isWeekOff(date)) {
            return <span className="text-xs font-medium">Week Off</span>;
        }

        if (attendance) {
            const statusLabels = {
                [ATTENDANCE_STATUS.PRESENT]: 'P',
                [ATTENDANCE_STATUS.ABSENT]: 'A',
                [ATTENDANCE_STATUS.HALF_DAY]: 'HD',
                [ATTENDANCE_STATUS.LEAVE]: 'L',
                [ATTENDANCE_STATUS.WFH]: 'WFH',
            };
            return (
                <span className="text-xs font-bold">
                    {statusLabels[attendance.status] || '-'}
                </span>
            );
        }

        return null;
    };

    // Check if date is selected
    const isSelected = (date) => {
        if (!selectedDate) return false;
        return date.toDateString() === selectedDate.toDateString();
    };

    // Check if date is today
    const isToday = (date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <FiCalendar className="mr-2" />
                    {monthNames[month]} {year}
                </h3>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-100 border border-green-300 rounded mr-2"></div>
                    <span className="text-xs text-gray-600">Present</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-100 border border-red-300 rounded mr-2"></div>
                    <span className="text-xs text-gray-600">Absent</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded mr-2"></div>
                    <span className="text-xs text-gray-600">Half Day</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded mr-2"></div>
                    <span className="text-xs text-gray-600">Leave</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded mr-2"></div>
                    <span className="text-xs text-gray-600">WFH</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded mr-2"></div>
                    <span className="text-xs text-gray-600">Holiday</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded mr-2"></div>
                    <span className="text-xs text-gray-600">Week Off</span>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
                {/* Day Headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center py-2 text-sm font-semibold text-gray-600">
                        {day}
                    </div>
                ))}

                {/* Empty cells before first day */}
                {emptyCells.map((_, index) => (
                    <div key={`empty-${index}`} className="aspect-square"></div>
                ))}

                {/* Date cells */}
                {dates.map((date) => {
                    const cellColor = getCellColor(date);
                    const statusBadge = getStatusBadge(date);
                    const selected = isSelected(date);
                    const today = isToday(date);

                    return (
                        <button
                            key={date.toISOString()}
                            onClick={() => onDateClick(date)}
                            className={`
                aspect-square border-2 rounded-lg p-2 flex flex-col items-center justify-center
                transition-all duration-200 hover:shadow-md
                ${cellColor}
                ${selected ? 'ring-2 ring-primary-500 ring-offset-2' : ''}
                ${today ? 'font-bold' : ''}
                disabled:cursor-not-allowed disabled:opacity-50
              `}
                            disabled={date > new Date()}
                        >
                            <span className={`text-sm ${today ? 'text-lg' : ''}`}>
                                {date.getDate()}
                            </span>
                            {statusBadge && (
                                <div className="mt-1">
                                    {statusBadge}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Info */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                    Click on any date to mark/view attendance.
                    <span className="font-medium"> 1st & 3rd Saturdays</span> are working days.
                </p>
            </div>
        </div>
    );
};

export default AttendanceCalendar;