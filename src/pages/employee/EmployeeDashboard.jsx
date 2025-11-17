import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { toast } from 'react-toastify';
import {
  FiClock,
  FiCheckCircle,
  FiCalendar,
  FiTrendingUp,
  FiAward,
  FiTarget,
  FiActivity,
  FiLogIn,
  FiLogOut,
} from 'react-icons/fi';
import { Line } from 'react-chartjs-2';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clockingIn, setClockingIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/employee');
      setDashboard(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = async () => {
    try {
      setClockingIn(true);
      await api.post('/attendance/clock-in');
      toast.success('Clocked in successfully! 🎉');
      fetchDashboard();
    } catch (error) {
      console.error('Error clocking in:', error);
      toast.error(error.response?.data?.message || 'Failed to clock in');
    } finally {
      setClockingIn(false);
    }
  };

  const handleClockOut = async () => {
    try {
      setClockingIn(true);
      await api.post('/attendance/clock-out');
      toast.success('Clocked out successfully! 👋');
      fetchDashboard();
    } catch (error) {
      console.error('Error clocking out:', error);
      toast.error(error.response?.data?.message || 'Failed to clock out');
    } finally {
      setClockingIn(false);
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
        label: 'Work Hours',
        data: dashboard.chartData?.map(d => d.hours) || [],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
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
      },
    },
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const isTodayClocked = dashboard.stats.todayStatus !== 'not-marked';
  const isClockedOut = dashboard.stats.checkOut !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-32 -mb-32"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">{getGreeting()}, {user?.name}! 👋</h1>
          <p className="text-white/90 text-lg">Here's your performance overview</p>
          
          <div className="mt-6 flex items-center gap-4 flex-wrap">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/30">
              <p className="text-white/80 text-sm font-semibold">Current Time</p>
              <p className="text-2xl font-bold">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/30">
              <p className="text-white/80 text-sm font-semibold">Today's Status</p>
              <p className="text-2xl font-bold capitalize">
                {dashboard.stats.todayStatus === 'not-marked' ? 'Not Clocked In' : dashboard.stats.todayStatus}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Clock In/Out Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FiClock className="text-indigo-600" />
            Attendance Tracking
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Clock In */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <FiLogIn className="text-2xl text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Clock In Time</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {dashboard.stats.checkIn 
                      ? new Date(dashboard.stats.checkIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                      : '--:--'
                    }
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClockIn}
                disabled={isTodayClocked || clockingIn}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
                  isTodayClocked
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-xl'
                }`}
              >
                {clockingIn ? 'Clocking In...' : isTodayClocked ? 'Already Clocked In' : 'Clock In'}
              </motion.button>
            </div>

            {/* Clock Out */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                  <FiLogOut className="text-2xl text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Clock Out Time</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {dashboard.stats.checkOut 
                      ? new Date(dashboard.stats.checkOut).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                      : '--:--'
                    }
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClockOut}
                disabled={!isTodayClocked || isClockedOut || clockingIn}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
                  !isTodayClocked || isClockedOut
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-xl'
                }`}
              >
                {clockingIn ? 'Clocking Out...' : isClockedOut ? 'Already Clocked Out' : 'Clock Out'}
              </motion.button>
            </div>
          </div>

          {/* Today's Info */}
          {isTodayClocked && (
            <div className="mt-6 p-6 bg-indigo-50 rounded-2xl border-2 border-indigo-200">
              <p className="text-sm text-gray-600 font-semibold mb-2">Today's Work Duration</p>
              <p className="text-3xl font-bold text-indigo-600">
                {dashboard.stats.checkOut
                  ? (() => {
                      const checkIn = new Date(dashboard.stats.checkIn);
                      const checkOut = new Date(dashboard.stats.checkOut);
                      const diff = (checkOut - checkIn) / (1000 * 60 * 60);
                      return `${diff.toFixed(1)} hours`;
                    })()
                  : 'In Progress...'
                }
              </p>
            </div>
          )}
        </motion.div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <FiCheckCircle className="text-4xl" />
              <div className="text-right">
                <p className="text-white/80 text-sm font-semibold">Attendance Rate</p>
                <p className="text-4xl font-bold">{dashboard.stats.attendanceRate}%</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <FiTarget className="text-4xl" />
              <div className="text-right">
                <p className="text-white/80 text-sm font-semibold">Active Tasks</p>
                <p className="text-4xl font-bold">{dashboard.stats.activeTasks}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <FiAward className="text-4xl" />
              <div className="text-right">
                <p className="text-white/80 text-sm font-semibold">Completed Tasks</p>
                <p className="text-4xl font-bold">{dashboard.stats.completedTasks}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Work Hours Chart */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <FiTrendingUp className="text-indigo-600" />
          Work Hours Trend (Last 7 Days)
        </h3>
        <div className="h-80">
          <Line data={chartData} options={chartOptions} />
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <FiActivity className="text-indigo-600" />
          Recent Attendance
        </h3>
        <div className="space-y-3">
          {dashboard.recentAttendance?.slice(0, 5).map((record, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${
                  record.status === 'present' ? 'bg-green-500' :
                  record.status === 'late' ? 'bg-orange-500' :
                  record.status === 'absent' ? 'bg-red-500' : 'bg-gray-400'
                }`}></div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-sm text-gray-600 capitalize">{record.status}</p>
                </div>
              </div>
              {record.totalHours && (
                <div className="text-right">
                  <p className="font-bold text-gray-800">{record.totalHours.toFixed(1)}h</p>
                  <p className="text-sm text-gray-600">Work Hours</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default EmployeeDashboard;
