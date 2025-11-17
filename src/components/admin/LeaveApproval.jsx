// src/components/admin/LeaveApproval.jsx

import { useState } from 'react';
import { FiCheck, FiX, FiCalendar, FiUser, FiClock, FiMessageSquare } from 'react-icons/fi';
import { formatDate, getDaysDifference } from '../../utils/dateUtils';
import { getStatusColor } from '../../utils/helpers';
import { LEAVE_STATUS } from '../../utils/constants';
import Modal from '../common/Modal';

const LeaveApproval = ({
    leaves = [],
    onApprove,
    onReject,
    loading = false
}) => {
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectRemark, setRejectRemark] = useState('');

    const getLeaveTypeLabel = (type) => {
        const labels = {
            'CASUAL_LEAVE': 'Casual Leave',
            'SICK_LEAVE': 'Sick Leave',
            'VACATION': 'Vacation',
            'WFH': 'Work From Home',
            'UNPAID_LEAVE': 'Unpaid Leave',
        };
        return labels[type] || type;
    };

    const handleApproveClick = (leave) => {
        if (window.confirm(`Approve leave request for ${leave.employee?.name}?`)) {
            onApprove(leave._id);
        }
    };

    const handleRejectClick = (leave) => {
        setSelectedLeave(leave);
        setShowRejectModal(true);
    };

    const handleRejectConfirm = () => {
        if (!rejectRemark.trim()) {
            alert('Please provide a reason for rejection');
            return;
        }
        onReject(selectedLeave._id, rejectRemark);
        setShowRejectModal(false);
        setRejectRemark('');
        setSelectedLeave(null);
    };

    if (leaves.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiCalendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Leave Requests</h3>
                <p className="text-gray-600">There are no pending leave requests at the moment.</p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                {leaves.map((leave) => (
                    <div
                        key={leave._id}
                        className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            {/* Left Section - Employee Info */}
                            <div className="flex-1 mb-4 lg:mb-0">
                                <div className="flex items-center mb-3">
                                    <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                                        {leave.employee?.name?.charAt(0) || 'E'}
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {leave.employee?.name || 'Unknown Employee'}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {leave.employee?.employeeId} • {leave.employee?.department}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                    <div className="flex items-center text-gray-600">
                                        <FiCalendar className="w-4 h-4 mr-2" />
                                        <span className="font-medium mr-1">Leave Type:</span>
                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                            {getLeaveTypeLabel(leave.leaveType)}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <FiClock className="w-4 h-4 mr-2" />
                                        <span className="font-medium mr-1">Duration:</span>
                                        {leave.numberOfDays} day{leave.numberOfDays !== 1 ? 's' : ''}
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <FiCalendar className="w-4 h-4 mr-2" />
                                        <span className="font-medium mr-1">From:</span>
                                        {formatDate(leave.startDate, 'MMM dd, yyyy')}
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <FiCalendar className="w-4 h-4 mr-2" />
                                        <span className="font-medium mr-1">To:</span>
                                        {formatDate(leave.endDate, 'MMM dd, yyyy')}
                                    </div>
                                </div>

                                {/* Reason */}
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs font-medium text-gray-700 mb-1 flex items-center">
                                        <FiMessageSquare className="w-3 h-3 mr-1" />
                                        Reason:
                                    </p>
                                    <p className="text-sm text-gray-600">{leave.reason}</p>
                                </div>

                                {/* Status Badge */}
                                <div className="mt-3">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(leave.status)}`}>
                                        {leave.status}
                                    </span>
                                    <span className="ml-2 text-xs text-gray-500">
                                        Applied on {formatDate(leave.createdAt, 'MMM dd, yyyy')}
                                    </span>
                                </div>
                            </div>

                            {/* Right Section - Actions */}
                            {leave.status === LEAVE_STATUS.PENDING && (
                                <div className="flex flex-col space-y-2 lg:ml-6">
                                    <button
                                        onClick={() => handleApproveClick(leave)}
                                        disabled={loading}
                                        className="btn-success flex items-center justify-center min-w-[140px]"
                                    >
                                        <FiCheck className="w-4 h-4 mr-2" />
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleRejectClick(leave)}
                                        disabled={loading}
                                        className="btn-danger flex items-center justify-center min-w-[140px]"
                                    >
                                        <FiX className="w-4 h-4 mr-2" />
                                        Reject
                                    </button>
                                </div>
                            )}

                            {/* Show remarks if approved/rejected */}
                            {leave.status !== LEAVE_STATUS.PENDING && leave.remarks && (
                                <div className="lg:ml-6 mt-3 lg:mt-0">
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs font-medium text-gray-700 mb-1">Admin Remarks:</p>
                                        <p className="text-sm text-gray-600">{leave.remarks}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Reject Modal */}
            <Modal
                isOpen={showRejectModal}
                onClose={() => {
                    setShowRejectModal(false);
                    setRejectRemark('');
                    setSelectedLeave(null);
                }}
                title="Reject Leave Request"
                size="md"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Please provide a reason for rejecting this leave request:
                    </p>
                    <textarea
                        value={rejectRemark}
                        onChange={(e) => setRejectRemark(e.target.value)}
                        className="input-field"
                        placeholder="Enter reason for rejection..."
                        rows="4"
                    />
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={() => {
                                setShowRejectModal(false);
                                setRejectRemark('');
                                setSelectedLeave(null);
                            }}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleRejectConfirm}
                            className="btn-danger"
                            disabled={!rejectRemark.trim()}
                        >
                            Confirm Rejection
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default LeaveApproval;