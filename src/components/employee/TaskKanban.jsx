// src/components/employee/TaskKanban.jsx

import { useState } from 'react';
import { FiClock, FiAlertCircle, FiMoreVertical } from 'react-icons/fi';
import { formatDate } from '../../utils/dateUtils';
import { TASK_STATUS, TASK_PRIORITY } from '../../utils/constants';

const TaskKanban = ({
    tasks = [],
    onStatusChange,
    onViewDetails,
    isAdmin = false
}) => {
    const columns = [
        { id: TASK_STATUS.TODO, title: 'To Do', color: 'bg-gray-100' },
        { id: TASK_STATUS.IN_PROGRESS, title: 'In Progress', color: 'bg-blue-100' },
        { id: TASK_STATUS.COMPLETED, title: 'Completed', color: 'bg-green-100' },
    ];

    const getPriorityColor = (priority) => {
        const colors = {
            [TASK_PRIORITY.LOW]: 'bg-gray-200 text-gray-700',
            [TASK_PRIORITY.MEDIUM]: 'bg-blue-200 text-blue-700',
            [TASK_PRIORITY.HIGH]: 'bg-orange-200 text-orange-700',
            [TASK_PRIORITY.URGENT]: 'bg-red-200 text-red-700',
        };
        return colors[priority] || 'bg-gray-200 text-gray-700';
    };

    const getTasksByStatus = (status) => {
        return tasks.filter(task => task.status === status);
    };

    const isOverdue = (dueDate) => {
        return new Date(dueDate) < new Date();
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map(column => {
                const columnTasks = getTasksByStatus(column.id);

                return (
                    <div key={column.id} className="bg-white rounded-xl shadow-md p-4">
                        {/* Column Header */}
                        <div className={`${column.color} rounded-lg p-3 mb-4`}>
                            <h3 className="font-semibold text-gray-900 flex items-center justify-between">
                                {column.title}
                                <span className="bg-white px-2 py-1 rounded-full text-sm">
                                    {columnTasks.length}
                                </span>
                            </h3>
                        </div>

                        {/* Tasks */}
                        <div className="space-y-3 max-h-[600px] overflow-y-auto">
                            {columnTasks.length === 0 ? (
                                <p className="text-center text-gray-500 text-sm py-8">
                                    No tasks
                                </p>
                            ) : (
                                columnTasks.map(task => {
                                    const overdue = isOverdue(task.dueDate) && column.id !== TASK_STATUS.COMPLETED;

                                    return (
                                        <div
                                            key={task._id}
                                            className={`bg-gray-50 rounded-lg p-4 border-l-4 cursor-pointer hover:shadow-md transition-shadow ${overdue ? 'border-red-500' : 'border-primary-500'
                                                }`}
                                            onClick={() => onViewDetails(task)}
                                        >
                                            {/* Priority Badge */}
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                                                    {task.priority}
                                                </span>
                                                {overdue && (
                                                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold">
                                                        OVERDUE
                                                    </span>
                                                )}
                                            </div>

                                            {/* Task Title */}
                                            <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                                {task.title}
                                            </h4>

                                            {/* Task Description */}
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                {task.description}
                                            </p>

                                            {/* Task Info */}
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <div className="flex items-center">
                                                    <FiClock className="w-3 h-3 mr-1" />
                                                    {formatDate(task.dueDate, 'MMM dd')}
                                                </div>
                                                {task.comments?.length > 0 && (
                                                    <div className="flex items-center">
                                                        💬 {task.comments.length}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Assigned To (for admin) */}
                                            {isAdmin && task.assignedTo && (
                                                <div className="mt-2 pt-2 border-t border-gray-200">
                                                    <p className="text-xs text-gray-600">
                                                        Assigned to: <span className="font-medium">{task.assignedTo.name}</span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TaskKanban;