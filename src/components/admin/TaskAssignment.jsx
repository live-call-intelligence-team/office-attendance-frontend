// src/components/admin/TaskAssignment.jsx

import { useState, useEffect } from 'react';
import { FiUser, FiCalendar, FiAlertCircle, FiFileText } from 'react-icons/fi';
import { TASK_PRIORITY } from '../../utils/constants';
import { validateTask } from '../../utils/validation';
import { toast } from 'react-toastify';

const TaskAssignment = ({
    task = null,
    employees = [],
    onSubmit,
    onCancel,
    loading = false
}) => {
    const isEditMode = !!task;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assignedTo: '',
        priority: '',
        dueDate: '',
        estimatedHours: '',
    });

    const [errors, setErrors] = useState({});

    // Populate form if editing
    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                assignedTo: task.assignedTo?._id || task.assignedTo || '',
                priority: task.priority || '',
                dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
                estimatedHours: task.estimatedHours || '',
            });
        }
    }, [task]);

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
        const validationErrors = validateTask(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error('Please fix the errors in the form');
            return;
        }

        // Submit
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Task Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`input-field ${errors.title ? 'input-error' : ''}`}
                    placeholder="Enter task title"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                        <FiFileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className={`input-field pl-10 ${errors.description ? 'input-error' : ''}`}
                        placeholder="Describe the task in detail..."
                        rows="4"
                    />
                </div>
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Assign To and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Assign To */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assign To <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiUser className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                            name="assignedTo"
                            value={formData.assignedTo}
                            onChange={handleChange}
                            className={`input-field pl-10 ${errors.assignedTo ? 'input-error' : ''}`}
                        >
                            <option value="">Select Employee</option>
                            {employees.map((emp) => (
                                <option key={emp._id} value={emp._id}>
                                    {emp.name} ({emp.employeeId})
                                </option>
                            ))}
                        </select>
                    </div>
                    {errors.assignedTo && <p className="mt-1 text-sm text-red-600">{errors.assignedTo}</p>}
                </div>

                {/* Priority */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiAlertCircle className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className={`input-field pl-10 ${errors.priority ? 'input-error' : ''}`}
                        >
                            <option value="">Select Priority</option>
                            <option value={TASK_PRIORITY.LOW}>Low</option>
                            <option value={TASK_PRIORITY.MEDIUM}>Medium</option>
                            <option value={TASK_PRIORITY.HIGH}>High</option>
                            <option value={TASK_PRIORITY.URGENT}>Urgent</option>
                        </select>
                    </div>
                    {errors.priority && <p className="mt-1 text-sm text-red-600">{errors.priority}</p>}
                </div>
            </div>

            {/* Due Date and Estimated Hours */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Due Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Due Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiCalendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            className={`input-field pl-10 ${errors.dueDate ? 'input-error' : ''}`}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                    {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>}
                </div>

                {/* Estimated Hours */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estimated Hours
                    </label>
                    <input
                        type="number"
                        name="estimatedHours"
                        value={formData.estimatedHours}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="e.g., 8"
                        min="0"
                        step="0.5"
                    />
                </div>
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
                            {isEditMode ? 'Updating...' : 'Creating...'}
                        </span>
                    ) : (
                        <>{isEditMode ? 'Update Task' : 'Assign Task'}</>
                    )}
                </button>
            </div>
        </form>
    );
};

export default TaskAssignment;