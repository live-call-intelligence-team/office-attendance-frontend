// src/components/admin/PollForm.jsx

import { useState } from 'react';
import { FiPlus, FiX, FiCalendar } from 'react-icons/fi';
import { toast } from 'react-toastify';

const PollForm = ({ onSubmit, onCancel, loading = false }) => {
    const [formData, setFormData] = useState({
        question: '',
        options: ['', ''],
        allowMultiple: false,
        anonymous: false,
        expiryDate: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData(prev => ({ ...prev, options: newOptions }));
    };

    const addOption = () => {
        if (formData.options.length >= 6) {
            toast.error('Maximum 6 options allowed');
            return;
        }
        setFormData(prev => ({
            ...prev,
            options: [...prev.options, '']
        }));
    };

    const removeOption = (index) => {
        if (formData.options.length <= 2) {
            toast.error('Minimum 2 options required');
            return;
        }
        const newOptions = formData.options.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, options: newOptions }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        const newErrors = {};
        if (!formData.question.trim()) {
            newErrors.question = 'Question is required';
        }

        const validOptions = formData.options.filter(opt => opt.trim());
        if (validOptions.length < 2) {
            newErrors.options = 'At least 2 options are required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error('Please fix the errors');
            return;
        }

        onSubmit({
            ...formData,
            options: validOptions
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poll Question <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="question"
                    value={formData.question}
                    onChange={handleChange}
                    className={`input-field ${errors.question ? 'input-error' : ''}`}
                    placeholder="What would you like to ask?"
                />
                {errors.question && <p className="mt-1 text-sm text-red-600">{errors.question}</p>}
            </div>

            {/* Options */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Options <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                    {formData.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                className="input-field"
                                placeholder={`Option ${index + 1}`}
                            />
                            {formData.options.length > 2 && (
                                <button
                                    type="button"
                                    onClick={() => removeOption(index)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                {errors.options && <p className="mt-1 text-sm text-red-600">{errors.options}</p>}

                <button
                    type="button"
                    onClick={addOption}
                    className="mt-3 btn-secondary flex items-center text-sm"
                >
                    <FiPlus className="w-4 h-4 mr-2" />
                    Add Option
                </button>
            </div>

            {/* Settings */}
            <div className="space-y-3">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="allowMultiple"
                        name="allowMultiple"
                        checked={formData.allowMultiple}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="allowMultiple" className="ml-2 text-sm text-gray-700">
                        Allow multiple selections
                    </label>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="anonymous"
                        name="anonymous"
                        checked={formData.anonymous}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="anonymous" className="ml-2 text-sm text-gray-700">
                        Anonymous voting
                    </label>
                </div>
            </div>

            {/* Expiry Date */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
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
                            Creating...
                        </span>
                    ) : (
                        'Create Poll'
                    )}
                </button>
            </div>
        </form>
    );
};

export default PollForm;