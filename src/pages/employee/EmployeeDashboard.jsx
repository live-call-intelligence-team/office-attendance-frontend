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
  FiCoffee,
  FiPlay,
  FiPause,
} from 'react-icons/fi';
import { Line } from 'react-chartjs-2';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clockingIn, setClockingIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [liveWorkHours, setLiveWorkHours] = useState('0h 0m');
  const [liveBreakHours, setLiveBreakHours] = useState('0h 0m');

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      calculateLiveDurations();
    }, 1000);
    return () => clearInterval(timer);
  }, [dashboard]);

  const calculateLiveDurations = () => {
    const today = dashboard?.todayAttendance;
    if (!today?.clockIn) return;

    // Calculate work hours
    const clockInTime = new Date(today.clockIn);
    const currentOrClockOut = today.clockOut ? new Date(today.clockOut) : new Date();
    const workMs = currentOrClockOut - clockInTime;
    
    const workHours = Math.floor(workMs / (1000 * 60 * 60));
    const workMinutes = Math.floor((workMs % (1000 * 60 * 60)) / (1000 * 60));
    setLiveWorkHours(`${workHours}h ${workMinutes}m`);

    // Calculate break hours
    let breakMs = 0;
    if (today.breaks && today.breaks.length > 0) {
      today.breaks.forEach(brk => {
        if (brk.start) {
          const breakStart = new Date(brk.start);
          const breakEnd = brk.end ? new Date(brk.end) : new Date();
          breakMs += (breakEnd - breakStart);
        }
      });
    }
    
    const breakHours = Math.floor(breakMs / (1000 * 60 * 60));
    const breakMinutes = Math.floor((breakMs % (1000 * 60 * 60)) / (1000 * 60));
    setLiveBreakHours(`${breakHours}h ${breakMinutes}m`);
  };

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

  const handleStartBreak = async () => {
    try {
      await api.post('/attendance/start-break');
      toast.success('Break started');
      fetchDashboard();
    } catch (error) {
      console.error('Error starting break:', error);
      toast.error(error.response?.data?.message || 'Failed to start break');
    }
  };

  const handleEndBreak = async () => {
    try {
      await api.post('/attendance/end-break');
      toast.success('Break ended');
      fetchDashboard();
    } catch (error) {
      console.error('Error ending break:', error);
      toast.error(error.response?.data?.message || 'Failed to end break');
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
  const isOnBreak = todayAttendance?.breaks?.some(brk => brk.start && !brk.end);

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
          <p className="text-gray-600 text-lg">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <p className="text-gray-500 text-3xl font-bold mt-2">
            {currentTime.toLocaleTimeString()}
          </p>
        </div>

        {/* Compact Clock In/Out Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-xl p-6 mb-8 border border-gray-100"
        >
          {/* Pending Status Alert */}
          {isPending && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
              <p className="text-yellow-800 font-medium">
                ⏳ Your clock-in is pending admin approval
              </p>
            </div>
          )}

          <div className="flex items-center justify-between gap-6">
            {/* Left: Time Info - Compact Grid */}
            <div className="flex-1 grid grid-cols-2 gap-4">
              {/* Clock In Time */}
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-xl">
                  <FiLogIn className="text-green-600 text-xl" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Clock In</p>
                  <p className="text-lg font-bold text-gray-800">
                    {todayAttendance?.clockIn
                      ? new Date(todayAttendance.clockIn).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '--:--'}
                  </p>
                </div>
              </div>

              {/* Clock Out Time */}
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-3 rounded-xl">
                  <FiLogOut className="text-red-600 text-xl" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Clock Out</p>
                  <p className="text-lg font-bold text-gray-800">
                    {todayAttendance?.clockOut
                      ? new Date(todayAttendance.clockOut).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : isClocked ? 'Working...' : '--:--'}
                  </p>
                </div>
              </div>

              {/* Work Hours */}
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <FiClock className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Work Hours</p>
                  <p className="text-lg font-bold text-blue-600">
                    {todayAttendance?.clockOut
                      ? `${todayAttendance.totalHours?.toFixed(2) || '0.00'}h`
                      : isClocked
                      ? liveWorkHours
                      : '0h 0m'}
                  </p>
                </div>
              </div>

              {/* Break Hours */}
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-3 rounded-xl">
                  <FiCoffee className="text-orange-600 text-xl" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Break Time</p>
                  <p className="text-lg font-bold text-orange-600">
                    {todayAttendance?.clockOut
                      ? `${todayAttendance.breakDuration?.toFixed(2) || '0.00'}h`
                      : liveBreakHours}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex flex-col gap-3">
              {/* Clock In/Out Button */}
              <div className="relative">
                {!todayAttendance?.clockIn ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                      disabled={clockingIn}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 w-48"
                    >
                      <FiLogIn className="text-xl" />
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
                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 w-48"
                  >
                    <FiLogOut className="text-xl" />
                    {clockingIn ? 'Clocking Out...' : 'Clock Out'}
                  </motion.button>
                ) : todayAttendance?.clockOut ? (
                  <div className="bg-gray-100 px-6 py-3 rounded-xl w-48 flex items-center justify-center gap-2">
                    <FiCheckCircle className="text-green-500 text-xl" />
                    <span className="text-gray-600 font-medium">Completed</span>
                  </div>
                ) : null}
              </div>

              {/* Break Button */}
              {isClocked && !isPending && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={isOnBreak ? handleEndBreak : handleStartBreak}
                  className={`px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 w-48 ${
                    isOnBreak
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                      : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                  }`}
                >
                  {isOnBreak ? (
                    <>
                      <FiPlay className="text-xl" />
                      End Break
                    </>
                  ) : (
                    <>
                      <FiPause className="text-xl" />
                      Start Break
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </div>

          {/* Location Badge */}
          {todayAttendance?.workLocation && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium">
                <FiBriefcase className="text-lg" />
                Working from: <span className="capitalize font-bold">{todayAttendance.workLocation}</span>
              </span>
            </div>
          )}
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
