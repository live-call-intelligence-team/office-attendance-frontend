import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { toast } from 'react-toastify';
import {
  FiUsers,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiAlertCircle,
  FiFileText,
  FiTrendingUp,
  FiTarget,
} from 'react-icons/fi';
import { Line, Bar } from 'react-chartjs-2';

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('📊 Fetching dashboard data...');
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/admin');
      console.log('✅ Dashboard data received:', response.data);
      setDashboard(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <p className="text-gray-600 text-lg">No dashboard data available</p>
      </div>
    );
  }

  const chartData = {
    labels: dashboard.chartData?.map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }) || [],
    datasets: [
      {
        label: 'Present',
        data: dashboard.chartData?.map(d => d.present) || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
      },
      {
        label: 'Absent',
        data: dashboard.chartData?.map(d => d.absent) || [],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
      },
      {
        label: 'Late',
        data: dashboard.chartData?.map(d => d.late) || [],
        borderColor: 'rgb(251, 146, 60)',
        backgroundColor: 'rgba(251, 146, 60, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
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
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-32 -mb-32"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard 🚀</h1>
          <p className="text-white/90 text-lg">Real-time workforce insights and metrics</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl p-6 text-white shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <FiUsers className="text-3xl" />
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm font-semibold">Total Employees</p>
              <p className="text-5xl font-bold">{dashboard.stats.totalEmployees}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl p-6 text-white shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <FiCheckCircle className="text-3xl" />
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm font-semibold">Present Today</p>
              <p className="text-5xl font-bold">{dashboard.stats.presentToday}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl p-6 text-white shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <FiXCircle className="text-3xl" />
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm font-semibold">Absent Today</p>
              <p className="text-5xl font-bold">{dashboard.stats.absentToday}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-gradient-to-br from-orange-400 to-yellow-500 rounded-2xl p-6 text-white shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <FiClock className="text-3xl" />
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm font-semibold">Late Today</p>
              <p className="text-5xl font-bold">{dashboard.stats.lateToday}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold mb-1">Monthly Attendance</p>
              <p className="text-4xl font-bold text-indigo-600">{dashboard.stats.monthlyAttendanceRate}%</p>
            </div>
            <FiTrendingUp className="text-5xl text-indigo-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold mb-1">Pending Leaves</p>
              <p className="text-4xl font-bold text-purple-600">{dashboard.stats.pendingLeaves}</p>
            </div>
            <FiFileText className="text-5xl text-purple-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold mb-1">Active Tasks</p>
              <p className="text-4xl font-bold text-pink-600">{dashboard.stats.activeTasks}</p>
            </div>
            <FiTarget className="text-5xl text-pink-600" />
          </div>
        </motion.div>
      </div>

      {/* Attendance Trend Chart */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <FiTrendingUp className="text-indigo-600" />
          Attendance Trend (Last 7 Days)
        </h3>
        <div className="h-96">
          <Line data={chartData} options={chartOptions} />
        </div>
      </motion.div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Attendance */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FiCheckCircle className="text-green-600" />
            Recent Check-ins
          </h3>
          <div className="space-y-3">
            {dashboard.recentAttendance?.slice(0, 5).map((record, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {record.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{record.user?.name}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  record.status === 'present' ? 'bg-green-100 text-green-700' :
                  record.status === 'late' ? 'bg-orange-100 text-orange-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {record.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Leaves */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FiFileText className="text-purple-600" />
            Recent Leave Requests
          </h3>
          <div className="space-y-3">
            {dashboard.recentLeaves?.slice(0, 5).map((leave, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {leave.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{leave.user?.name}</p>
                    <p className="text-sm text-gray-600 capitalize">{leave.leaveType}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  leave.status === 'approved' ? 'bg-green-100 text-green-700' :
                  leave.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {leave.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
