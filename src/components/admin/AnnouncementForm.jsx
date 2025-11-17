// src/components/admin/AnnouncementForm.jsx

import { useState } from 'react';
import { FiAlertCircle, FiUsers, FiCalendar } from 'react-icons/fi';

const AnnouncementForm = ({ onSubmit, onCancel, loading = false }) => {
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        priority: 'normal', // low, normal, high, urgent
        targetAudience: 'all', // all, department, specific
        department: '',
        expiryDate: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.message.trim()) newErrors.message = 'Message is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit(formData);
    };

    const getPriorityColor = (priority) => {
        const colors = {
            low: 'bg-gray-100 text-gray-700',
            normal: 'bg-blue-100 text-blue-700',
            high: 'bg-orange-100 text-orange-700',
            urgent: 'bg-red-100 text-red-700',
        };
        return colors[priority];
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Announcement Title <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`input-field ${errors.title ? 'input-error' : ''}`}
                    placeholder="Enter announcement title"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Message */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                </label>
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className={`input-field ${errors.message ? 'input-error' : ''}`}
                    placeholder="Enter announcement message"
                    rows="5"
                />
                {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
            </div>

            {/* Priority and Target */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Priority */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                    </label>
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="input-field"
                    >
                        <option value="low">Low</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>
                    <div className="mt-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(formData.priority)}`}>
                            {formData.priority.toUpperCase()} PRIORITY
                        </span>
                    </div>
                </div>

                {/* Target Audience */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target Audience
                    </label>
                    <select
                        name="targetAudience"
                        value={formData.targetAudience}
                        onChange={handleChange}
                        className="input-field"
                    >
                        <option value="all">All Employees</option>
                        <option value="department">Specific Department</option>
                    </select>

                    {formData.targetAudience === 'department' && (
                        <input
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            placeholder="Enter department name"
                            className="input-field mt-2"
                        />
                    )}
                </div>
            </div>

            {/* Expiry Date */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date (Optional)
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="date"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        className="input-field pl-10"
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                    Leave empty for permanent announcement
                </p>
            </div>

            {/* Actions */}
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
                            Publishing...
                        </span>
                    ) : (
                        'Publish Announcement'
                    )}
                </button>
            </div>
        </form>
    );
};

export default AnnouncementForm;