import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { FiCheck, FiX, FiCalendar, FiClock, FiUser, FiFileText, FiMessageSquare, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('pending');
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const response = await api.get('/leaves');
      setLeaves(response.data.data || []);
    } catch (error) {
      console.error('Error fetching leaves:', error);
      toast.error('Failed to fetch leave requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (leave) => {
    if (window.confirm(`Approve leave request for ${leave.user?.name}?`)) {
      try {
        await api.put(`/leaves/${leave._id}`, {
          status: 'approved',
          adminNotes: 'Approved by admin',
        });
        toast.success(`Leave approved for ${leave.user?.name}!`);
        fetchLeaves();
        setShowDetailModal(false);
      } catch (error) {
        console.error('Error approving leave:', error);
        toast.error('Failed to approve leave');
      }
    }
  };

  const handleRejectClick = (leave) => {
    setSelectedLeave(leave);
    setShowRejectModal(true);
    setShowDetailModal(false);
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      await api.put(`/leaves/${selectedLeave._id}`, {
        status: 'rejected',
        adminNotes: rejectReason,
      });
      toast.success(`Leave rejected for ${selectedLeave.user?.name}`);
      fetchLeaves();
      setShowRejectModal(false);
      setRejectReason('');
      setSelectedLeave(null);
    } catch (error) {
      console.error('Error rejecting leave:', error);
      toast.error('Failed to reject leave');
    }
  };

  const handleViewDetails = (leave) => {
    setSelectedLeave(leave);
    setShowDetailModal(true);
  };

  const filteredLeaves = filterStatus === 'all' 
    ? leaves 
    : leaves.filter(leave => leave.status === filterStatus);

  const stats = {
    pending: leaves.filter(l => l.status === 'pending').length,
    approved: leaves.filter(l => l.status === 'approved').length,
    rejected: leaves.filter(l => l.status === 'rejected').length,
    total: leaves.length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getLeaveTypeColor = (type) => {
    switch (type) {
      case 'sick':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'casual':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'annual':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'maternity':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'paternity':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <FiCheck className="text-green-600" />;
      case 'rejected':
        return <FiX className="text-red-600" />;
      case 'pending':
        return <FiClock className="text-yellow-600" />;
      default:
        return <FiAlertCircle className="text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Leave Management
          </h1>
          <p className="text-gray-600 mt-1">Review and manage employee leave requests</p>
        </div>

        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="pending">⏳ Pending ({stats.pending})</option>
            <option value="approved">✅ Approved ({stats.approved})</option>
            <option value="rejected">❌ Rejected ({stats.rejected})</option>
            <option value="all">📋 All Requests ({stats.total})</option>
          </select>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg cursor-pointer"
          onClick={() => setFilterStatus('pending')}
        >
          <div className="flex items-center justify-between mb-2">
            <FiClock className="text-3xl text-yellow-100" />
            <div className="text-right">
              <p className="text-yellow-100 text-sm mb-1">Pending Review</p>
              <p className="text-4xl font-bold">{stats.pending}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-yellow-400/30">
            <p className="text-xs text-yellow-100">Click to filter</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-lg cursor-pointer"
          onClick={() => setFilterStatus('approved')}
        >
          <div className="flex items-center justify-between mb-2">
            <FiCheck className="text-3xl text-green-100" />
            <div className="text-right">
              <p className="text-green-100 text-sm mb-1">Approved</p>
              <p className="text-4xl font-bold">{stats.approved}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-green-400/30">
            <p className="text-xs text-green-100">Click to filter</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-gradient-to-br from-red-500 to-rose-500 rounded-2xl p-6 text-white shadow-lg cursor-pointer"
          onClick={() => setFilterStatus('rejected')}
        >
          <div className="flex items-center justify-between mb-2">
            <FiX className="text-3xl text-red-100" />
            <div className="text-right">
              <p className="text-red-100 text-sm mb-1">Rejected</p>
              <p className="text-4xl font-bold">{stats.rejected}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-red-400/30">
            <p className="text-xs text-red-100">Click to filter</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl p-6 text-white shadow-lg cursor-pointer"
          onClick={() => setFilterStatus('all')}
        >
          <div className="flex items-center justify-between mb-2">
            <FiFileText className="text-3xl text-purple-100" />
            <div className="text-right">
              <p className="text-purple-100 text-sm mb-1">Total Requests</p>
              <p className="text-4xl font-bold">{stats.total}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-purple-400/30">
            <p className="text-xs text-purple-100">Click to view all</p>
          </div>
        </motion.div>
      </div>

      {/* Leave Requests Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {filteredLeaves.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-12 text-center border border-white/20">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-lg font-semibold">No leave requests found</p>
            <p className="text-gray-400 text-sm mt-2">
              {filterStatus === 'pending' 
                ? 'All caught up! No pending requests to review.' 
                : `No ${filterStatus} requests at the moment.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence>
              {filteredLeaves.map((leave, index) => (
                <motion.div
                  key={leave._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {leave.user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{leave.user?.name}</h3>
                          <p className="text-xs text-gray-600">{leave.user?.department} • {leave.user?.designation}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 flex items-center gap-1 ${getStatusColor(leave.status)}`}>
                        {getStatusIcon(leave.status)}
                        {leave.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-4">
                    {/* Leave Type */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Leave Type</span>
                      <span className={`px-3 py-1 rounded-lg text-sm font-semibold border ${getLeaveTypeColor(leave.leaveType)}`}>
                        {leave.leaveType.toUpperCase()}
                      </span>
                    </div>

                    {/* Duration */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <FiCalendar className="text-blue-600" />
                          <span className="font-medium text-gray-700">
                            {new Date(leave.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="text-gray-400">→</span>
                          <span className="font-medium text-gray-700">
                            {new Date(leave.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-lg shadow-sm">
                          <FiClock className="text-purple-600 text-sm" />
                          <span className="font-bold text-gray-900 text-sm">{leave.numberOfDays} days</span>
                        </div>
                      </div>
                    </div>

                    {/* Reason */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <FiMessageSquare className="text-gray-400 text-sm" />
                        <span className="text-xs font-semibold text-gray-600 uppercase">Reason</span>
                      </div>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg line-clamp-2">
                        {leave.reason}
                      </p>
                    </div>

                    {/* Admin Notes (if rejected or approved) */}
                    {leave.adminNotes && leave.status !== 'pending' && (
                      <div className={`p-3 rounded-lg border-l-4 ${
                        leave.status === 'approved' 
                          ? 'bg-green-50 border-green-500' 
                          : 'bg-red-50 border-red-500'
                      }`}>
                        <p className="text-xs font-semibold text-gray-600 mb-1">Admin Notes:</p>
                        <p className="text-sm text-gray-700">{leave.adminNotes}</p>
                        {leave.approvedBy && (
                          <p className="text-xs text-gray-500 mt-1">
                            By {leave.approvedBy.name} • {new Date(leave.approvedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Footer - Actions */}
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleViewDetails(leave)}
                        className="flex-1 px-4 py-2 bg-white border-2 border-blue-500 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors font-medium text-sm"
                      >
                        View Details
                      </motion.button>

                      {leave.status === 'pending' && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleApprove(leave)}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-medium text-sm shadow-lg flex items-center justify-center gap-2"
                          >
                            <FiCheck className="text-lg" />
                            Approve
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRejectClick(leave)}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 transition-all font-medium text-sm shadow-lg flex items-center justify-center gap-2"
                          >
                            <FiX className="text-lg" />
                            Reject
                          </motion.button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedLeave && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <h2 className="text-2xl font-bold text-gray-900">Leave Request Details</h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Employee Info */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    {selectedLeave.user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedLeave.user?.name}</h3>
                    <p className="text-sm text-gray-600">{selectedLeave.user?.email}</p>
                    <p className="text-sm text-gray-600">{selectedLeave.user?.department} • {selectedLeave.user?.designation}</p>
                  </div>
                  <div className="ml-auto">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 flex items-center gap-2 ${getStatusColor(selectedLeave.status)}`}>
                      {getStatusIcon(selectedLeave.status)}
                      {selectedLeave.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Leave Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Leave Type</p>
                    <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold border ${getLeaveTypeColor(selectedLeave.leaveType)}`}>
                      {selectedLeave.leaveType.toUpperCase()}
                    </span>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Duration</p>
                    <div className="flex items-center gap-2">
                      <FiClock className="text-purple-600" />
                      <span className="font-bold text-gray-900">{selectedLeave.numberOfDays} days</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Start Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(selectedLeave.startDate).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-1">End Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(selectedLeave.endDate).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>

                {/* Reason */}
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FiMessageSquare className="text-blue-600" />
                    <p className="text-sm font-semibold text-gray-900">Reason for Leave</p>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedLeave.reason}</p>
                </div>

                {/* Admin Notes */}
                {selectedLeave.adminNotes && (
                  <div className={`p-4 rounded-xl border-2 ${
                    selectedLeave.status === 'approved' 
                      ? 'bg-green-50 border-green-300' 
                      : 'bg-red-50 border-red-300'
                  }`}>
                    <p className="text-sm font-semibold text-gray-900 mb-2">Admin Notes:</p>
                    <p className="text-sm text-gray-700">{selectedLeave.adminNotes}</p>
                    {selectedLeave.approvedBy && (
                      <p className="text-xs text-gray-500 mt-2">
                        By {selectedLeave.approvedBy.name} on {new Date(selectedLeave.approvedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium"
                >
                  Close
                </motion.button>

                {selectedLeave.status === 'pending' && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleApprove(selectedLeave)}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-medium shadow-lg flex items-center justify-center gap-2"
                    >
                      <FiCheck className="text-xl" />
                      Approve Leave
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleRejectClick(selectedLeave)}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 transition-all font-medium shadow-lg flex items-center justify-center gap-2"
                    >
                      <FiX className="text-xl" />
                      Reject Leave
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && selectedLeave && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowRejectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
            >
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-rose-50">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FiX className="text-red-600" />
                  Reject Leave Request
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm text-gray-700">
                    You are about to reject the leave request for <span className="font-bold">{selectedLeave.user?.name}</span>.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Reason for Rejection *
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows="4"
                    placeholder="Please provide a clear reason for rejecting this leave request..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium"
                >
                  Cancel
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRejectSubmit}
                  disabled={!rejectReason.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <FiX className="text-xl" />
                  Confirm Rejection
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LeaveManagement;
