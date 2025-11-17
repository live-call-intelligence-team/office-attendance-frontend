import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { toast } from 'react-toastify';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,  // ADD THIS
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import {
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiCalendar,
  FiTarget,
  FiAward,
  FiActivity,
  FiZap,
} from 'react-icons/fi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,  // ADD THIS
  Title,
  Tooltip,
  Legend,
  Filler
);

const MyAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/analytics/employee?period=${period}`);
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-text-muted font-semibold">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <FiActivity className="text-6xl text-text-muted mx-auto mb-4" />
          <p className="text-text-muted text-lg font-semibold">No analytics data available</p>
          <p className="text-text-secondary text-sm mt-2">Start tracking your attendance to see insights</p>
        </div>
      </div>
    );
  }

  const getProductivityColor = (score) => {
    if (score >= 90) return 'from-green-500 to-emerald-600';
    if (score >= 75) return 'from-blue-500 to-blue-600';
    if (score >= 60) return 'from-yellow-500 to-orange-600';
    return 'from-orange-500 to-red-600';
  };

  const getProductivityLabel = (score) => {
    if (score >= 90) return 'Excellent 🌟';
    if (score >= 75) return 'Good 👍';
    if (score >= 60) return 'Average 📊';
    return 'Needs Improvement 📈';
  };

  const attendanceTrendData = {
    labels: analytics.trends.daily.map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Work Hours',
        data: analytics.trends.daily.map(d => d.hours),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
      },
    ],
  };

  const attendanceStatusData = {
    labels: ['Present', 'Absent', 'Late', 'Half Day'],
    datasets: [
      {
        data: [
          analytics.attendance.present,
          analytics.attendance.absent,
          analytics.attendance.late,
          analytics.attendance.halfDay,
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.9)',
          'rgba(239, 68, 68, 0.9)',
          'rgba(251, 146, 60, 0.9)',
          'rgba(168, 85, 247, 0.9)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const leaveBalanceData = {
    labels: ['Sick', 'Casual', 'Vacation', 'Personal'],
    datasets: [
      {
        label: 'Used',
        data: [
          analytics.leaves.balance.sick.used,
          analytics.leaves.balance.casual.used,
          analytics.leaves.balance.vacation.used,
          analytics.leaves.balance.personal.used,
        ],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
      },
      {
        label: 'Remaining',
        data: [
          analytics.leaves.balance.sick.remaining,
          analytics.leaves.balance.casual.remaining,
          analytics.leaves.balance.vacation.remaining,
          analytics.leaves.balance.personal.remaining,
        ],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      },
    ],
  };

  const taskStatusData = {
    labels: ['Pending', 'In Progress', 'Completed', 'Overdue'],
    datasets: [
      {
        data: [
          analytics.tasks.pending,
          analytics.tasks.inProgress,
          analytics.tasks.completed,
          analytics.tasks.overdue,
        ],
        backgroundColor: [
          'rgba(251, 146, 60, 0.9)',
          'rgba(59, 130, 246, 0.9)',
          'rgba(34, 197, 94, 0.9)',
          'rgba(239, 68, 68, 0.9)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const performanceRadarData = {
    labels: ['Attendance', 'Punctuality', 'Task Completion', 'Work Hours', 'Productivity'],
    datasets: [
      {
        label: 'My Performance',
        data: [
          parseFloat(analytics.overview.attendanceRate),
          ((analytics.attendance.earlyArrivals / Math.max(analytics.attendance.total, 1)) * 100),
          parseFloat(analytics.overview.completionRate),
          (parseFloat(analytics.overview.avgWorkHours) / 8 * 100),
          analytics.overview.productivityScore,
        ],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 3,
        pointBackgroundColor: 'rgb(99, 102, 241)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(99, 102, 241)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 12,
            weight: '600'
          }
        }
      },
    },
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            My Performance Analytics
          </h1>
          <p className="text-gray-600 mt-2 font-medium">Your personal insights and growth metrics</p>
        </div>

        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-6 py-3 bg-white border-2 border-purple-200 rounded-2xl text-gray-700 font-semibold focus:outline-none focus:ring-4 focus:ring-purple-200 shadow-lg hover:shadow-xl transition-all"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="quarter">Last Quarter</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {/* Productivity Score - Hero Section */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`bg-gradient-to-br ${getProductivityColor(analytics.overview.productivityScore)} rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden`}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-32 -mb-32"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <FiZap className="text-5xl animate-pulse" />
              <h2 className="text-3xl font-bold">Productivity Score</h2>
            </div>
            <p className="text-white/90 text-lg mb-6">Your overall performance rating</p>
            <div className="flex items-baseline gap-3">
              <p className="text-7xl font-bold">{analytics.overview.productivityScore}</p>
              <p className="text-3xl font-semibold opacity-80">/100</p>
            </div>
            <p className="text-2xl font-bold mt-4">{getProductivityLabel(analytics.overview.productivityScore)}</p>
          </div>
          <div className="w-56 h-56 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
            <div className="w-48 h-48 bg-white/30 rounded-full flex items-center justify-center">
              <FiAward className="text-9xl" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: FiCheckCircle, label: 'Attendance Rate', value: `${analytics.overview.attendanceRate}%`, color: 'from-green-400 to-emerald-500' },
          { icon: FiClock, label: 'Total Work Hours', value: analytics.overview.totalWorkHours.toFixed(0), color: 'from-blue-400 to-indigo-500' },
          { icon: FiActivity, label: 'Avg Daily Hours', value: analytics.overview.avgWorkHours, color: 'from-purple-400 to-pink-500' },
          { icon: FiTarget, label: 'Task Completion', value: `${analytics.overview.completionRate}%`, color: 'from-orange-400 to-red-500' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-xl`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-semibold mb-2">{stat.label}</p>
                <p className="text-4xl font-bold">{stat.value}</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <stat.icon className="text-3xl" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Work Hours Trend */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FiTrendingUp className="text-blue-600" />
            Work Hours Trend
          </h3>
          <div className="h-80">
            <Line data={attendanceTrendData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Performance Radar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FiAward className="text-purple-600" />
            Performance Overview
          </h3>
          <div className="h-80">
            <Radar data={performanceRadarData} options={radarOptions} />
          </div>
        </motion.div>

        {/* Attendance Distribution */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FiCalendar className="text-green-600" />
            Attendance Distribution
          </h3>
          <div className="h-64 flex items-center justify-center">
            <div className="w-64 h-64">
              <Doughnut data={attendanceStatusData} options={chartOptions} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="text-center p-4 bg-green-50 rounded-2xl">
              <p className="text-3xl font-bold text-green-600">{analytics.attendance.earlyArrivals}</p>
              <p className="text-sm text-gray-600 font-semibold mt-1">Early Arrivals</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-2xl">
              <p className="text-3xl font-bold text-orange-600">{analytics.attendance.lateArrivals}</p>
              <p className="text-sm text-gray-600 font-semibold mt-1">Late Arrivals</p>
            </div>
          </div>
        </motion.div>

        {/* Task Status */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FiCheckCircle className="text-blue-600" />
            Task Status
          </h3>
          <div className="h-64 flex items-center justify-center">
            <div className="w-64 h-64">
              <Doughnut data={taskStatusData} options={chartOptions} />
            </div>
          </div>
          <div className="text-center mt-6 p-4 bg-blue-50 rounded-2xl">
            <p className="text-sm text-gray-600 font-semibold">Average Completion Time</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">{analytics.tasks.avgCompletionTime}</p>
          </div>
        </motion.div>
      </div>

      {/* Performance Tips */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl"
      >
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <FiTarget />
          Performance Insights & Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <p className="font-bold text-lg mb-3">🎯 Attendance Goal</p>
            <p className="text-sm text-white/90">
              {analytics.overview.attendanceRate >= 95 
                ? 'Excellent! Keep maintaining this rate.'
                : `Aim for 95% to be among top performers. Current: ${analytics.overview.attendanceRate}%`
              }
            </p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <p className="font-bold text-lg mb-3">⏰ Work Hours</p>
            <p className="text-sm text-white/90">
              {analytics.overview.avgWorkHours >= 8
                ? 'Great job maintaining full work hours!'
                : `Try to complete 8 hours daily. Current avg: ${analytics.overview.avgWorkHours}hrs`
              }
            </p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <p className="font-bold text-lg mb-3">✅ Task Completion</p>
            <p className="text-sm text-white/90">
              {analytics.tasks.overdue > 0
                ? `Focus on ${analytics.tasks.overdue} overdue task${analytics.tasks.overdue > 1 ? 's' : ''} first!`
                : 'Perfect! No overdue tasks. Keep it up!'
              }
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MyAnalytics;
