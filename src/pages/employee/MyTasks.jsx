import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { toast } from 'react-toastify';
import {
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiMessageSquare,
  FiPaperclip,
  FiCalendar,
  FiFilter,
  FiX,
  FiSend,
  FiFile,
  FiDownload,
  FiFlag,
} from 'react-icons/fi';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [fileInput, setFileInput] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [filterStatus, filterPriority]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterPriority !== 'all') params.append('priority', filterPriority);

      const response = await api.get(`/tasks?${params.toString()}`);
      setTasks(response.data.data || []);
      setStats(response.data.stats || {});
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      toast.success('Task status updated!');
      fetchTasks();
      if (selectedTask?._id === taskId) {
        setSelectedTask({ ...selectedTask, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    try {
      await api.post(`/tasks/${selectedTask._id}/comments`, {
        comment: commentInput,
      });
      toast.success('Comment added');
      setCommentInput('');
      fetchTasks();
      // Refresh task details
      const response = await api.get(`/tasks/${selectedTask._id}`);
      setSelectedTask(response.data.data);
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // In production, upload to cloud storage
      const fileData = {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileUrl: URL.createObjectURL(file),
      };

      await api.post(`/tasks/${selectedTask._id}/attachments`, fileData);
      toast.success('File attached');
      const response = await api.get(`/tasks/${selectedTask._id}`);
      setSelectedTask(response.data.data);
      fetchTasks();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-error-100 text-error-700 border-error-300';
      case 'high':
        return 'bg-warning-100 text-warning-700 border-warning-300';
      case 'normal':
        return 'bg-primary-100 text-primary-700 border-primary-300';
      case 'low':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue = (dueDate, status) => {
    return status !== 'completed' && new Date(dueDate) < new Date();
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          My Tasks
        </h1>
        <p className="text-text-secondary mt-1">Manage your assigned tasks</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Total Tasks</p>
              <p className="text-3xl font-bold mt-1">{stats.total || 0}</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <FiCheckCircle className="text-3xl" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-yellow-500 to-warning-600 rounded-2xl p-6 text-text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold mt-1">{stats.pending || 0}</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <FiClock className="text-3xl" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">In Progress</p>
              <p className="text-3xl font-bold mt-1">{stats.inProgress || 0}</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <FiClock className="text-3xl" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-500 to-accent-600 rounded-2xl p-6 text-text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold mt-1">{stats.completed || 0}</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <FiCheckCircle className="text-3xl" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-error-500 to-error-600 rounded-2xl p-6 text-text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Overdue</p>
              <p className="text-3xl font-bold mt-1">{stats.overdue || 0}</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <FiAlertCircle className="text-3xl" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-background-card p-4 rounded-xl border border-border">
        <FiFilter className="text-text-muted text-xl" />
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-text-primary">Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-background-secondary border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-text-primary">Priority:</label>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 bg-background-secondary border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="grid grid-cols-1 gap-4">
        {tasks.length === 0 ? (
          <div className="bg-background-card rounded-2xl p-12 text-center border border-border">
            <FiCheckCircle className="text-6xl text-text-muted mx-auto mb-4" />
            <p className="text-text-muted text-lg font-semibold">No tasks found</p>
            <p className="text-text-secondary text-sm mt-2">
              {filterStatus !== 'all' || filterPriority !== 'all'
                ? 'Try adjusting your filters'
                : 'You have no assigned tasks'}
            </p>
          </div>
        ) : (
          tasks.map((task, index) => (
            <motion.div
              key={task._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-background-card rounded-2xl p-6 border border-border hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-text-primary">{task.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </span>
                    {isOverdue(task.dueDate, task.status) && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-error-100 text-error-700 border border-error-300 flex items-center gap-1">
                        <FiAlertCircle />
                        OVERDUE
                      </span>
                    )}
                  </div>

                  {task.description && (
                    <p className="text-text-secondary text-sm mb-4 line-clamp-2">{task.description}</p>
                  )}

                  <div className="flex items-center gap-6 text-sm text-text-muted">
                    <div className="flex items-center gap-2">
                      <FiCalendar />
                      <span>Due: {formatDate(task.dueDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiMessageSquare />
                      <span>{task.comments?.length || 0} comments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiPaperclip />
                      <span>{task.attachments?.length || 0} files</span>
                    </div>
                  </div>

                  {task.tags && task.tags.length > 0 && (
                    <div className="flex items-center gap-2 mt-3">
                      {task.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-background-secondary text-text-secondary rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-3">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border focus:outline-none focus:ring-2 focus:ring-primary-500 ${getStatusColor(task.status)}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>

                  <button
                    onClick={() => {
                      setSelectedTask(task);
                      setShowDetailModal(true);
                    }}
                    className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-text-white rounded-xl text-sm font-semibold transition-all"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Task Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedTask && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background-card rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-border flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-text-primary mb-2">{selectedTask.title}</h2>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(selectedTask.priority)}`}>
                      {selectedTask.priority.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedTask.status)}`}>
                      {selectedTask.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-background-secondary rounded-lg transition-colors"
                >
                  <FiX className="text-2xl text-text-secondary" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-sm font-bold text-text-primary mb-2">Description</h3>
                  <p className="text-text-secondary">{selectedTask.description || 'No description provided'}</p>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-text-muted mb-1">Assigned By</p>
                    <p className="text-text-primary">{selectedTask.assignedBy?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-muted mb-1">Due Date</p>
                    <p className="text-text-primary">{formatDate(selectedTask.dueDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-muted mb-1">Start Date</p>
                    <p className="text-text-primary">{formatDate(selectedTask.startDate)}</p>
                  </div>
                  {selectedTask.completedAt && (
                    <div>
                      <p className="text-sm font-semibold text-text-muted mb-1">Completed At</p>
                      <p className="text-text-primary">{formatDate(selectedTask.completedAt)}</p>
                    </div>
                  )}
                </div>

                {/* Attachments */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-text-primary">Attachments ({selectedTask.attachments?.length || 0})</h3>
                    <label className="px-4 py-2 bg-background-secondary hover:bg-border text-text-primary rounded-lg text-sm font-semibold cursor-pointer transition-all flex items-center gap-2">
                      <FiPaperclip />
                      Add File
                      <input type="file" className="hidden" onChange={handleFileUpload} />
                    </label>
                  </div>
                  {selectedTask.attachments?.length > 0 ? (
                    <div className="space-y-2">
                      {selectedTask.attachments.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-background-secondary rounded-xl">
                          <div className="flex items-center gap-3">
                            <FiFile className="text-2xl text-primary-500" />
                            <div>
                              <p className="text-sm font-semibold text-text-primary">{file.fileName}</p>
                              <p className="text-xs text-text-muted">
                                {formatFileSize(file.fileSize)} • {formatDate(file.uploadedAt)}
                              </p>
                            </div>
                          </div>
                          <button className="p-2 hover:bg-background-primary rounded-lg transition-colors">
                            <FiDownload className="text-primary-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-text-muted text-sm text-center py-6">No attachments</p>
                  )}
                </div>

                {/* Comments */}
                <div>
                  <h3 className="text-sm font-bold text-text-primary mb-3">Comments ({selectedTask.comments?.length || 0})</h3>
                  <div className="space-y-3 mb-4">
                    {selectedTask.comments?.length > 0 ? (
                      selectedTask.comments.map((comment, idx) => (
                        <div key={idx} className="p-4 bg-background-secondary rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-text-white font-bold text-xs">
                              {comment.user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-text-primary">{comment.user?.name}</p>
                              <p className="text-xs text-text-muted">{formatDate(comment.createdAt)}</p>
                            </div>
                          </div>
                          <p className="text-text-secondary text-sm">{comment.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-text-muted text-sm text-center py-6">No comments yet</p>
                    )}
                  </div>

                  {/* Add Comment Form */}
                  <form onSubmit={handleAddComment} className="flex gap-2">
                    <input
                      type="text"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 px-4 py-3 bg-background-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-text-primary"
                    />
                    <button
                      type="submit"
                      disabled={!commentInput.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <FiSend />
                      Send
                    </button>
                  </form>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-semibold text-text-primary">Status:</label>
                  <select
                    value={selectedTask.status}
                    onChange={(e) => {
                      handleStatusChange(selectedTask._id, e.target.value);
                      setSelectedTask({ ...selectedTask, status: e.target.value });
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border focus:outline-none focus:ring-2 focus:ring-primary-500 ${getStatusColor(selectedTask.status)}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-6 py-3 bg-background-secondary hover:bg-border text-text-primary rounded-xl font-semibold transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyTasks;
