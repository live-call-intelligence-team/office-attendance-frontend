// src/components/employee/AttendanceView.jsx

import { FiCalendar } from 'react-icons/fi';
import {
    getAllDatesInMonth,
    getWeekOfMonth,
    isSaturday,
    isSunday,
    formatDate
} from '../../utils/dateUtils';
import { isPublicHoliday, getPublicHolidayName } from '../../utils/publicHolidays';
import { ATTENDANCE_STATUS } from '../../utils/constants';

const AttendanceView = ({ year, month, attendanceData = [] }) => {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dates = getAllDatesInMonth(year, month);
    const firstDayOfMonth = new Date(year, month, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const emptyCells = Array(startingDayOfWeek).fill(null);

    const isWorkingSaturday = (date) => {
        if (!isSaturday(date)) return false;
        const weekNumber = getWeekOfMonth(date);
        return weekNumber === 1 || weekNumber === 3;
    };

    const isWeekOff = (date) => {
        if (isSunday(date)) return true;
        if (isSaturday(date)) {
            const weekNumber = getWeekOfMonth(date);
            return weekNumber === 2 || weekNumber === 4 || weekNumber === 5;
        }
        return false;
    };

    const getAttendanceForDate = (date) => {
        const dateString = date.toISOString().split('T')[0];
        return attendanceData.find(att => {
            const attDate = new Date(att.date).toISOString().split('T')[0];
            return attDate === dateString;
        });
    };

    const getCellColor = (date) => {
        const attendance = getAttendanceForDate(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const cellDate = new Date(date);
        cellDate.setHours(0, 0, 0, 0);

        if (cellDate > today) return 'bg-gray-50 text-gray-400';
        if (isPublicHoliday(date)) return 'bg-orange-100 text-orange-800';
        if (isWeekOff(date)) return 'bg-gray-200 text-gray-600';

        if (attendance) {
            switch (attendance.status) {
                case ATTENDANCE_STATUS.PRESENT:
                    return 'bg-green-100 text-green-800';
                case ATTENDANCE_STATUS.ABSENT:
                    return 'bg-red-100 text-red-800';
                case ATTENDANCE_STATUS.HALF_DAY:
                    return 'bg-yellow-100 text-yellow-800';
                case ATTENDANCE_STATUS.LEAVE:
                    return 'bg-blue-100 text-blue-800';
                case ATTENDANCE_STATUS.WFH:
                    return 'bg-purple-100 text-purple-800';
                default:
                    return 'bg-white text-gray-900';
            }
        }

        return 'bg-white text-gray-900';
    };

    const getStatusBadge = (date) => {
        const attendance = getAttendanceForDate(date);

        if (isPublicHoliday(date)) {
            return <span className="text-xs font-medium">🎉</span>;
        }

        if (isWeekOff(date)) {
            return <span className="text-xs font-medium">Off</span>;
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

    const isToday = (date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <FiCalendar className="mr-2" />
                    {monthNames[month]} {year}
                </h3>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center text-xs">
                    <div className="w-3 h-3 bg-green-100 border border-green-300 rounded mr-1"></div>
                    <span className="text-gray-600">Present</span>
                </div>
                <div className="flex items-center text-xs">
                    <div className="w-3 h-3 bg-red-100 border border-red-300 rounded mr-1"></div>
                    <span className="text-gray-600">Absent</span>
                </div>
                <div className="flex items-center text-xs">
                    <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded mr-1"></div>
                    <span className="text-gray-600">Half Day</span>
                </div>
                <div className="flex items-center text-xs">
                    <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded mr-1"></div>
                    <span className="text-gray-600">Leave</span>
                </div>
                <div className="flex items-center text-xs">
                    <div className="w-3 h-3 bg-purple-100 border border-purple-300 rounded mr-1"></div>
                    <span className="text-gray-600">WFH</span>
                </div>
                <div className="flex items-center text-xs">
                    <div className="w-3 h-3 bg-orange-100 border border-orange-300 rounded mr-1"></div>
                    <span className="text-gray-600">Holiday</span>
                </div>
                <div className="flex items-center text-xs">
                    <div className="w-3 h-3 bg-gray-200 border border-gray-300 rounded mr-1"></div>
                    <span className="text-gray-600">Week Off</span>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
                {/* Day Headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center py-2 text-xs font-semibold text-gray-600">
                        {day}
                    </div>
                ))}

                {/* Empty cells */}
                {emptyCells.map((_, index) => (
                    <div key={`empty-${index}`} className="aspect-square"></div>
                ))}

                {/* Date cells */}
                {dates.map((date) => {
                    const cellColor = getCellColor(date);
                    const statusBadge = getStatusBadge(date);
                    const today = isToday(date);

                    return (
                        <div
                            key={date.toISOString()}
                            className={`
                aspect-square border rounded-lg p-2 flex flex-col items-center justify-center
                ${cellColor}
                ${today ? 'ring-2 ring-primary-500 font-bold' : ''}
              `}
                        >
                            <span className={`text-sm ${today ? 'text-base' : ''}`}>
                                {date.getDate()}
                            </span>
                            {statusBadge && (
                                <div className="mt-1">
                                    {statusBadge}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AttendanceView;