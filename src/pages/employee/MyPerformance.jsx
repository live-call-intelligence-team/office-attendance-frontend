// src/pages/employee/MyPerformance.jsx

import { useState, useEffect } from 'react';
import { FiTrendingUp, FiDollarSign, FiCalendar, FiClock, FiAward } from 'react-icons/fi';
import { toast } from 'react-toastify';
import PerformanceChart from '../../components/employee/PerformanceChart';
import performanceService from '../../services/performanceService';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/helpers';

const MyPerformance = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const [performanceData, setPerformanceData] = useState({
        attendanceScore: 0,
        taskCompletionScore: 0,
        punctualityScore: 0,
        overallPerformance: 0,
        eodScore: 0,
        qualityScore: 0,
    });

    const [taskStats, setTaskStats] = useState({
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        overdueTasks: 0,
        completionRate: 0,
        avgCompletionTime: 0,
    });

    const [salaryInfo, setSalaryInfo] = useState({
        baseSalary: 0,
        deductions: {
            absentDays: 0,
            absentAmount: 0,
            lateDays: 0,
            lateAmount: 0,
            total: 0,
        },
        additions: {
            overtime: 0,
            bonus: 0,
            total: 0,
        },
        netSalary: 0,
    });

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Fetch performance data
    const fetchPerformance = async () => {
        try {
            setLoading(true);
            const response = await performanceService.getEmployeePerformance(
                user._id,
                selectedMonth,
                selectedYear
            );

            if (response.success) {
                setPerformanceData(response.data.performance || performanceData);
                setTaskStats(response.data.taskStats || taskStats);
                setSalaryInfo(response.data.salary || salaryInfo);
            } else {
                // Mock data
                setPerformanceData({
                    attendanceScore: 92,
                    taskCompletionScore: 88,
                    punctualityScore: 95,
                    overallPerformance: 91,
                    eodScore: 85,
                    qualityScore: 90,
                });

                setTaskStats({
                    totalTasks: 45,
                    completedTasks: 40,
                    inProgressTasks: 3,
                    overdueTasks: 2,
                    completionRate: 89,
                    avgCompletionTime: 2.5,
                });

                setSalaryInfo({
                    baseSalary: user.salary || 50000,
                    deductions: {
                        absentDays: 2,
                        absentAmount: 3333,
                        lateDays: 3,
                        lateAmount: 500,
                        total: 3833,
                    },
                    additions: {
                        overtime: 2000,
                        bonus: 5000,
                        total: 7000,
                    },
                    netSalary: 53167,
                });
            }
        } catch (error) {
            console.error('Error fetching performance:', error);
            toast.info('Using sample data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPerformance();
    }, [selectedMonth, selectedYear]);

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">My Performance</h1>
                <p className="text-gray-600 mt-2">Track your performance metrics and salary details</p>
            </div>

            {/* Month/Year Selector */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                <div className="flex items-center space-x-4">
                    <FiCalendar className="text-gray-600" />
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className="input-field"
                    >
                        {monthNames.map((month, index) => (
                            <option key={index} value={index}>
                                {month}
                            </option>
                        ))}
                    </select>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="input-field"
                    >
                        {[2023, 2024, 2025].map(year => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="bg-white rounded-xl shadow-md p-8 flex justify-center items-center">
                    <div className="spinner mr-3"></div>
                    <span className="text-gray-600">Loading performance data...</span>
                </div>
            ) : (
                <>
                    {/* Performance Charts */}
                    <PerformanceChart performanceData={performanceData} />

                    {/* Task Completion Stats */}
                    <div className="mt-6 bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <FiTrendingUp className="w-5 h-5 mr-2 text-primary-600" />
                            Task Completion Statistics
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Total Tasks</p>
                                <p className="text-2xl font-bold text-gray-900">{taskStats.totalTasks}</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Completed</p>
                                <p className="text-2xl font-bold text-green-600">{taskStats.completedTasks}</p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">In Progress</p>
                                <p className="text-2xl font-bold text-blue-600">{taskStats.inProgressTasks}</p>
                            </div>
                            <div className="bg-red-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Overdue</p>
                                <p className="text-2xl font-bold text-red-600">{taskStats.overdueTasks}</p>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-primary-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
                                <p className="text-3xl font-bold text-primary-600">{taskStats.completionRate}%</p>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Avg. Completion Time</p>
                                <p className="text-3xl font-bold text-purple-600">{taskStats.avgCompletionTime} days</p>
                            </div>
                        </div>
                    </div>

                    {/* Salary Details */}
                    <div className="mt-6 bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <FiDollarSign className="w-5 h-5 mr-2 text-green-600" />
                            Salary Breakdown - {monthNames[selectedMonth]} {selectedYear}
                        </h3>

                        {/* Base Salary */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700 font-medium">Base Salary</span>
                                <span className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(salaryInfo.baseSalary)}
                                </span>
                            </div>
                        </div>

                        {/* Deductions */}
                        <div className="mb-4">
                            <h4 className="font-semibold text-red-600 mb-3">Deductions</h4>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Absent Days Deduction</p>
                                        <p className="text-xs text-gray-600">{salaryInfo.deductions.absentDays} days absent</p>
                                    </div>
                                    <span className="text-red-600 font-semibold">
                                        - {formatCurrency(salaryInfo.deductions.absentAmount)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Late Arrival Deduction</p>
                                        <p className="text-xs text-gray-600">{salaryInfo.deductions.lateDays} days late</p>
                                    </div>
                                    <span className="text-red-600 font-semibold">
                                        - {formatCurrency(salaryInfo.deductions.lateAmount)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-red-100 rounded-lg border-2 border-red-200">
                                    <span className="font-semibold text-gray-900">Total Deductions</span>
                                    <span className="text-red-600 font-bold text-lg">
                                        - {formatCurrency(salaryInfo.deductions.total)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Additions */}
                        <div className="mb-4">
                            <h4 className="font-semibold text-green-600 mb-3">Additions</h4>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-900">Overtime Pay</p>
                                    <span className="text-green-600 font-semibold">
                                        + {formatCurrency(salaryInfo.additions.overtime)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-900">Performance Bonus</p>
                                    <span className="text-green-600 font-semibold">
                                        + {formatCurrency(salaryInfo.additions.bonus)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-green-100 rounded-lg border-2 border-green-200">
                                    <span className="font-semibold text-gray-900">Total Additions</span>
                                    <span className="text-green-600 font-bold text-lg">
                                        + {formatCurrency(salaryInfo.additions.total)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Net Salary */}
                        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-primary-100 text-sm mb-1">Net Salary</p>
                                    <p className="text-4xl font-bold">{formatCurrency(salaryInfo.netSalary)}</p>
                                </div>
                                <FiAward className="w-12 h-12 opacity-50" />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default MyPerformance;