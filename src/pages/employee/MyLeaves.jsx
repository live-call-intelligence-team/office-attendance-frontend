import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { toast } from 'react-toastify';
import {
  FiCalendar,
  FiCheck,
  FiX,
  FiClock,
  FiAlertCircle,
  FiFileText,
  FiTrendingUp,
  FiActivity,
} from 'react-icons/fi';

const MyLeaves = () => {
  const [loading, setLoading] = useState(true);
  const [leaves, setLeaves] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [leavesRes, balanceRes] = await Promise.all([
        api.get('/leaves/my-leaves'),
        api.get('/leaves/balance'),
      ]);

      setLeaves(leavesRes.data.data || []);
      setLeaveBalance(balanceRes.data.data);
    } catch (error) {
      console.error('Error fetching leave data:', error);
      toast.error('Failed to load leave data');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.leaveType) {
      newErrors.leaveType = 'Please select a leave type';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start > end) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    if (!formData.reason || formData.reason.trim().length < 10) {
      newErrors.reason = 'Reason must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/leaves/apply', formData);
      toast.success('✅ Leave application submitted successfully!');
      setShowApplyModal(false);
      setFormData({
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: '',
      });
      fetchData();
    } catch (error) {
      console.error('Error applying leave:', error);
      toast.error(error.response?.data?.message || 'Failed to apply for leave');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (leaveId) => {
    if (!window.confirm('Are you sure you want to cancel this leave request?')) {
      return;
    }

    try {
      await api.put(`/leaves/${leaveId}/cancel`);
      toast.success('Leave cancelled successfully');
      fetchData();
    } catch (error) {
      console.error('Error cancelling leave:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel leave');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-primary-50 text-primary-700 border-primary-200',
      approved: 'bg-accent-50 text-accent-700 border-accent-200',
      rejected: 'bg-error-50 text-error-700 border-error-200',
      cancelled: 'bg-text-muted text-text-secondary border-border',
    };
    return colors[status] || 'bg-background-secondary text-text-muted border-border';
  };

  const getLeaveTypeLabel = (type) => {
    const labels = {
      sick: 'Sick Leave',
      casual: 'Casual Leave',
      vacation: 'Vacation',
      personal: 'Personal Leave',
      emergency: 'Emergency Leave',
      unpaid: 'Unpaid Leave',
    };
    return labels[type] || type;
  };

  const filteredLeaves = leaves.filter(leave => {
    if (filterStatus === 'all') return true;
    return leave.status === filterStatus;
  });

  const stats = {
    total: leaves.length,
    pending: leaves.filter(l => l.status === 'pending').length,
    approved: leaves.filter(l => l.status === 'approved').length,
    rejected: leaves.filter(l => l.status === 'rejected').length,
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
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            My Leave Applications
          </h1>
          <p className="text-text-secondary mt-1">Manage your leave requests and balance</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowApplyModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <FiCalendar />
          Apply for Leave
        </motion.button>
      </div>

      {/* Leave Balance Cards */}
      {leaveBalance && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { type: 'sick', label: 'Sick Leave', icon: FiActivity, color: 'from-error-500 to-error-600', bg: 'bg-error-50' },
            { type: 'casual', label: 'Casual', icon: FiCalendar, color: 'from-primary-500 to-primary-600', bg: 'bg-primary-50' },
            { type: 'vacation', label: 'Vacation', icon: FiTrendingUp, color: 'from-accent-500 to-accent-600', bg: 'bg-accent-50' },
            { type: 'personal', label: 'Personal', icon: FiFileText, color: 'from-secondary-500 to-secondary-600', bg: 'bg-secondary-50' },
            { type: 'emergency', label: 'Emergency', icon: FiAlertCircle, color: 'from-warning-500 to-warning-600', bg: 'bg-warning-50' },
            { type: 'unpaid', label: 'Unpaid', icon: FiClock, color: 'from-text-muted to-text-secondary', bg: 'bg-background-secondary' },
          ].map((item, index) => {
            const Icon = item.icon;
            const balance = leaveBalance[item.type];
            return (
              <motion.div
                key={item.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${item.bg} rounded-2xl p-4 border border-border shadow-custom`}
              >
                <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color} w-fit mb-3`}>
                  <Icon className="text-text-white text-xl" />
                </div>
                <h3 className="text-xs font-semibold text-text-secondary mb-1">{item.label}</h3>
                <p className="text-2xl font-bold text-text-primary">{balance?.remaining || 0}</p>
                <p className="text-xs text-text-muted mt-1">
                  Used: {balance?.used || 0}/{balance?.total || 0}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Requests', value: stats.total, icon: FiFileText, color: 'text-primary-600' },
          { label: 'Pending', value: stats.pending, icon: FiClock, color: 'text-warning-600' },
          { label: 'Approved', value: stats.approved, icon: FiCheck, color: 'text-accent-600' },
          { label: 'Rejected', value: stats.rejected, icon: FiX, color: 'text-error-600' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="bg-background-card rounded-xl p-4 border border-border shadow-custom"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                </div>
                <Icon className={`text-3xl ${stat.color}`} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filter Tabs */}
      <div className="bg-background-card rounded-xl p-2 border border-border shadow-custom inline-flex gap-2">
        {[
          { label: 'All', value: 'all' },
          { label: 'Pending', value: 'pending' },
          { label: 'Approved', value: 'approved' },
          { label: 'Rejected', value: 'rejected' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilterStatus(tab.value)}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              filterStatus === tab.value
                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-text-white shadow-lg'
                : 'text-text-secondary hover:bg-background-secondary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Leave Requests List */}
      <div className="bg-background-card rounded-2xl shadow-custom border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-text-primary">Leave Requests</h2>
        </div>

        <div className="divide-y divide-border">
          {filteredLeaves.length === 0 ? (
            <div className="p-12 text-center">
              <FiCalendar className="mx-auto text-6xl text-text-muted mb-4" />
              <p className="text-text-muted text-lg">No leave requests found</p>
              <p className="text-text-secondary text-sm mt-2">Click "Apply for Leave" to submit a new request</p>
            </div>
          ) : (
            filteredLeaves.map((leave, index) => (
              <motion.div
                key={leave._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 hover:bg-background-secondary transition-colors"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(leave.status)}`}>
                        {leave.status === 'pending' && '⏳ Pending'}
                        {leave.status === 'approved' && '✅ Approved'}
                        {leave.status === 'rejected' && '❌ Rejected'}
                        {leave.status === 'cancelled' && '🚫 Cancelled'}
                      </span>
                      <span className="px-3 py-1 bg-background-secondary rounded-lg text-sm font-semibold text-text-primary">
                        {getLeaveTypeLabel(leave.leaveType)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-text-muted mb-1">Start Date</p>
                        <p className="text-sm font-semibold text-text-primary">
                          {new Date(leave.startDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-text-muted mb-1">End Date</p>
                        <p className="text-sm font-semibold text-text-primary">
                          {new Date(leave.endDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-text-muted mb-1">Duration</p>
                        <p className="text-sm font-semibold text-text-primary">
                          {leave.numberOfDays} {leave.numberOfDays === 1 ? 'day' : 'days'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-text-muted mb-1">Applied On</p>
                        <p className="text-sm font-semibold text-text-primary">
                          {new Date(leave.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-xs text-text-muted mb-1">Reason</p>
                      <p className="text-sm text-text-primary">{leave.reason}</p>
                    </div>

                    {leave.rejectionReason && (
                      <div className="p-3 bg-error-50 border border-error-200 rounded-lg">
                        <p className="text-xs font-semibold text-error-700 mb-1">Rejection Reason</p>
                        <p className="text-sm text-error-600">{leave.rejectionReason}</p>
                      </div>
                    )}

                    {leave.approvedBy && (
                      <p className="text-xs text-text-secondary mt-2">
                        {leave.status === 'approved' ? 'Approved' : 'Reviewed'} by {leave.approvedBy.name} on{' '}
                        {new Date(leave.approvedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-start">
                    {(leave.status === 'pending' || leave.status === 'approved') && (
                      <button
                        onClick={() => handleCancel(leave._id)}
                        className="px-4 py-2 bg-error-50 hover:bg-error-100 text-error-700 font-semibold rounded-lg transition-all border border-error-200"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Apply Leave Modal - FIXED: Remove fixed positioning that blocks scroll */}
      <AnimatePresence>
        {showApplyModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background-card rounded-2xl shadow-2xl max-w-2xl w-full my-8"
            >
              <div className="p-6 border-b border-border">
                <h3 className="text-2xl font-bold text-text-primary">Apply for Leave</h3>
                <p className="text-text-secondary text-sm mt-1">Fill in the details for your leave request</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Leave Type */}
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    Leave Type *
                  </label>
                  <select
                    value={formData.leaveType}
                    onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                    className={`w-full px-4 py-3 bg-background-secondary border ${
                      errors.leaveType ? 'border-error-500' : 'border-border'
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-text-primary`}
                  >
                    <option value="">Select leave type</option>
                    <option value="sick">Sick Leave</option>
                    <option value="casual">Casual Leave</option>
                    <option value="vacation">Vacation</option>
                    <option value="personal">Personal Leave</option>
                    <option value="emergency">Emergency Leave</option>
                    <option value="unpaid">Unpaid Leave</option>
                  </select>
                  {errors.leaveType && (
                    <p className="mt-1 text-sm text-error-600">{errors.leaveType}</p>
                  )}
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 bg-background-secondary border ${
                        errors.startDate ? 'border-error-500' : 'border-border'
                      } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-text-primary`}
                    />
                    {errors.startDate && (
                      <p className="mt-1 text-sm text-error-600">{errors.startDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      min={formData.startDate || new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 bg-background-secondary border ${
                        errors.endDate ? 'border-error-500' : 'border-border'
                      } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-text-primary`}
                    />
                    {errors.endDate && (
                      <p className="mt-1 text-sm text-error-600">{errors.endDate}</p>
                    )}
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    Reason *
                  </label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Please provide a detailed reason for your leave request..."
                    rows={4}
                    maxLength={500}
                    className={`w-full px-4 py-3 bg-background-secondary border ${
                      errors.reason ? 'border-error-500' : 'border-border'
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-text-primary resize-none`}
                  />
                  {errors.reason && (
                    <p className="mt-1 text-sm text-error-600">{errors.reason}</p>
                  )}
                  <p className="mt-1 text-xs text-text-muted">
                    {formData.reason.length}/500 characters
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </motion.button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowApplyModal(false);
                      setErrors({});
                      setFormData({
                        leaveType: '',
                        startDate: '',
                        endDate: '',
                        reason: '',
                      });
                    }}
                    className="px-6 py-3 bg-background-secondary hover:bg-border text-text-primary font-semibold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyLeaves;
