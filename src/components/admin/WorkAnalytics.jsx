// src/components/admin/WorkAnalytics.jsx

import { FiCheckSquare, FiClock, FiAlertCircle, FiTrendingUp } from 'react-icons/fi';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { CHART_COLORS } from '../../utils/constants';

const WorkAnalytics = ({ data = {} }) => {
    const {
        overview = {},
        taskCompletionTrend = [],
        tasksByPriority = [],
        tasksByStatus = [],
        employeeProductivity = [],
    } = data;

    const COLORS = [
        CHART_COLORS.SUCCESS,
        CHART_COLORS.PRIMARY,
        CHART_COLORS.WARNING,
        CHART_COLORS.DANGER,
    ];

    return (
        <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600">Total Tasks</h3>
                        <FiCheckSquare className="w-5 h-5 text-gray-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                        {overview.totalTasks || 0}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">All Time</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600">Completed</h3>
                        <FiCheckSquare className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-green-600">
                        {overview.completedTasks || 0}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        {overview.completionRate || 0}% completion rate
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600">In Progress</h3>
                        <FiClock className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold text-blue-600">
                        {overview.inProgressTasks || 0}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Active Tasks</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-600">Overdue</h3>
                        <FiAlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <p className="text-3xl font-bold text-red-600">
                        {overview.overdueTasks || 0}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Need Attention</p>
                </div>
            </div>

            {/* Task Completion Trend */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Task Completion Trend (Last 7 Days)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={taskCompletionTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="completed"
                            stroke={CHART_COLORS.SUCCESS}
                            strokeWidth={2}
                            name="Completed"
                        />
                        <Line
                            type="monotone"
                            dataKey="assigned"
                            stroke={CHART_COLORS.PRIMARY}
                            strokeWidth={2}
                            name="Assigned"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Tasks by Priority and Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tasks by Priority */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Tasks by Priority
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={tasksByPriority}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {tasksByPriority.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Tasks by Status */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Tasks by Status
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={tasksByStatus}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="status" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill={CHART_COLORS.PRIMARY} name="Tasks" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Employee Productivity */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FiTrendingUp className="w-5 h-5 mr-2 text-primary-600" />
                    Top 5 Most Productive Employees
                </h3>
                <div className="space-y-3">
                    {employeeProductivity.map((employee, index) => (
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
                                <p className="text-2xl font-bold text-primary-600">
                                    {employee.completedTasks}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {employee.completionRate}% completion
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WorkAnalytics;