// src/components/employee/TaskDetailModal.jsx

import { useState } from 'react';
import { FiCalendar, FiUser, FiClock, FiMessageSquare, FiSend, FiPaperclip } from 'react-icons/fi';
import { formatDate, formatDateTime } from '../../utils/dateUtils';
import { getStatusColor } from '../../utils/helpers';
import { TASK_STATUS } from '../../utils/constants';

const TaskDetailModal = ({
    task,
    onAddComment,
    onStatusChange,
    onClose,
    onUploadAttachment,
    loading = false,
    isAdmin = false
}) => {
    const [comment, setComment] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);

    const handleAddComment = async () => {
        if (!comment.trim()) return;

        setCommentLoading(true);
        await onAddComment(task._id, comment);
        setComment('');
        setCommentLoading(false);
    };

    const getPriorityColor = (priority) => {
        const colors = {
            LOW: 'bg-gray-100 text-gray-800',
            MEDIUM: 'bg-blue-100 text-blue-800',
            HIGH: 'bg-orange-100 text-orange-800',
            URGENT: 'bg-red-100 text-red-800',
        };
        return colors[priority] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{task.title}</h2>
                <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                        {task.priority} PRIORITY
                    </span>
                </div>
            </div>

            {/* Task Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                {task.assignedTo && (
                    <div className="flex items-center text-sm">
                        <FiUser className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="font-medium text-gray-700 mr-1">Assigned to:</span>
                        <span className="text-gray-900">{task.assignedTo.name}</span>
                    </div>
                )}
                <div className="flex items-center text-sm">
                    <FiCalendar className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-medium text-gray-700 mr-1">Due Date:</span>
                    <span className="text-gray-900">{formatDate(task.dueDate, 'MMM dd, yyyy')}</span>
                </div>
                {task.estimatedHours && (
                    <div className="flex items-center text-sm">
                        <FiClock className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="font-medium text-gray-700 mr-1">Estimated:</span>
                        <span className="text-gray-900">{task.estimatedHours} hours</span>
                    </div>
                )}
                <div className="flex items-center text-sm">
                    <FiCalendar className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-medium text-gray-700 mr-1">Created:</span>
                    <span className="text-gray-900">{formatDate(task.createdAt, 'MMM dd, yyyy')}</span>
                </div>
            </div>

            {/* Description */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{task.description}</p>
            </div>

            {/* Status Actions (for employees) */}
            {!isAdmin && task.status !== TASK_STATUS.COMPLETED && (
                <div className="flex space-x-3 p-4 bg-blue-50 rounded-lg">
                    {task.status === TASK_STATUS.TODO && (
                        <button
                            onClick={() => onStatusChange(task._id, TASK_STATUS.IN_PROGRESS)}
                            className="btn-primary"
                        >
                            Start Task
                        </button>
                    )}
                    {task.status === TASK_STATUS.IN_PROGRESS && (
                        <button
                            onClick={() => onStatusChange(task._id, TASK_STATUS.COMPLETED)}
                            className="btn-success"
                        >
                            Mark as Complete
                        </button>
                    )}
                </div>
            )}

            {/* Comments Section */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FiMessageSquare className="w-5 h-5 mr-2" />
                    Comments ({task.comments?.length || 0})
                </h3>

                {/* Comment Input */}
                <div className="mb-4">
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="input-field"
                        placeholder="Add a comment..."
                        rows="3"
                    />
                    <button
                        onClick={handleAddComment}
                        disabled={!comment.trim() || commentLoading}
                        className="btn-primary mt-2 flex items-center"
                    >
                        {commentLoading ? (
                            <>
                                <div className="spinner mr-2"></div>
                                Posting...
                            </>
                        ) : (
                            <>
                                <FiSend className="w-4 h-4 mr-2" />
                                Post Comment
                            </>
                        )}
                    </button>
                </div>

                {/* Comments List */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {task.comments && task.comments.length > 0 ? (
                        task.comments.map((cmt, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center mb-2">
                                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                                        {cmt.user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {cmt.user?.name || 'Unknown User'}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatDateTime(cmt.createdAt)}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-700 ml-11">{cmt.comment}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-4">No comments yet</p>
                    )}
                </div>
            </div>

            {/* Attachments Section */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FiPaperclip className="w-5 h-5 mr-2" />
                    Attachments ({task.attachments?.length || 0})
                </h3>

                {/* Upload Attachment */}
                {!isAdmin && (
                    <div className="mb-4">
                        <input
                            type="file"
                            id="attachment-upload"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files[0]) {
                                    onUploadAttachment(task._id, e.target.files[0]);
                                    e.target.value = '';
                                }
                            }}
                        />
                        <label
                            htmlFor="attachment-upload"
                            className="btn-secondary cursor-pointer inline-flex items-center"
                        >
                            <FiPaperclip className="w-4 h-4 mr-2" />
                            Upload Attachment
                        </label>
                    </div>
                )}

                {/* Attachments List */}
                <div className="space-y-2">
                    {task.attachments && task.attachments.length > 0 ? (
                        task.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <FiPaperclip className="w-4 h-4 text-gray-500 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{attachment.filename}</p>
                                        <p className="text-xs text-gray-500">
                                            {(attachment.size / 1024).toFixed(2)} KB • {formatDateTime(attachment.uploadedAt)}
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href={attachment.url}
                                    download
                                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                                >
                                    Download
                                </a>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-4">No attachments</p>
                    )}
                </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
                <button onClick={onClose} className="btn-secondary">
                    Close
                </button>
            </div>
        </div>
    );
};

export default TaskDetailModal;