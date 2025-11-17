// src/components/admin/AttendanceAnalytics.jsx

import { FiUsers, FiTrendingUp, FiTrendingDown, FiCalendar } from 'react-icons/fi';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { CHART_COLORS } from '../../utils/constants';

const AttendanceAnalytics = ({ data = {} }) => {
    const {
        overview = {},
        monthlyTrend = [],
        departmentWise = [],
        topPerformers = [],
        attendanceDistribution = [],
    } = data;

    const COLORS = [
        CHART_COLORS.SUCCESS,
        CHART_COLORS.DANGER,
        CHART_COLORS.WARNING,
        CHART_COLORS.INFO,
        CHART_COLORS.PURPLE,
    ];

    return (
        <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600">Avg. Attendance</h3>
                        <FiUsers className="w-5 h-5 text-primary-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                        {overview.averageAttendance || 0}%
                    </p>
                    <p className="text-sm text-gray-500 mt-1">This Month</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600">Present Today</h3>
                        <FiCalendar className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-green-600">
                        {overview.presentToday || 0}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        Out of {overview.totalEmployees || 0}
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600">Absent Today</h3>
                        <FiTrendingDown className="w-5 h-5 text-red-600" />
                    </div>
                    <p className="text-3xl font-bold text-red-600">
                        {overview.absentToday || 0}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Employees</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600">On Leave</h3>
                        <FiCalendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold text-blue-600">
                        {overview.onLeave || 0}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Today</p>
                </div>
            </div>

            {/* Monthly Trend */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Monthly Attendance Trend
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="present"
                            stroke={CHART_COLORS.SUCCESS}
                            strokeWidth={2}
                            name="Present"
                        />
                        <Line
                            type="monotone"
                            dataKey="absent"
                            stroke={CHART_COLORS.DANGER}
                            strokeWidth={2}
                            name="Absent"
                        />
                        <Line
                            type="monotone"
                            dataKey="leave"
                            stroke={CHART_COLORS.INFO}
                            strokeWidth={2}
                            name="On Leave"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Department-wise and Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Department-wise Attendance */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Department-wise Attendance
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={departmentWise}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="department" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="percentage" fill={CHART_COLORS.PRIMARY} name="Attendance %" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Attendance Distribution */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Today's Attendance Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={attendanceDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {attendanceDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top Performers */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FiTrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    Top 5 Employees by Attendance
                </h3>
                <div className="space-y-3">
                    {topPerformers.map((employee, index) => (
                        <div
                            key={employee._id || index}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                                    {index + 1}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{employee.name}</p>
                                    <p className="text-sm text-gray-500">{employee.department}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-green-600">
                                    {employee.attendancePercentage}%
                                </p>
                                <p className="text-xs text-gray-500">
                                    {employee.presentDays}/{employee.totalDays} days
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AttendanceAnalytics;