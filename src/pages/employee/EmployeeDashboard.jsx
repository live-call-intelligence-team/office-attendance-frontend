import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  FiHome,
  FiBriefcase,
  FiMapPin,
} from 'react-icons/fi';
import { Line } from 'react-chartjs-2';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clockingIn, setClockingIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [workDuration, setWorkDuration] = useState('0h 0m');

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (dashboard?.todayAttendance?.clockIn && !dashboard?.todayAttendance?.clockOut) {
        calculateDuration();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [dashboard]);

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

  const calculateDuration = () => {
    if (!dashboard?.todayAttendance?.clockIn) return;

    const start = new Date(dashboard.todayAttendance.clockIn);
    const now = new Date();
    const diff = now - start;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    setWorkDuration(`${hours}h ${minutes}m`);
  };

  const handleClockIn = async (location) => {
    try {
      setClockingIn(true);
      await api.post('/attendance/clock-in', { workLocation: location });
      toast.success('Clocked in successfully! 🎉');
      setShowLocationDropdown(false);
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

  const todayAttendance = dashboard.todayAttendance;
  const isClocked = todayAttendance?.clockIn && !todayAttendance?.clockOut;
  const isPending = todayAttendance?.status === 'pending';

  const chartData = {
    labels: dashboard.chartData?.map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }) || [],
    datasets: [
      {
        label: 'Hours Worked',
        data: dashboard.chartData?.map(d => d.totalHours) || [],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (value) => `${value}h` },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 text-lg">{currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p className="text-gray-500 text-3xl font-bold mt-2">{currentTime.toLocaleTimeString()}</p>
        </div>

        {/* Clock In/Out Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Today's Attendance</h2>
              
              {isPending && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                  <p className="text-yellow-800 font-medium">⏳ Your clock-in is pending admin approval</p>
                </div>
              )}

              {todayAttendance?.clockIn ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FiLogIn className="text-green-500 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Clocked In</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {new Date(todayAttendance.clockIn).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  {todayAttendance.clockOut ? (
                    <>
                      <div className="flex items-center gap-3">
                        <FiLogOut className="text-red-500 text-xl" />
                        <div>
                          <p className="text-sm text-gray-500">Clocked Out</p>
                          <p className="text-lg font-semibold text-gray-800">
                            {new Date(todayAttendance.clockOut).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <FiClock className="text-blue-500 text-xl" />
                        <div>
                          <p className="text-sm text-gray-500">Total Hours</p>
                          <p className="text-lg font-semibold text-gray-800">
                            {todayAttendance.totalHours?.toFixed(2) || '0.00'} hours
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-3">
                      <FiActivity className="text-blue-500 text-xl animate-pulse" />
                      <div>
                        <p className="text-sm text-gray-500">Working for</p>
                        <p className="text-lg font-semibold text-blue-600">{workDuration}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <FiMapPin className="text-purple-500 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="text-lg font-semibold text-gray-800 capitalize">
                        {todayAttendance.workLocation || 'Office'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">You haven't clocked in yet today</p>
              )}
            </div>

            <div className="relative">
              {!todayAttendance?.clockIn ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                    disabled={clockingIn}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                  >
                    <FiLogIn className="text-2xl" />
                    {clockingIn ? 'Clocking In...' : 'Clock In'}
                  </motion.button>

                  <AnimatePresence>
                    {showLocationDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-10 min-w-[200px]"
                      >
                        <button
                          onClick={() => handleClockIn('office')}
                          className="w-full px-4 py-3 hover:bg-blue-50 flex items-center gap-3 transition-colors"
                        >
                          <FiBriefcase className="text-blue-600" />
                          <span className="font-medium">Office</span>
                        </button>
                        <button
                          onClick={() => handleClockIn('home')}
                          className="w-full px-4 py-3 hover:bg-green-50 flex items-center gap-3 transition-colors"
                        >
                          <FiHome className="text-green-600" />
                          <span className="font-medium">Work from Home</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : !todayAttendance?.clockOut && !isPending ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClockOut}
                  disabled={clockingIn}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                >
                  <FiLogOut className="text-2xl" />
                  {clockingIn ? 'Clocking Out...' : 'Clock Out'}
                </motion.button>
              ) : todayAttendance?.clockOut ? (
                <div className="bg-gray-100 px-8 py-4 rounded-2xl">
                  <FiCheckCircle className="text-green-500 text-4xl mx-auto" />
                  <p className="text-gray-600 font-medium mt-2">Completed</p>
                </div>
              ) : null}
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <FiCalendar className="text-blue-600 text-2xl" />
              </div>
              <span className="text-sm text-gray-500">This Month</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">
              {dashboard.stats?.presentDays || 0}
            </h3>
            <p className="text-gray-600">Days Present</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <FiClock className="text-green-600 text-2xl" />
              </div>
              <span className="text-sm text-gray-500">Total Hours</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">
              {dashboard.stats?.totalHours?.toFixed(1) || '0.0'}
            </h3>
            <p className="text-gray-600">Hours Worked</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-xl">
                <FiTarget className="text-purple-600 text-2xl" />
              </div>
              <span className="text-sm text-gray-500">Active Tasks</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">
              {dashboard.stats?.activeTasks || 0}
            </h3>
            <p className="text-gray-600">In Progress</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 p-3 rounded-xl">
                <FiAward className="text-yellow-600 text-2xl" />
              </div>
              <span className="text-sm text-gray-500">Performance</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">
              {dashboard.stats?.attendanceRate || '0'}%
            </h3>
            <p className="text-gray-600">Attendance Rate</p>
          </motion.div>
        </div>

        {/* Chart */}
        {dashboard.chartData && dashboard.chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6">Work Hours Trend</h3>
            <div className="h-64">
              <Line data={chartData} options={chartOptions} />
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default EmployeeDashboard;
