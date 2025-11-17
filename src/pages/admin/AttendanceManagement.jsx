import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { toast } from 'react-toastify';
import {
  FiCheck,
  FiX,
  FiClock,
  FiMapPin,
  FiUser,
  FiBriefcase,
  FiHome,
  FiAlertCircle,
  FiCheckSquare,
  FiSearch,
  FiFilter,
} from 'react-icons/fi';

const AttendanceManagement = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [employeesRes, pendingRes] = await Promise.all([
        api.get('/attendance/all-employees'),
        api.get('/attendance/pending'),
      ]);
      
      setEmployees(employeesRes.data.data || []);
      setPendingRequests(pendingRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const handleManualMark = async (userId, status) => {
    try {
      setProcessing(true);
      await api.post('/attendance/mark-manual', { userId, status });
      toast.success(`✅ Marked as ${status}`);
      fetchData();
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setProcessing(false);
    }
  };

  const handleBulkMark = async (status) => {
    if (selectedEmployees.length === 0) {
      toast.error('Please select at least one employee');
      return;
    }

    try {
      setProcessing(true);
      await api.post('/attendance/bulk-mark', {
        userIds: selectedEmployees,
        status,
      });
      toast.success(`✅ ${selectedEmployees.length} employee(s) marked as ${status}`);
      setSelectedEmployees([]);
      fetchData();
    } catch (error) {
      console.error('Error bulk marking:', error);
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setProcessing(false);
    }
  };

  const handleApprovePending = async (attendanceId, status, rejectionReason = '') => {
    try {
      setProcessing(true);
      await api.put(`/attendance/${attendanceId}/approve`, { status, rejectionReason });
      toast.success(`✅ Attendance ${status}`);
      fetchData();
    } catch (error) {
      console.error('Error approving:', error);
      toast.error(error.response?.data?.message || 'Failed to approve attendance');
    } finally {
      setProcessing(false);
    }
  };

  const toggleSelectEmployee = (empId) => {
    setSelectedEmployees(prev =>
      prev.includes(empId)
        ? prev.filter(id => id !== empId)
        : [...prev, empId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map(emp => emp._id));
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

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'unmarked') return matchesSearch && !emp.attendance;
    return matchesSearch && emp.attendance?.status === filterStatus;
  });

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
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          Attendance Management
        </h1>
        <p className="text-text-secondary mt-1">Manage employee attendance and approve requests</p>
      </div>

      {/* Alerts */}
      {pendingRequests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-warning-50 border border-warning-200 rounded-2xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-warning-500 rounded-xl">
              <FiAlertCircle className="text-text-white text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-warning-700">Pending Clock-In Approvals</h3>
              <p className="text-warning-600">
                {pendingRequests.length} employee(s) waiting for clock-in approval (scroll down to approve)
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Employee List - Manual Marking */}
      <div className="bg-background-card rounded-2xl shadow-custom border border-border">
        <div className="p-6 border-b border-border">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-text-primary">Employee Attendance</h2>
              <p className="text-sm text-text-secondary">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search employee..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-background-secondary border border-border rounded-xl text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-background-secondary border border-border rounded-xl text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="unmarked">Unmarked</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="pending">Pending</option>
              </select>

              {/* Bulk Actions */}
              {selectedEmployees.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkMark('present')}
                    disabled={processing}
                    className="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-text-white rounded-xl text-sm font-semibold disabled:opacity-50 transition-all"
                  >
                    Mark {selectedEmployees.length} as Present
                  </button>
                  <button
                    onClick={() => handleBulkMark('absent')}
                    disabled={processing}
                    className="px-4 py-2 bg-error-500 hover:bg-error-600 text-text-white rounded-xl text-sm font-semibold disabled:opacity-50 transition-all"
                  >
                    Mark {selectedEmployees.length} as Absent
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-background-secondary">
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0}
                    onChange={toggleSelectAll}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase">Employee</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase">Department</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase">Clock In</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase">Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <p className="text-text-muted">No employees found</p>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-background-secondary transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(emp._id)}
                        onChange={() => toggleSelectEmployee(emp._id)}
                        className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-text-white font-bold">
                          {emp.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-text-primary">{emp.name}</p>
                          <p className="text-xs text-text-secondary">{emp.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-text-primary">{emp.department}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-text-primary font-mono">
                        {emp.attendance?.clockIn
                          ? new Date(emp.attendance.clockIn).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '--:--'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {emp.attendance?.workLocation ? (
                        <div className="flex items-center gap-2">
                          {emp.attendance.workLocation === 'office' ? (
                            <>
                              <FiBriefcase className="text-primary-500" />
                              <span className="text-sm">Office</span>
                            </>
                          ) : (
                            <>
                              <FiHome className="text-secondary-500" />
                              <span className="text-sm">Home</span>
                            </>
                          )}
                        </div>
                      ) : (
                        <span className="text-text-muted text-sm">--</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {emp.attendance ? (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(emp.attendance.status)}`}>
                          {emp.attendance.status === 'present' && '✅ Present'}
                          {emp.attendance.status === 'absent' && '❌ Absent'}
                          {emp.attendance.status === 'late' && '⏰ Late'}
                          {emp.attendance.status === 'pending' && '⏳ Pending'}
                        </span>
                      ) : (
                        <span className="text-text-muted text-sm">Not Marked</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleManualMark(emp._id, 'present')}
                          disabled={processing || emp.attendance?.status === 'present'}
                          className="p-2 bg-accent-500 hover:bg-accent-600 text-text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          title="Mark Present"
                        >
                          <FiCheck />
                        </button>
                        <button
                          onClick={() => handleManualMark(emp._id, 'absent')}
                          disabled={processing || emp.attendance?.status === 'absent'}
                          className="p-2 bg-error-500 hover:bg-error-600 text-text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          title="Mark Absent"
                        >
                          <FiX />
                        </button>
                        <button
                          onClick={() => handleManualMark(emp._id, 'late')}
                          disabled={processing || emp.attendance?.status === 'late'}
                          className="p-2 bg-warning-500 hover:bg-warning-600 text-text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          title="Mark Late"
                        >
                          <FiClock />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-border bg-background-secondary">
          <p className="text-sm text-text-muted">
            Showing {filteredEmployees.length} of {employees.length} employees
            {selectedEmployees.length > 0 && ` • ${selectedEmployees.length} selected`}
          </p>
        </div>
      </div>

      {/* Pending Clock-In Requests */}
      {pendingRequests.length > 0 && (
        <div className="bg-background-card rounded-2xl shadow-custom border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold text-text-primary">Pending Clock-In Requests</h2>
            <p className="text-sm text-text-secondary">Review and approve employee clock-in requests</p>
          </div>

          <div className="divide-y divide-border">
            {pendingRequests.map((request, index) => (
              <motion.div
                key={request._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 hover:bg-background-secondary transition-colors"
              >
                <div className="flex items-start justify-between gap-6 flex-wrap">
                  {/* Employee Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-text-white font-bold text-lg">
                      {request.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-text-primary">{request.user?.name}</h3>
                      <p className="text-sm text-text-secondary">
                        {request.user?.employeeId} • {request.user?.department}
                      </p>
                    </div>
                  </div>

                  {/* Request Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-text-muted mb-1">Date</p>
                      <p className="text-sm font-semibold text-text-primary">
                        {new Date(request.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted mb-1">Clock In</p>
                      <p className="text-sm font-semibold text-text-primary font-mono">
                        {new Date(request.clockIn).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted mb-1">Location</p>
                      <div className="flex items-center gap-2">
                        {request.workLocation === 'office' ? (
                          <>
                            <FiBriefcase className="text-primary-500" />
                            <span className="text-sm font-semibold">Office</span>
                          </>
                        ) : (
                          <>
                            <FiHome className="text-secondary-500" />
                            <span className="text-sm font-semibold">Home</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted mb-1">Submitted</p>
                      <p className="text-sm font-semibold text-text-primary">
                        {new Date(request.createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprovePending(request._id, 'present')}
                      disabled={processing}
                      className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-text-white font-semibold rounded-xl shadow-lg flex items-center gap-2 disabled:opacity-50 transition-all"
                    >
                      <FiCheck />
                      Present
                    </button>
                    <button
                      onClick={() => handleApprovePending(request._id, 'late')}
                      disabled={processing}
                      className="px-6 py-3 bg-warning-500 hover:bg-warning-600 text-text-white font-semibold rounded-xl shadow-lg flex items-center gap-2 disabled:opacity-50 transition-all"
                    >
                      <FiClock />
                      Late
                    </button>
                    <button
                      onClick={() => handleApprovePending(request._id, 'absent')}
                      disabled={processing}
                      className="px-6 py-3 bg-error-500 hover:bg-error-600 text-text-white font-semibold rounded-xl shadow-lg flex items-center gap-2 disabled:opacity-50 transition-all"
                    >
                      <FiX />
                      Absent
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;
