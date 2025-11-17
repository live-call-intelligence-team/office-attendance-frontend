// src/components/admin/EmployeeForm.jsx

import { useState, useEffect } from 'react';
import { FiX, FiUser, FiMail, FiPhone, FiBriefcase, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { DEPARTMENTS } from '../../utils/constants';
import { validateEmployee } from '../../utils/validation';
import { toast } from 'react-toastify';

const EmployeeForm = ({ employee = null, onSubmit, onCancel, loading = false }) => {
    const isEditMode = !!employee;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        employeeId: '',
        department: '',
        designation: '',
        salary: '',
        joiningDate: '',
        address: '',
        emergencyContact: '',
        emergencyContactName: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});

    // Populate form if editing
    useEffect(() => {
        if (employee) {
            setFormData({
                name: employee.name || '',
                email: employee.email || '',
                phone: employee.phone || '',
                employeeId: employee.employeeId || '',
                department: employee.department || '',
                designation: employee.designation || '',
                salary: employee.salary || '',
                joiningDate: employee.joiningDate ? new Date(employee.joiningDate).toISOString().split('T')[0] : '',
                address: employee.address || '',
                emergencyContact: employee.emergencyContact || '',
                emergencyContactName: employee.emergencyContactName || '',
                password: '',
                confirmPassword: '',
            });
        }
    }, [employee]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user types
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
        const validationErrors = validateEmployee({
            ...formData,
            isNew: !isEditMode,
        });

        // Check password match for new employee
        if (!isEditMode && formData.password !== formData.confirmPassword) {
            validationErrors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error('Please fix the errors in the form');
            return;
        }

        // Submit
        const submitData = { ...formData };
        if (isEditMode) {
            delete submitData.password;
            delete submitData.confirmPassword;
        }
        onSubmit(submitData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiUser className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`input-field pl-10 ${errors.name ? 'input-error' : ''}`}
                                placeholder="Enter full name"
                            />
                        </div>
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiMail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`input-field pl-10 ${errors.email ? 'input-error' : ''}`}
                                placeholder="employee@company.com"
                            />
                        </div>
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiPhone className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`input-field pl-10 ${errors.phone ? 'input-error' : ''}`}
                                placeholder="9876543210"
                                maxLength="10"
                            />
                        </div>
                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                    </div>

                    {/* Employee ID */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Employee ID {!isEditMode && <span className="text-red-500">*</span>}
                        </label>
                        <input
                            type="text"
                            name="employeeId"
                            value={formData.employeeId}
                            onChange={handleChange}
                            className={`input-field ${errors.employeeId ? 'input-error' : ''}`}
                            placeholder="EMP001"
                            disabled={isEditMode}
                        />
                        {errors.employeeId && <p className="mt-1 text-sm text-red-600">{errors.employeeId}</p>}
                    </div>
                </div>
            </div>

            {/* Professional Information */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Department */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Department <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className={`input-field ${errors.department ? 'input-error' : ''}`}
                        >
                            <option value="">Select Department</option>
                            {DEPARTMENTS.map((dept) => (
                                <option key={dept} value={dept}>
                                    {dept}
                                </option>
                            ))}
                        </select>
                        {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
                    </div>

                    {/* Designation */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Designation <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiBriefcase className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                className={`input-field pl-10 ${errors.designation ? 'input-error' : ''}`}
                                placeholder="Software Engineer"
                            />
                        </div>
                        {errors.designation && <p className="mt-1 text-sm text-red-600">{errors.designation}</p>}
                    </div>

                    {/* Salary */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Monthly Salary (₹) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiDollarSign className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="number"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                className={`input-field pl-10 ${errors.salary ? 'input-error' : ''}`}
                                placeholder="50000"
                                min="0"
                            />
                        </div>
                        {errors.salary && <p className="mt-1 text-sm text-red-600">{errors.salary}</p>}
                    </div>

                    {/* Joining Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Joining Date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiCalendar className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="date"
                                name="joiningDate"
                                value={formData.joiningDate}
                                onChange={handleChange}
                                className={`input-field pl-10 ${errors.joiningDate ? 'input-error' : ''}`}
                                max={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        {errors.joiningDate && <p className="mt-1 text-sm text-red-600">{errors.joiningDate}</p>}
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Address */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address
                        </label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Enter full address"
                            rows="3"
                        />
                    </div>

                    {/* Emergency Contact Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Emergency Contact Name
                        </label>
                        <input
                            type="text"
                            name="emergencyContactName"
                            value={formData.emergencyContactName}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Contact person name"
                        />
                    </div>

                    {/* Emergency Contact Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Emergency Contact Number
                        </label>
                        <input
                            type="tel"
                            name="emergencyContact"
                            value={formData.emergencyContact}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="9876543210"
                            maxLength="10"
                        />
                    </div>
                </div>
            </div>

            {/* Password (Only for new employee) */}
            {!isEditMode && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Login Credentials</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`input-field ${errors.password ? 'input-error' : ''}`}
                                placeholder="Enter password"
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`input-field ${errors.confirmPassword ? 'input-error' : ''}`}
                                placeholder="Confirm password"
                            />
                            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                        </div>
                    </div>
                </div>
            )}

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
                            {isEditMode ? 'Updating...' : 'Creating...'}
                        </span>
                    ) : (
                        <>{isEditMode ? 'Update Employee' : 'Create Employee'}</>
                    )}
                </button>
            </div>
        </form>
    );
};

export default EmployeeForm;