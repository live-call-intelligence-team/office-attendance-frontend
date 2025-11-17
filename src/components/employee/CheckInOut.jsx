// src/components/employee/CheckInOut.jsx

import { useState, useEffect } from 'react';
import { FiClock, FiLogIn, FiLogOut, FiCalendar } from 'react-icons/fi';
import { formatTime, calculateWorkingHours, formatDuration } from '../../utils/dateUtils';
import { toast } from 'react-toastify';

const CheckInOut = ({ todayAttendance, onCheckIn, onCheckOut, loading }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [workingHours, setWorkingHours] = useState(0);

    // Update current time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Calculate working hours
    useEffect(() => {
        if (todayAttendance?.checkIn && !todayAttendance?.checkOut) {
            const hours = calculateWorkingHours(todayAttendance.checkIn, new Date());
            setWorkingHours(hours);
        } else if (todayAttendance?.checkIn && todayAttendance?.checkOut) {
            const hours = calculateWorkingHours(todayAttendance.checkIn, todayAttendance.checkOut);
            setWorkingHours(hours);
        }
    }, [currentTime, todayAttendance]);

    const hasCheckedIn = todayAttendance?.checkIn;
    const hasCheckedOut = todayAttendance?.checkOut;

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const getStatusColor = () => {
        if (!hasCheckedIn) return 'text-gray-600';
        if (!hasCheckedOut) return 'text-green-600';
        return 'text-blue-600';
    };

    const getStatusText = () => {
        if (!hasCheckedIn) return 'Not Checked In';
        if (!hasCheckedOut) return 'Currently Working';
        return 'Checked Out';
    };

    return (
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl shadow-lg p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                {/* Left Section */}
                <div className="mb-6 md:mb-0">
                    <h2 className="text-3xl font-bold mb-2">{getGreeting()}!</h2>
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center">
                            <FiClock className="w-5 h-5 mr-2" />
                            <span className="text-xl font-semibold">
                                {formatTime(currentTime, 'hh:mm:ss a')}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <FiCalendar className="w-5 h-5 mr-2" />
                            <span className="text-sm">
                                {currentTime.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>
                    <div className={`text-lg font-semibold ${getStatusColor()}`}>
                        Status: {getStatusText()}
                    </div>
                </div>

                {/* Right Section - Check In/Out Buttons */}
                <div className="flex flex-col space-y-4">
                    {!hasCheckedIn ? (
                        <button
                            onClick={onCheckIn}
                            disabled={loading}
                            className="bg-white text-primary-600 hover:bg-primary-50 font-semibold py-4 px-8 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center min-w-[200px]"
                        >
                            {loading ? (
                                <>
                                    <div className="spinner border-primary-600 mr-2"></div>
                                    Checking In...
                                </>
                            ) : (
                                <>
                                    <FiLogIn className="w-5 h-5 mr-2" />
                                    Check In
                                </>
                            )}
                        </button>
                    ) : !hasCheckedOut ? (
                        <button
                            onClick={onCheckOut}
                            disabled={loading}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-8 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center min-w-[200px]"
                        >
                            {loading ? (
                                <>
                                    <div className="spinner mr-2"></div>
                                    Checking Out...
                                </>
                            ) : (
                                <>
                                    <FiLogOut className="w-5 h-5 mr-2" />
                                    Check Out
                                </>
                            )}
                        </button>
                    ) : (
                        <div className="bg-white bg-opacity-20 py-4 px-8 rounded-lg text-center min-w-[200px]">
                            <p className="font-semibold">Day Completed</p>
                            <p className="text-sm mt-1">See you tomorrow!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Time Details */}
            {hasCheckedIn && (
                <div className="mt-6 pt-6 border-t border-white border-opacity-30">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Check In Time */}
                        <div className="bg-white bg-opacity-20 rounded-lg p-4">
                            <p className="text-sm text-primary-100 mb-1">Check-In Time</p>
                            <p className="text-xl font-bold">
                                {formatTime(todayAttendance.checkIn, 'hh:mm a')}
                            </p>
                        </div>

                        {/* Check Out Time */}
                        <div className="bg-white bg-opacity-20 rounded-lg p-4">
                            <p className="text-sm text-primary-100 mb-1">Check-Out Time</p>
                            <p className="text-xl font-bold">
                                {hasCheckedOut
                                    ? formatTime(todayAttendance.checkOut, 'hh:mm a')
                                    : '-- : --'}
                            </p>
                        </div>

                        {/* Working Hours */}
                        <div className="bg-white bg-opacity-20 rounded-lg p-4">
                            <p className="text-sm text-primary-100 mb-1">
                                {hasCheckedOut ? 'Total Hours' : 'Hours So Far'}
                            </p>
                            <p className="text-xl font-bold">
                                {workingHours > 0 ? `${workingHours.toFixed(2)} hrs` : '0 hrs'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckInOut;