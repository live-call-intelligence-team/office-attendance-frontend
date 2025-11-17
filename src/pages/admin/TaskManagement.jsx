import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { toast } from 'react-toastify';
import {
  FiPlus,
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
  FiEdit2,
  FiTrash2,
  FiUser,
} from 'react-icons/fi';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterEmployee, setFilterEmployee] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [commentInput, setCommentInput] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'normal',
    dueDate: '',
    tags: [],
  });

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, [filterStatus, filterPriority, filterEmployee]);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/users');
      setEmployees(response.data.data.filter(u => u.role === 'employee') || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterPriority !== 'all') params.append('priority', filterPriority);
      if (filterEmployee !== 'all') params.append('assignedTo', filterEmployee);

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

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.assignedTo || !formData.dueDate) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      await api.post('/tasks', formData);
      toast.success('Task created successfully!');
      setShowCreateModal(false);
      setFormData({
        title: '',
        description: '',
        assignedTo: '',
        priority: 'normal',
        dueDate: '',
        tags: [],
      });
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error(error.response?.data?.message || 'Failed to create task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success('Task deleted successfully');
      fetchTasks();
      setShowDetailModal(false);
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
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
      const response = await api.get(`/tasks/${selectedTask._id}`);
      setSelectedTask(response.data.data);
      fetchTasks();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Task Management
          </h1>
          <p className="text-text-secondary mt-1">Create and assign tasks to employees</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <FiPlus />
          Create Task
        </motion.button>
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

        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-text-primary">Employee:</label>
          <select
            value={filterEmployee}
            onChange={(e) => setFilterEmployee(e.target.value)}
            className="px-4 py-2 bg-background-secondary border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Employees</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="grid grid-cols-1 gap-4">
        {tasks.length === 0 ? (
          <div className="bg-background-card rounded-2xl p-12 text-center border border-border">
            <FiCheckCircle className="text-6xl text-text-muted mx-auto mb-4" />
            <p className="text-text-muted text-lg font-semibold">No tasks found</p>
            <p className="text-text-secondary text-sm mt-2">Create a task to get started</p>
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
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(task.status)}`}>
                      {task.status.toUpperCase()}
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
                      <FiUser />
                      <span>{task.assignedTo?.name}</span>
                    </div>
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
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedTask(task);
                      setShowDetailModal(true);
                    }}
                    className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-text-white rounded-xl text-sm font-semibold transition-all"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="p-2 hover:bg-error-50 rounded-lg transition-colors"
                    title="Delete Task"
                  >
                    <FiTrash2 className="text-error-500" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Create Task Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-border">
                <h3 className="text-2xl font-bold text-text-primary">Create New Task</h3>
              </div>

              <form onSubmit={handleCreateTask} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Complete Q4 Report"
                    className="w-full px-4 py-3 bg-background-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-text-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed task description..."
                    rows={4}
                    className="w-full px-4 py-3 bg-background-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-text-primary resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Assign To *
                    </label>
                    <select
                      value={formData.assignedTo}
                      onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                      className="w-full px-4 py-3 bg-background-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-text-primary"
                      required
                    >
                      <option value="">Select Employee</option>
                      {employees.map((emp) => (
                        <option key={emp._id} value={emp._id}>
                          {emp.name} ({emp.employeeId})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-4 py-3 bg-background-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-text-primary"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-background-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-text-primary"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    Create Task
                  </motion.button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setFormData({
                        title: '',
                        description: '',
                        assignedTo: '',
                        priority: 'normal',
                        dueDate: '',
                        tags: [],
                      });
                    }}
                    className="px-6 py-3 bg-background-secondary hover:bg-border text-text-primary font-semibold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Task Detail Modal - Same as Employee */}
      <AnimatePresence>
        {showDetailModal && selectedTask && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background-card rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
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

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-text-primary mb-2">Description</h3>
                  <p className="text-text-secondary">{selectedTask.description || 'No description provided'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-text-muted mb-1">Assigned To</p>
                    <p className="text-text-primary">{selectedTask.assignedTo?.name || 'N/A'}</p>
                  </div>
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
                </div>

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

              <div className="p-6 border-t border-border flex justify-end">
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

export default TaskManagement;
