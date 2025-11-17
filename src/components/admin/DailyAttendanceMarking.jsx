// src/components/admin/DailyAttendanceMarking.jsx

import { useState, useEffect } from 'react';
import { FiCheck, FiX, FiClock, FiHome, FiFileText } from 'react-icons/fi';
import { ATTENDANCE_STATUS } from '../../utils/constants';
import { formatDate } from '../../utils/dateUtils';
import { getInitials } from '../../utils/helpers';

const DailyAttendanceMarking = ({
    date,
    employees = [],
    existingAttendance = [],
    onSave,
    loading = false
}) => {
    const [attendanceMap, setAttendanceMap] = useState({});
    const [selectAll, setSelectAll] = useState(null);

    // Initialize attendance map
    useEffect(() => {
        const initialMap = {};
        employees.forEach(emp => {
            const existing = existingAttendance.find(att => att.employeeId === emp._id);
            initialMap[emp._id] = existing?.status || null;
        });
        setAttendanceMap(initialMap);
    }, [employees, existingAttendance]);

    // Handle individual status change
    const handleStatusChange = (employeeId, status) => {
        setAttendanceMap(prev => ({
            ...prev,
            [employeeId]: prev[employeeId] === status ? null : status
        }));
    };

    // Handle select all
    const handleSelectAll = (status) => {
        if (selectAll === status) {
            // Deselect all
            const clearedMap = {};
            employees.forEach(emp => {
                clearedMap[emp._id] = null;
            });
            setAttendanceMap(clearedMap);
            setSelectAll(null);
        } else {
            // Select all with status
            const newMap = {};
            employees.forEach(emp => {
                newMap[emp._id] = status;
            });
            setAttendanceMap(newMap);
            setSelectAll(status);
        }
    };

    // Handle submit
    const handleSubmit = () => {
        const attendanceData = Object.entries(attendanceMap)
            .filter(([_, status]) => status !== null)
            .map(([employeeId, status]) => ({
                employeeId,
                status,
                date: date.toISOString().split('T')[0],
            }));

        onSave(attendanceData);
    };

    // Get count of each status
    const getStatusCount = (status) => {
        return Object.values(attendanceMap).filter(s => s === status).length;
    };

    const statusButtons = [
        {
            status: ATTENDANCE_STATUS.PRESENT,
            label: 'Present',
            icon: FiCheck,
            color: 'green',
            bgColor: 'bg-green-50',
            hoverColor: 'hover:bg-green-100',
            selectedColor: 'bg-green-500',
            textColor: 'text-green-700'
        },
        {
            status: ATTENDANCE_STATUS.ABSENT,
            label: 'Absent',
            icon: FiX,
            color: 'red',
            bgColor: 'bg-red-50',
            hoverColor: 'hover:bg-red-100',
            selectedColor: 'bg-red-500',
            textColor: 'text-red-700'
        },
        {
            status: ATTENDANCE_STATUS.HALF_DAY,
            label: 'Half Day',
            icon: FiClock,
            color: 'yellow',
            bgColor: 'bg-yellow-50',
            hoverColor: 'hover:bg-yellow-100',
            selectedColor: 'bg-yellow-500',
            textColor: 'text-yellow-700'
        },
        {
            status: ATTENDANCE_STATUS.LEAVE,
            label: 'Leave',
            icon: FiFileText,
            color: 'blue',
            bgColor: 'bg-blue-50',
            hoverColor: 'hover:bg-blue-100',
            selectedColor: 'bg-blue-500',
            textColor: 'text-blue-700'
        },
        {
            status: ATTENDANCE_STATUS.WFH,
            label: 'WFH',
            icon: FiHome,
            color: 'purple',
            bgColor: 'bg-purple-50',
            hoverColor: 'hover:bg-purple-100',
            selectedColor: 'bg-purple-500',
            textColor: 'text-purple-700'
        },
    ];

    if (employees.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <p className="text-gray-600">No employees found to mark attendance.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            {/* Header */}
            <div className="mb-6 pb-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Mark Attendance - {formatDate(date, 'MMMM dd, yyyy')}
                </h3>
                <p className="text-sm text-gray-600">
                    Select status for each employee. Click on status buttons to toggle.
                </p>
            </div>

            {/* Bulk Actions */}
            <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Quick Actions - Mark All As:</p>
                <div className="flex flex-wrap gap-2">
                    {statusButtons.map(({ status, label, icon: Icon, bgColor, hoverColor, selectedColor, textColor }) => (
                        <button
                            key={status}
                            onClick={() => handleSelectAll(status)}
                            className={`
                px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center
                ${selectAll === status ? `${selectedColor} text-white` : `${bgColor} ${textColor} ${hoverColor}`}
              `}
                        >
                            <Icon className="w-4 h-4 mr-2" />
                            {label}
                            {getStatusCount(status) > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-30 rounded-full text-xs">
                                    {getStatusCount(status)}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Employee List */}
            <div className="space-y-3 max-h-96 overflow-y-auto mb-6">
                {employees.map((employee) => {
                    const currentStatus = attendanceMap[employee._id];

                    return (
                        <div
                            key={employee._id}
                            className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                        >
                            <div className="flex items-center justify-between mb-3">
                                {/* Employee Info */}
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                                        {getInitials(employee.name)}
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                                        <p className="text-xs text-gray-500">{employee.employeeId} • {employee.department}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Status Buttons */}
                            <div className="flex flex-wrap gap-2">
                                {statusButtons.map(({ status, label, icon: Icon, selectedColor, bgColor, textColor }) => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusChange(employee._id, status)}
                                        className={`
                      px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center
                      ${currentStatus === status
                                                ? `${selectedColor} text-white shadow-md`
                                                : `${bgColor} ${textColor} hover:shadow-sm`}
                    `}
                                    >
                                        <Icon className="w-3 h-3 mr-1" />
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Summary */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {statusButtons.map(({ status, label, textColor }) => (
                        <div key={status} className="text-center">
                            <p className={`text-2xl font-bold ${textColor}`}>
                                {getStatusCount(status)}
                            </p>
                            <p className="text-xs text-gray-600">{label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={() => setAttendanceMap({})}
                    className="btn-secondary"
                    disabled={loading}
                >
                    Clear All
                </button>
                <button
                    onClick={handleSubmit}
                    className="btn-primary"
                    disabled={loading || Object.values(attendanceMap).every(s => s === null)}
                >
                    {loading ? (
                        <span className="flex items-center">
                            <div className="spinner mr-2"></div>
                            Saving...
                        </span>
                    ) : (
                        `Save Attendance (${Object.values(attendanceMap).filter(s => s !== null).length})`
                    )}
                </button>
            </div>
        </div>
    );
};

export default DailyAttendanceMarking;