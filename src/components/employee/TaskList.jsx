// src/components/employee/TaskList.jsx

import { useState } from 'react';
import { FiClock, FiCalendar, FiMessageSquare, FiPaperclip, FiMoreVertical, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { formatDate, getDaysDifference } from '../../utils/dateUtils';
import { getStatusColor } from '../../utils/helpers';
import { TASK_STATUS, TASK_PRIORITY } from '../../utils/constants';

const TaskList = ({
    tasks = [],
    onStatusChange,
    onViewDetails,
    onEdit,
    onDelete,
    isAdmin = false,
    loading = false
}) => {
    const [actionMenuOpen, setActionMenuOpen] = useState(null);

    const getPriorityColor = (priority) => {
        const colors = {
            [TASK_PRIORITY.LOW]: 'bg-gray-100 text-gray-800',
            [TASK_PRIORITY.MEDIUM]: 'bg-blue-100 text-blue-800',
            [TASK_PRIORITY.HIGH]: 'bg-orange-100 text-orange-800',
            [TASK_PRIORITY.URGENT]: 'bg-red-100 text-red-800',
        };
        return colors[priority] || 'bg-gray-100 text-gray-800';
    };

    const getDaysUntilDue = (dueDate) => {
        const days = getDaysDifference(new Date(), dueDate);
        if (days < 0) return `Overdue by ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''}`;
        if (days === 0) return 'Due today';
        if (days === 1) return 'Due tomorrow';
        return `${days} days left`;
    };

    const toggleActionMenu = (taskId) => {
        setActionMenuOpen(actionMenuOpen === taskId ? null : taskId);
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-md p-8 flex justify-center items-center">
                <div className="spinner mr-3"></div>
                <span className="text-gray-600">Loading tasks...</span>
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiClock className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tasks Found</h3>
                <p className="text-gray-600">
                    {isAdmin ? 'No tasks have been assigned yet.' : "You don't have any tasks assigned."}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {tasks.map((task) => {
                const isOverdue = new Date(task.dueDate) < new Date() && task.status !== TASK_STATUS.COMPLETED;
                const daysInfo = getDaysUntilDue(task.dueDate);

                return (
                    <div
                        key={task._id}
                        className={`bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 ${isOverdue ? 'border-red-500' : 'border-primary-500'
                            }`}
                    >
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                            {/* Left Section */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {task.title}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                            {/* Status Badge */}
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                                                {task.status.replace('_', ' ')}
                                            </span>
                                            {/* Priority Badge */}
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                            {/* Overdue Badge */}
                                            {isOverdue && (
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                                    OVERDUE
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Menu */}
                                    {isAdmin && (
                                        <div className="relative ml-2">
                                            <button
                                                onClick={() => toggleActionMenu(task._id)}
                                                className="p-2 rounded-lg hover:bg-gray-100"
                                            >
                                                <FiMoreVertical className="w-5 h-5 text-gray-600" />
                                            </button>

                                            {actionMenuOpen === task._id && (
                                                <>
                                                    <div
                                                        className="fixed inset-0 z-10"
                                                        onClick={() => setActionMenuOpen(null)}
                                                    ></div>
                                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                                                        <button
                                                            onClick={() => {
                                                                onEdit(task);
                                                                setActionMenuOpen(null);
                                                            }}
                                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                        >
                                                            <FiEdit2 className="w-4 h-4 mr-3" />
                                                            Edit Task
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                onDelete(task._id);
                                                                setActionMenuOpen(null);
                                                            }}
                                                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                                                        >
                                                            <FiTrash2 className="w-4 h-4 mr-3" />
                                                            Delete Task
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                    {task.description}
                                </p>

                                {/* Task Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                    {/* Assigned To (for admin view) */}
                                    {isAdmin && task.assignedTo && (
                                        <div className="flex items-center text-gray-600">
                                            <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-semibold mr-2">
                                                {task.assignedTo.name?.charAt(0) || 'E'}
                                            </div>
                                            <span>
                                                {task.assignedTo.name} ({task.assignedTo.employeeId})
                                            </span>
                                        </div>
                                    )}

                                    {/* Due Date */}
                                    <div className="flex items-center text-gray-600">
                                        <FiCalendar className="w-4 h-4 mr-2" />
                                        <span className="font-medium mr-1">Due:</span>
                                        <span className={isOverdue ? 'text-red-600 font-semibold' : ''}>
                                            {formatDate(task.dueDate, 'MMM dd, yyyy')}
                                        </span>
                                    </div>

                                    {/* Days Until Due */}
                                    <div className="flex items-center text-gray-600">
                                        <FiClock className="w-4 h-4 mr-2" />
                                        <span className={isOverdue ? 'text-red-600 font-semibold' : ''}>
                                            {daysInfo}
                                        </span>
                                    </div>

                                    {/* Comments Count */}
                                    {task.comments && task.comments.length > 0 && (
                                        <div className="flex items-center text-gray-600">
                                            <FiMessageSquare className="w-4 h-4 mr-2" />
                                            {task.comments.length} comment{task.comments.length !== 1 ? 's' : ''}
                                        </div>
                                    )}

                                    {/* Attachments Count */}
                                    {task.attachments && task.attachments.length > 0 && (
                                        <div className="flex items-center text-gray-600">
                                            <FiPaperclip className="w-4 h-4 mr-2" />
                                            {task.attachments.length} file{task.attachments.length !== 1 ? 's' : ''}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Section - Status Change (for employees) */}
                            {!isAdmin && (
                                <div className="mt-4 lg:mt-0 lg:ml-6">
                                    <div className="flex flex-col space-y-2">
                                        {task.status !== TASK_STATUS.COMPLETED && (
                                            <>
                                                {task.status === TASK_STATUS.TODO && (
                                                    <button
                                                        onClick={() => onStatusChange(task._id, TASK_STATUS.IN_PROGRESS)}
                                                        className="btn-primary text-sm"
                                                    >
                                                        Start Task
                                                    </button>
                                                )}
                                                {task.status === TASK_STATUS.IN_PROGRESS && (
                                                    <button
                                                        onClick={() => onStatusChange(task._id, TASK_STATUS.COMPLETED)}
                                                        className="btn-success text-sm"
                                                    >
                                                        Mark Complete
                                                    </button>
                                                )}
                                            </>
                                        )}
                                        <button
                                            onClick={() => onViewDetails(task)}
                                            className="btn-secondary text-sm"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TaskList;