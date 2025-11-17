// src/components/employee/LeaveApplication.jsx

import { useState, useEffect } from 'react';
import { FiCalendar, FiFileText } from 'react-icons/fi';
import { LEAVE_TYPES, ANNUAL_LEAVE_BALANCE } from '../../utils/constants';
import { validateLeaveApplication } from '../../utils/validation';
import { getDaysDifference, countWorkingDays } from '../../utils/dateUtils';
import { toast } from 'react-toastify';

const LeaveApplication = ({ onSubmit, onCancel, loading = false, leaveBalance = {} }) => {
    const [formData, setFormData] = useState({
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: '',
    });

    const [errors, setErrors] = useState({});
    const [leaveDays, setLeaveDays] = useState(0);
    const [availableBalance, setAvailableBalance] = useState(0);

    // Calculate leave days
    useEffect(() => {
        if (formData.startDate && formData.endDate) {
            const days = countWorkingDays(formData.startDate, formData.endDate);
            setLeaveDays(days);
        } else {
            setLeaveDays(0);
        }
    }, [formData.startDate, formData.endDate]);

    // Update available balance based on leave type
    useEffect(() => {
        if (formData.leaveType) {
            const balance = leaveBalance[formData.leaveType] || 0;
            setAvailableBalance(balance);
        }
    }, [formData.leaveType, leaveBalance]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate
        const validationErrors = validateLeaveApplication(formData);

        // Check if enough leave balance (except for unpaid leave)
        if (formData.leaveType !== LEAVE_TYPES.UNPAID && leaveDays > availableBalance) {
            validationErrors.leaveType = `Insufficient balance. You have ${availableBalance} days available.`;
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error('Please fix the errors in the form');
            return;
        }

        // Submit
        onSubmit({
            ...formData,
            numberOfDays: leaveDays,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Leave Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Leave Type <span className="text-red-500">*</span>
                </label>
                <select
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleChange}
                    className={`input-field ${errors.leaveType ? 'input-error' : ''}`}
                >
                    <option value="">Select Leave Type</option>
                    <option value={LEAVE_TYPES.CASUAL}>Casual Leave</option>
                    <option value={LEAVE_TYPES.SICK}>Sick Leave</option>
                    <option value={LEAVE_TYPES.VACATION}>Vacation</option>
                    <option value={LEAVE_TYPES.WFH}>Work From Home</option>
                    <option value={LEAVE_TYPES.UNPAID}>Unpaid Leave</option>
                </select>
                {errors.leaveType && <p className="mt-1 text-sm text-red-600">{errors.leaveType}</p>}

                {/* Show balance */}
                {formData.leaveType && formData.leaveType !== LEAVE_TYPES.UNPAID && (
                    <p className="mt-2 text-sm text-gray-600">
                        Available Balance: <span className="font-semibold text-primary-600">{availableBalance} days</span>
                    </p>
                )}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Start Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiCalendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className={`input-field pl-10 ${errors.startDate ? 'input-error' : ''}`}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                    {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
                </div>

                {/* End Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiCalendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            className={`input-field pl-10 ${errors.endDate ? 'input-error' : ''}`}
                            min={formData.startDate || new Date().toISOString().split('T')[0]}
                        />
                    </div>
                    {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
                </div>
            </div>

            {/* Leave Days Info */}
            {leaveDays > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                        <span className="font-semibold">Total Working Days:</span> {leaveDays} day{leaveDays !== 1 ? 's' : ''}
                    </p>
                    {formData.leaveType && formData.leaveType !== LEAVE_TYPES.UNPAID && (
                        <p className="text-sm text-blue-800 mt-1">
                            <span className="font-semibold">Remaining Balance:</span> {Math.max(0, availableBalance - leaveDays)} day{Math.max(0, availableBalance - leaveDays) !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>
            )}

            {/* Reason */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                        <FiFileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        className={`input-field pl-10 ${errors.reason ? 'input-error' : ''}`}
                        placeholder="Please provide a reason for your leave request..."
                        rows="4"
                    />
                </div>
                {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason}</p>}
                <p className="mt-1 text-xs text-gray-500">
                    {formData.reason.length}/500 characters
                </p>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn-secondary"
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                >
                    {loading ? (
                        <span className="flex items-center">
                            <div className="spinner mr-2"></div>
                            Submitting...
                        </span>
                    ) : (
                        'Submit Leave Request'
                    )}
                </button>
            </div>
        </form>
    );
};

export default LeaveApplication;