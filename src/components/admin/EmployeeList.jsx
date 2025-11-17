// src/components/admin/EmployeeList.jsx

import { useState } from 'react';
import { FiEdit2, FiTrash2, FiEye, FiMail, FiPhone, FiMoreVertical } from 'react-icons/fi';
import { getInitials, formatCurrency } from '../../utils/helpers';
import { formatDate } from '../../utils/dateUtils';
import ConfirmDialog from '../common/ConfirmDialog';

const EmployeeList = ({
    employees = [],
    onEdit,
    onDelete,
    onView,
    loading = false
}) => {
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, employee: null });
    const [actionMenuOpen, setActionMenuOpen] = useState(null);

    const handleDeleteClick = (employee) => {
        setDeleteConfirm({ isOpen: true, employee });
        setActionMenuOpen(null);
    };

    const handleDeleteConfirm = () => {
        if (deleteConfirm.employee) {
            onDelete(deleteConfirm.employee._id);
            setDeleteConfirm({ isOpen: false, employee: null });
        }
    };

    const toggleActionMenu = (employeeId) => {
        setActionMenuOpen(actionMenuOpen === employeeId ? null : employeeId);
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-md p-8">
                <div className="flex justify-center items-center">
                    <div className="spinner"></div>
                    <span className="ml-3 text-gray-600">Loading employees...</span>
                </div>
            </div>
        );
    }

    if (employees.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiEye className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Employees Found</h3>
                <p className="text-gray-600">
                    No employees match your search criteria. Try adjusting your filters.
                </p>
            </div>
        );
    }

    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Employee
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Department
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Designation
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Salary
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {employees.map((employee) => (
                                <tr key={employee._id} className="hover:bg-gray-50 transition-colors">
                                    {/* Employee Info */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                                                {getInitials(employee.name)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {employee.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {employee.employeeId}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Contact */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 flex items-center">
                                            <FiMail className="w-4 h-4 mr-2 text-gray-400" />
                                            {employee.email}
                                        </div>
                                        <div className="text-sm text-gray-500 flex items-center mt-1">
                                            <FiPhone className="w-4 h-4 mr-2 text-gray-400" />
                                            {employee.phone}
                                        </div>
                                    </td>

                                    {/* Department */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {employee.department}
                                        </span>
                                    </td>

                                    {/* Designation */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {employee.designation}
                                    </td>

                                    {/* Salary */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatCurrency(employee.salary)}
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${employee.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {employee.status || 'Active'}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => onView(employee)}
                                                className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50"
                                                title="View Details"
                                            >
                                                <FiEye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onEdit(employee)}
                                                className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50"
                                                title="Edit"
                                            >
                                                <FiEdit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(employee)}
                                                className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50"
                                                title="Delete"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {employees.map((employee) => (
                    <div key={employee._id} className="bg-white rounded-xl shadow-md p-4">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                                    {getInitials(employee.name)}
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-semibold text-gray-900">
                                        {employee.name}
                                    </h3>
                                    <p className="text-xs text-gray-500">{employee.employeeId}</p>
                                </div>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => toggleActionMenu(employee._id)}
                                    className="p-2 rounded-lg hover:bg-gray-100"
                                >
                                    <FiMoreVertical className="w-5 h-5 text-gray-600" />
                                </button>

                                {/* Action Menu */}
                                {actionMenuOpen === employee._id && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setActionMenuOpen(null)}
                                        ></div>
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                                            <button
                                                onClick={() => {
                                                    onView(employee);
                                                    setActionMenuOpen(null);
                                                }}
                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                            >
                                                <FiEye className="w-4 h-4 mr-3" />
                                                View Details
                                            </button>
                                            <button
                                                onClick={() => {
                                                    onEdit(employee);
                                                    setActionMenuOpen(null);
                                                }}
                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                            >
                                                <FiEdit2 className="w-4 h-4 mr-3" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(employee)}
                                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                                            >
                                                <FiTrash2 className="w-4 h-4 mr-3" />
                                                Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center text-gray-600">
                                <FiMail className="w-4 h-4 mr-2" />
                                {employee.email}
                            </div>
                            <div className="flex items-center text-gray-600">
                                <FiPhone className="w-4 h-4 mr-2" />
                                {employee.phone}
                            </div>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {employee.department}
                                </span>
                                <span className="text-sm font-semibold text-gray-900">
                                    {formatCurrency(employee.salary)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, employee: null })}
                onConfirm={handleDeleteConfirm}
                title="Delete Employee"
                message={`Are you sure you want to delete ${deleteConfirm.employee?.name}? This action cannot be undone.`}
                confirmText="Delete"
                type="danger"
            />
        </>
    );
};

export default EmployeeList;