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
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  FiTrendingUp,
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiCalendar,
  FiFileText,
  FiDownload,
  FiFilter,
} from 'react-icons/fi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [reportType, setReportType] = useState('attendance');
  const [reportStartDate, setReportStartDate] = useState('');
  const [reportEndDate, setReportEndDate] = useState('');
  const [reportDepartment, setReportDepartment] = useState('all');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/analytics/admin?period=${period}`);
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!reportStartDate || !reportEndDate) {
      toast.error('Please select date range');
      return;
    }

    try {
      const response = await api.get('/analytics/reports/attendance', {
        params: {
          startDate: reportStartDate,
          endDate: reportEndDate,
          department: reportDepartment,
        },
      });

      // Download as JSON
      const dataStr = JSON.stringify(response.data.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `attendance-report-${reportStartDate}-to-${reportEndDate}.json`;
      link.click();

      toast.success('Report generated successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-text-muted text-lg">No analytics data available</p>
      </div>
    );
  }

  // Chart configurations
  const attendanceTrendData = {
    labels: analytics.trends.daily.map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Present',
        data: analytics.trends.daily.map(d => d.present),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Absent',
        data: analytics.trends.daily.map(d => d.absent),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Late',
        data: analytics.trends.daily.map(d => d.late),
        borderColor: 'rgb(251, 146, 60)',
        backgroundColor: 'rgba(251, 146, 60, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const departmentData = {
    labels: Object.keys(analytics.departmentStats),
    datasets: [
      {
        label: 'Present',
        data: Object.values(analytics.departmentStats).map(d => d.present),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      },
      {
        label: 'Absent',
        data: Object.values(analytics.departmentStats).map(d => d.absent),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
      },
      {
        label: 'Late',
        data: Object.values(analytics.departmentStats).map(d => d.late),
        backgroundColor: 'rgba(251, 146, 60, 0.8)',
      },
    ],
  };

  const leaveTypeData = {
    labels: Object.keys(analytics.leaves.typeBreakdown).map(key => 
      key.charAt(0).toUpperCase() + key.slice(1)
    ),
    datasets: [
      {
        data: Object.values(analytics.leaves.typeBreakdown),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(14, 165, 233, 0.8)',
        ],
      },
    ],
  };

  const taskPriorityData = {
    labels: ['Urgent', 'High', 'Normal', 'Low'],
    datasets: [
      {
        data: [
          analytics.tasks.priorityBreakdown.urgent,
          analytics.tasks.priorityBreakdown.high,
          analytics.tasks.priorityBreakdown.normal,
          analytics.tasks.priorityBreakdown.low,
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(156, 163, 175, 0.8)',
        ],
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Analytics & Reports
          </h1>
          <p className="text-text-secondary mt-1">Comprehensive insights and performance metrics</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 bg-background-card border border-border rounded-xl text-text-primary font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Total Employees</p>
              <p className="text-3xl font-bold mt-1">{analytics.overview.totalEmployees}</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <FiUsers className="text-3xl" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-500 to-accent-600 rounded-2xl p-6 text-text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Attendance Rate</p>
              <p className="text-3xl font-bold mt-1">{analytics.overview.attendanceRate}%</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <FiCheckCircle className="text-3xl" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Total Work Hours</p>
              <p className="text-3xl font-bold mt-1">{analytics.overview.totalWorkHours.toFixed(0)}</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <FiClock className="text-3xl" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-orange-500 to-warning-600 rounded-2xl p-6 text-text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Avg Work Hours</p>
              <p className="text-3xl font-bold mt-1">{analytics.overview.avgWorkHours}</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <FiTrendingUp className="text-3xl" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl p-6 text-text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Task Completion</p>
              <p className="text-3xl font-bold mt-1">{analytics.overview.completionRate}%</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <FiCheckCircle className="text-3xl" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <div className="bg-background-card rounded-2xl p-6 border border-border shadow-custom">
          <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <FiTrendingUp className="text-primary-500" />
            Attendance Trend (Last 30 Days)
          </h3>
          <div className="h-80">
            <Line data={attendanceTrendData} options={chartOptions} />
          </div>
        </div>

        {/* Department-wise Attendance */}
        <div className="bg-background-card rounded-2xl p-6 border border-border shadow-custom">
          <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <FiUsers className="text-primary-500" />
            Department-wise Attendance
          </h3>
          <div className="h-80">
            <Bar data={departmentData} options={chartOptions} />
          </div>
        </div>

        {/* Leave Type Distribution */}
        <div className="bg-background-card rounded-2xl p-6 border border-border shadow-custom">
          <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <FiCalendar className="text-primary-500" />
            Leave Type Distribution
          </h3>
          <div className="h-80 flex items-center justify-center">
            <div className="w-64 h-64">
              <Doughnut data={leaveTypeData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Task Priority Breakdown */}
        <div className="bg-background-card rounded-2xl p-6 border border-border shadow-custom">
          <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <FiCheckCircle className="text-primary-500" />
            Task Priority Breakdown
          </h3>
          <div className="h-80 flex items-center justify-center">
            <div className="w-64 h-64">
              <Doughnut data={taskPriorityData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-background-card rounded-2xl p-6 border border-border shadow-custom">
        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <FiTrendingUp className="text-primary-500" />
          Top Performers (By Attendance)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {analytics.topPerformers.map((emp, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-background-secondary rounded-xl p-4 text-center border border-border"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-text-white font-bold text-xl mx-auto mb-3">
                {emp.name.charAt(0).toUpperCase()}
              </div>
              <p className="font-bold text-text-primary">{emp.name}</p>
              <p className="text-2xl font-bold text-primary-600 mt-2">{emp.attendanceRate}%</p>
              <p className="text-xs text-text-muted mt-1">{emp.workHours.toFixed(1)} hrs</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Report Generator */}
      <div className="bg-background-card rounded-2xl p-6 border border-border shadow-custom">
        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <FiFileText className="text-primary-500" />
          Generate Custom Report
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-3 bg-background-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-text-primary"
            >
              <option value="attendance">Attendance Report</option>
              <option value="leave">Leave Report</option>
              <option value="task">Task Report</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">Start Date</label>
            <input
              type="date"
              value={reportStartDate}
              onChange={(e) => setReportStartDate(e.target.value)}
              className="w-full px-4 py-3 bg-background-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-text-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">End Date</label>
            <input
              type="date"
              value={reportEndDate}
              onChange={(e) => setReportEndDate(e.target.value)}
              className="w-full px-4 py-3 bg-background-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-text-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">Department</label>
            <select
              value={reportDepartment}
              onChange={(e) => setReportDepartment(e.target.value)}
              className="w-full px-4 py-3 bg-background-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-text-primary"
            >
              <option value="all">All Departments</option>
              {Object.keys(analytics.departmentStats).map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerateReport}
          className="mt-4 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <FiDownload />
          Generate & Download Report
        </motion.button>
      </div>
    </div>
  );
};

export default Analytics;
