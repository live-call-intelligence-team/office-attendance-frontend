// src/components/employee/PerformanceChart.jsx

import {
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ResponsiveContainer, Tooltip, Legend
} from 'recharts';
import { FiTrendingUp, FiAward, FiTarget, FiClock } from 'react-icons/fi';
import { CHART_COLORS } from '../../utils/constants';

const PerformanceChart = ({ performanceData = {} }) => {
    const {
        attendanceScore = 0,
        taskCompletionScore = 0,
        punctualityScore = 0,
        overallPerformance = 0,
        monthlyData = [],
    } = performanceData;

    // Radar chart data
    const radarData = [
        { subject: 'Attendance', score: attendanceScore, fullMark: 100 },
        { subject: 'Task Completion', score: taskCompletionScore, fullMark: 100 },
        { subject: 'Punctuality', score: punctualityScore, fullMark: 100 },
        { subject: 'EOD Reports', score: performanceData.eodScore || 0, fullMark: 100 },
        { subject: 'Quality', score: performanceData.qualityScore || 0, fullMark: 100 },
    ];

    // Get performance rating
    const getPerformanceRating = (score) => {
        if (score >= 90) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
        if (score >= 75) return { label: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
        if (score >= 60) return { label: 'Average', color: 'text-yellow-600', bg: 'bg-yellow-100' };
        return { label: 'Needs Improvement', color: 'text-red-600', bg: 'bg-red-100' };
    };

    const rating = getPerformanceRating(overallPerformance);

    return (
        <div className="space-y-6">
            {/* Overall Performance Card */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl shadow-lg p-8 text-white">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Overall Performance</h2>
                        <p className="text-primary-100">Your performance index this month</p>
                    </div>
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                        <FiAward className="w-10 h-10 text-primary-600" />
                    </div>
                </div>
                <div className="flex items-baseline">
                    <span className="text-6xl font-bold">{overallPerformance}</span>
                    <span className="text-3xl ml-2">/100</span>
                </div>
                <div className="mt-4">
                    <span className={`inline-block px-4 py-2 rounded-full font-semibold ${rating.bg} ${rating.color}`}>
                        {rating.label}
                    </span>
                </div>
            </div>

            {/* Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-gray-600">Attendance Score</h3>
                        <FiTarget className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-green-600">{attendanceScore}</span>
                        <span className="text-lg text-gray-500 ml-1">/100</span>
                    </div>
                    <div className="mt-3 bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${attendanceScore}%` }}
                        ></div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-gray-600">Task Completion</h3>
                        <FiTrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-blue-600">{taskCompletionScore}</span>
                        <span className="text-lg text-gray-500 ml-1">/100</span>
                    </div>
                    <div className="mt-3 bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${taskCompletionScore}%` }}
                        ></div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-gray-600">Punctuality Score</h3>
                        <FiClock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-purple-600">{punctualityScore}</span>
                        <span className="text-lg text-gray-500 ml-1">/100</span>
                    </div>
                    <div className="mt-3 bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${punctualityScore}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Radar Chart */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Performance Breakdown
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar
                            name="Your Score"
                            dataKey="score"
                            stroke={CHART_COLORS.PRIMARY}
                            fill={CHART_COLORS.PRIMARY}
                            fillOpacity={0.6}
                        />
                        <Tooltip />
                        <Legend />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            {/* Performance Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                    <FiTarget className="w-5 h-5 mr-2" />
                    Tips to Improve Performance
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                    {attendanceScore < 90 && (
                        <li>✓ Maintain consistent attendance to boost your attendance score</li>
                    )}
                    {taskCompletionScore < 90 && (
                        <li>✓ Complete tasks on time to improve task completion rate</li>
                    )}
                    {punctualityScore < 90 && (
                        <li>✓ Check-in on time daily to increase punctuality score</li>
                    )}
                    <li>✓ Submit EOD reports regularly</li>
                    <li>✓ Communicate proactively with your manager</li>
                </ul>
            </div>
        </div>
    );
};

export default PerformanceChart;