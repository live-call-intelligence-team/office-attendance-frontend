import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { toast } from 'react-toastify';
import {
  FiClock,
  FiMapPin,
  FiCheck,
  FiX,
  FiCoffee,
  FiHome,
  FiBriefcase,
  FiChevronDown,
  FiDownload,
  FiCalendar,
  FiActivity,
  FiAlertCircle,
} from 'react-icons/fi';

const MyAttendance = () => {
  const [loading, setLoading] = useState(true);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [workDuration, setWorkDuration] = useState('0h 0m');
  const [breakDuration, setBreakDuration] = useState('0h 0m');
  
  // Clock in dropdown states
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [clockingIn, setClocingIn] = useState(false);

  useEffect(() => {
    fetchAttendanceData();
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (todayAttendance?.clockIn && !todayAttendance?.clockOut) {
        calculateDuration();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const [todayRes, historyRes, statsRes] = await Promise.all([
        api.get('/attendance/today'),
        api.get('/attendance/my-attendance'),
        api.get('/attendance/my-stats'),
      ]);

      setTodayAttendance(todayRes.data.data);
      setAttendanceHistory(historyRes.data.data || []);
      setStats(statsRes.data.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const calculateDuration = () => {
    if (!todayAttendance?.clockIn) return;

    const start = new Date(todayAttendance.clockIn);
    const now = new Date();
    const diff = now - start;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    setWorkDuration(`${hours}h ${minutes}m`);

    if (todayAttendance.breaks && todayAttendance.breaks.length > 0) {
      const lastBreak = todayAttendance.breaks[todayAttendance.breaks.length - 1];
      if (lastBreak.start && !lastBreak.end) {
        const breakStart = new Date(lastBreak.start);
        const breakDiff = now - breakStart;
        const breakHours = Math.floor(breakDiff / (1000 * 60 * 60));
        const breakMinutes = Math.floor((breakDiff % (1000 * 60 * 60)) / (1000 * 60));
        setBreakDuration(`${breakHours}h ${breakMinutes}m`);
      }
    }
  };

  const handleClockIn = async (location) => {
    if (!location) {
      toast.error('Please select work location');
      return;
    }

    try {
      setClocingIn(true);
      setSelectedLocation(location);
      const response = await api.post('/attendance/clock-in', { workLocation: location });
      setTodayAttendance(response.data.data);
      toast.success('🎉 Clock in request submitted! Waiting for admin approval.');
      setShowLocationDropdown(false);
      setSelectedLocation('');
      fetchAttendanceData();
    } catch (error) {
      console.error('Clock in error:', error);
      toast.error(error.response?.data?.message || 'Failed to clock in');
    } finally {
      setClocingIn(false);
      setSelectedLocation('');
    }
  };

  const handleClockOut = async () => {
    try {
      const response = await api.post('/attendance/clock-out');
      setTodayAttendance(response.data.data);
      toast.success('👋 Clocked out successfully!');
      fetchAttendanceData();
    } catch (error) {
      console.error('Clock out error:', error);
      toast.error(error.response?.data?.message || 'Failed to clock out');
    }
  };

  const handleStartBreak = async () => {
    try {
      const response = await api.post('/attendance/start-break');
      setTodayAttendance(response.data.data);
      toast.success('☕ Break started!');
      fetchAttendanceData();
    } catch (error) {
      console.error('Start break error:', error);
      toast.error(error.response?.data?.message || 'Failed to start break');
    }
  };

  const handleEndBreak = async () => {
    try {
      const response = await api.post('/attendance/end-break');
      setTodayAttendance(response.data.data);
      toast.success('✅ Break ended!');
      fetchAttendanceData();
    } catch (error) {
      console.error('End break error:', error);
      toast.error(error.response?.data?.message || 'Failed to end break');
    }
  };

  const isOnBreak = () => {
    if (!todayAttendance?.breaks || todayAttendance.breaks.length === 0) return false;
    const lastBreak = todayAttendance.breaks[todayAttendance.breaks.length - 1];
    return lastBreak.start && !lastBreak.end;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-accent-500';
      case 'absent':
        return 'bg-error-500';
      case 'late':
        return 'bg-warning-500';
      case 'pending':
        return 'bg-primary-500';
      default:
        return 'bg-text-muted';
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      present: 'bg-accent-50 text-accent-700 border-accent-200',
      absent: 'bg-error-50 text-error-700 border-error-200',
      late: 'bg-warning-50 text-warning-700 border-warning-200',
      pending: 'bg-primary-50 text-primary-700 border-primary-200',
    };
    return styles[status] || 'bg-background-secondary text-text-muted border-border';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            My Attendance
          </h1>
          <p className="text-text-secondary mt-1">Track your work hours and attendance records</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-background-card border border-border rounded-xl text-text-primary font-medium flex items-center gap-2 hover:bg-primary-50 transition-all shadow-sm"
        >
          <FiDownload />
          Download Report
        </motion.button>
      </motion.div>

      {/* Today's Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl shadow-custom-xl"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-700"
             style={{
               backgroundSize: '200% 200%',
               animation: 'gradient-x 15s ease infinite'
             }}
        />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-text-white mb-1">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h2>
              <p className="text-white/80 text-lg font-mono">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </p>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-4 h-4 rounded-full ${
                  todayAttendance?.status === 'present'
                    ? 'bg-accent-400 shadow-lg shadow-accent-500/50'
                    : todayAttendance?.status === 'pending'
                    ? 'bg-primary-400 shadow-lg shadow-primary-500/50'
                    : 'bg-error-400 shadow-lg shadow-error-500/50'
                }`}
              />
              <span className="text-text-white font-semibold text-lg">
                {todayAttendance?.status === 'present'
                  ? isOnBreak() ? '☕ ON BREAK' : '🟢 WORKING'
                  : todayAttendance?.status === 'pending'
                  ? '⏳ PENDING APPROVAL'
                  : todayAttendance?.clockOut 
                  ? '✅ COMPLETED' 
                  : '🔴 NOT CLOCKED IN'}
              </span>
            </div>
          </div>

          {/* Work Location Badge */}
          {todayAttendance?.workLocation && (
            <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur rounded-xl">
              <FiMapPin className="text-white" />
              <span className="text-white font-medium">
                Working from: {todayAttendance.workLocation === 'office' ? '🏢 Office' : '🏠 Home'}
              </span>
            </div>
          )}

          {/* Pending Approval Alert */}
          {todayAttendance?.status === 'pending' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-warning-500/20 backdrop-blur rounded-xl border border-warning-300/30"
            >
              <div className="flex items-center gap-3">
                <FiAlertCircle className="text-warning-300 text-xl" />
                <div>
                  <p className="text-white font-semibold">Waiting for Admin Approval</p>
                  <p className="text-white/80 text-sm">Your clock-in request is pending. You'll be notified once approved.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
              <p className="text-white/70 text-sm mb-1">Clock In</p>
              <p className="text-2xl font-bold text-text-white font-mono">
                {todayAttendance?.clockIn 
                  ? new Date(todayAttendance.clockIn).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })
                  : '--:--'}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
              <p className="text-white/70 text-sm mb-1">Clock Out</p>
              <p className="text-2xl font-bold text-text-white font-mono">
                {todayAttendance?.clockOut 
                  ? new Date(todayAttendance.clockOut).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })
                  : '--:--'}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
              <p className="text-white/70 text-sm mb-1">Work Duration</p>
              <p className="text-2xl font-bold text-text-white font-mono">{workDuration}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
              <p className="text-white/70 text-sm mb-1">Break Time</p>
              <p className="text-2xl font-bold text-text-white font-mono">{breakDuration}</p>
            </div>
          </div>

          {/* Action Buttons - FIXED: No absolute positioning */}
          <div className="space-y-3">
            {!todayAttendance?.clockIn ? (
              <div>
                {/* Clock In Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                  className="w-full py-4 bg-accent-500 hover:bg-accent-600 text-text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 text-lg"
                >
                  <FiClock className="text-2xl" />
                  Clock In
                  <FiChevronDown className={`transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* Location Dropdown - FIXED: Using normal flow instead of absolute */}
                <AnimatePresence>
                  {showLocationDropdown && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 bg-white/95 backdrop-blur-xl rounded-xl shadow-custom-xl border border-white/50 overflow-hidden"
                    >
                      <div className="p-4">
                        <p className="text-sm font-semibold text-text-primary mb-3">Select Work Location:</p>
                        
                        <div className="space-y-2">
                          <button
                            onClick={() => handleClockIn('office')}
                            disabled={clockingIn}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary-50 rounded-lg transition-all text-left group disabled:opacity-50"
                          >
                            <div className="p-2 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                              <FiBriefcase className="text-primary-600 text-xl" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-text-primary">Office</p>
                              <p className="text-xs text-text-secondary">Working from office premises</p>
                            </div>
                            {clockingIn && selectedLocation === 'office' && (
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-500 border-t-transparent" />
                            )}
                          </button>

                          <button
                            onClick={() => handleClockIn('home')}
                            disabled={clockingIn}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary-50 rounded-lg transition-all text-left group disabled:opacity-50"
                          >
                            <div className="p-2 bg-secondary-100 rounded-lg group-hover:bg-secondary-200 transition-colors">
                              <FiHome className="text-secondary-600 text-xl" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-text-primary">Home / Remote</p>
                              <p className="text-xs text-text-secondary">Working remotely</p>
                            </div>
                            {clockingIn && selectedLocation === 'home' && (
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-secondary-500 border-t-transparent" />
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : !todayAttendance?.clockOut ? (
              <div className="flex gap-4">
                {todayAttendance.status === 'present' && (
                  <>
                    {!isOnBreak() ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleStartBreak}
                        className="flex-1 py-4 bg-white/20 hover:bg-white/30 text-text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 text-lg backdrop-blur"
                      >
                        <FiCoffee className="text-2xl" />
                        Take Break
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleEndBreak}
                        className="flex-1 py-4 bg-warning-500 hover:bg-warning-600 text-text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 text-lg"
                      >
                        <FiCheck className="text-2xl" />
                        End Break
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleClockOut}
                      className="flex-1 py-4 bg-error-500 hover:bg-error-600 text-text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 text-lg"
                    >
                      <FiX className="text-2xl" />
                      Clock Out
                    </motion.button>
                  </>
                )}
                {todayAttendance.status === 'pending' && (
                  <div className="flex-1 py-4 bg-white/20 backdrop-blur rounded-xl text-text-white font-bold text-center text-lg">
                    ⏳ Waiting for admin approval to enable controls
                  </div>
                )}
              </div>
            ) : (
              <div className="py-4 bg-white/20 backdrop-blur rounded-xl text-text-white font-bold text-center text-lg">
                ✅ You've completed your work for today!
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Monthly Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Present Days',
            value: stats?.presentDays || 0,
            subtitle: `${stats?.attendancePercentage || 0}% this month`,
            icon: FiCheck,
            gradient: 'from-accent-500 to-accent-600',
            bgColor: 'bg-accent-50',
            iconColor: 'text-accent-600',
          },
          {
            title: 'Absent Days',
            value: stats?.absentDays || 0,
            subtitle: 'This month',
            icon: FiX,
            gradient: 'from-error-500 to-error-600',
            bgColor: 'bg-error-50',
            iconColor: 'text-error-600',
          },
          {
            title: 'Late Days',
            value: stats?.lateDays || 0,
            subtitle: 'This month',
            icon: FiAlertCircle,
            gradient: 'from-warning-500 to-warning-600',
            bgColor: 'bg-warning-50',
            iconColor: 'text-warning-600',
          },
          {
            title: 'Total Hours',
            value: `${stats?.totalHours || 0}h`,
            subtitle: 'This month',
            icon: FiClock,
            gradient: 'from-primary-500 to-primary-600',
            bgColor: 'bg-primary-50',
            iconColor: 'text-primary-600',
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className={`${stat.bgColor} rounded-2xl p-6 border border-border shadow-custom hover:shadow-custom-lg transition-all`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient}`}>
                  <Icon className="text-text-white text-2xl" />
                </div>
              </div>
              <h3 className="text-sm font-semibold text-text-secondary mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-text-primary mb-1">{stat.value}</p>
              <p className="text-xs text-text-muted">{stat.subtitle}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Pending Requests Alert */}
      {stats?.pendingDays > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary-50 border border-primary-200 rounded-2xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-500 rounded-xl">
              <FiAlertCircle className="text-text-white text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-primary-700">Pending Approval</h3>
              <p className="text-primary-600">
                You have {stats.pendingDays} attendance request(s) pending admin approval
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Attendance History Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-background-card rounded-2xl shadow-custom border border-border"
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">Attendance History</h2>
              <p className="text-text-secondary text-sm mt-1">Your recent attendance records</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-background-secondary">
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Clock In
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Clock Out
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Hours
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {attendanceHistory.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <FiCalendar className="mx-auto text-6xl text-text-muted mb-4" />
                    <p className="text-text-muted">No attendance records found</p>
                  </td>
                </tr>
              ) : (
                attendanceHistory.map((record, index) => (
                  <tr
                    key={record._id}
                    className="hover:bg-background-secondary transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(record.status)}`} />
                        <span className="text-sm font-medium text-text-primary">
                          {new Date(record.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-text-primary font-mono">
                        {record.clockIn
                          ? new Date(record.clockIn).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '--:--'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-text-primary font-mono">
                        {record.clockOut
                          ? new Date(record.clockOut).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '--:--'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {record.workLocation === 'office' ? (
                          <>
                            <FiBriefcase className="text-primary-500" />
                            <span className="text-sm text-text-primary">Office</span>
                          </>
                        ) : (
                          <>
                            <FiHome className="text-secondary-500" />
                            <span className="text-sm text-text-primary">Home</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-text-primary">
                        {record.totalHours ? `${record.totalHours}h` : '--'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                          record.status
                        )}`}
                      >
                        {record.status === 'present' && '✅ Present'}
                        {record.status === 'absent' && '❌ Absent'}
                        {record.status === 'late' && '⏰ Late'}
                        {record.status === 'pending' && '⏳ Pending'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default MyAttendance;
