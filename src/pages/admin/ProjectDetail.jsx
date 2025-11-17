import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  FiArrowLeft, FiUsers, FiCalendar, FiTarget, FiActivity,
  FiPlus, FiEdit2, FiTrash2, FiClock, FiCheckCircle,
  FiAlertCircle, FiTrendingUp, FiZap, FiMessageSquare,
  FiSave, FiX, FiPlay, FiPause, FiFlag, FiList, FiGrid
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showSprintModal, setShowSprintModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [dailyUpdates, setDailyUpdates] = useState([]);
  
  const [sprintFormData, setSprintFormData] = useState({
    name: '',
    goal: '',
    startDate: '',
    endDate: '',
  });

  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    status: 'todo',
    storyPoints: 0,
    taskType: 'feature',
    estimatedHours: 0,
  });

  const [updateFormData, setUpdateFormData] = useState({
    tasksCompleted: [],
    tasksInProgress: [],
    tasksPlanned: [],
    blockers: '',
    achievements: '',
    notes: '',
    hoursWorked: 0,
  });

  useEffect(() => {
    fetchProject();
    fetchDailyUpdates();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/projects/${id}`);
      setProject(response.data.data);
      setTasks(response.data.data.tasks || []);
    } catch (error) {
      console.error('Error fetching project:', error);
      toast.error('Failed to fetch project details');
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyUpdates = async () => {
    try {
      const response = await api.get(`/projects/${id}/updates`);
      setDailyUpdates(response.data.data || []);
    } catch (error) {
      console.error('Error fetching updates:', error);
    }
  };

  const handleCreateSprint = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${id}/sprints`, sprintFormData);
      toast.success('Sprint created successfully!');
      setShowSprintModal(false);
      resetSprintForm();
      fetchProject();
    } catch (error) {
      console.error('Error creating sprint:', error);
      toast.error('Failed to create sprint');
    }
  };

  const handleUpdateSprint = async (sprintId, status) => {
    try {
      await api.put(`/projects/${id}/sprints/${sprintId}`, { status });
      toast.success(`Sprint ${status}!`);
      fetchProject();
    } catch (error) {
      console.error('Error updating sprint:', error);
      toast.error('Failed to update sprint');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', {
        ...taskFormData,
        project: id,
      });
      toast.success('Task created successfully!');
      setShowTaskModal(false);
      resetTaskForm();
      fetchProject();
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${id}/updates`, updateFormData);
      toast.success('Daily update submitted!');
      setShowUpdateModal(false);
      resetUpdateForm();
      fetchDailyUpdates();
    } catch (error) {
      console.error('Error submitting update:', error);
      toast.error(error.response?.data?.message || 'Failed to submit update');
    }
  };

  const resetSprintForm = () => {
    setSprintFormData({
      name: '',
      goal: '',
      startDate: '',
      endDate: '',
    });
  };

  const resetTaskForm = () => {
    setTaskFormData({
      title: '',
      description: '',
      assignedTo: '',
      priority: 'medium',
      status: 'todo',
      storyPoints: 0,
      taskType: 'feature',
      estimatedHours: 0,
    });
  };

  const resetUpdateForm = () => {
    setUpdateFormData({
      tasksCompleted: [],
      tasksInProgress: [],
      tasksPlanned: [],
      blockers: '',
      achievements: '',
      notes: '',
      hoursWorked: 0,
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const tasksByStatus = {
    todo: tasks.filter(t => t.status === 'todo'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    review: tasks.filter(t => t.status === 'review'),
    completed: tasks.filter(t => t.status === 'completed'),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Project not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => navigate('/admin/projects')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <FiArrowLeft />
          Back to Projects
        </button>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
          <h1 className="text-4xl font-bold mb-2">{project.name}</h1>
          <p className="text-blue-100 text-lg mb-4">{project.description}</p>
          
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUpdateModal(true)}
              className="px-6 py-3 bg-white text-blue-600 rounded-xl font-medium shadow-lg flex items-center gap-2"
            >
              <FiMessageSquare />
              Daily Update
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSprintModal(true)}
              className="px-6 py-3 bg-green-500 text-white rounded-xl font-medium shadow-lg flex items-center gap-2"
            >
              <FiPlus />
              New Sprint
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTaskModal(true)}
              className="px-6 py-3 bg-yellow-500 text-white rounded-xl font-medium shadow-lg flex items-center gap-2"
            >
              <FiPlus />
              New Task
            </motion.button>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-100">Overall Progress</span>
              <span className="text-sm font-bold">{project.progress}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${project.progress}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-white rounded-full shadow-lg"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Simplified Overview */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Overview</h2>
        
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <FiList className="mx-auto text-2xl text-gray-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{tasksByStatus.todo.length}</p>
            <p className="text-sm text-gray-600">To Do</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <FiActivity className="mx-auto text-2xl text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-blue-600">{tasksByStatus.in_progress.length}</p>
            <p className="text-sm text-gray-600">In Progress</p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 text-center">
            <FiAlertCircle className="mx-auto text-2xl text-yellow-600 mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{tasksByStatus.review.length}</p>
            <p className="text-sm text-gray-600">Review</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <FiCheckCircle className="mx-auto text-2xl text-green-600 mb-2" />
            <p className="text-2xl font-bold text-green-600">{tasksByStatus.completed.length}</p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Team Members</h3>
          <div className="grid grid-cols-3 gap-4">
            {project.teamMembers?.map(member => (
              <div key={member._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {member.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{member.name}</p>
                  <p className="text-xs text-gray-600">{member.department}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CREATE SPRINT MODAL */}
      <AnimatePresence>
        {showSprintModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowSprintModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Create New Sprint</h2>
              </div>

              <form onSubmit={handleCreateSprint} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sprint Name *</label>
                  <input
                    type="text"
                    value={sprintFormData.name}
                    onChange={(e) => setSprintFormData({ ...sprintFormData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sprint Goal</label>
                  <textarea
                    value={sprintFormData.goal}
                    onChange={(e) => setSprintFormData({ ...sprintFormData, goal: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date *</label>
                    <input
                      type="date"
                      value={sprintFormData.startDate}
                      onChange={(e) => setSprintFormData({ ...sprintFormData, startDate: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">End Date *</label>
                    <input
                      type="date"
                      value={sprintFormData.endDate}
                      onChange={(e) => setSprintFormData({ ...sprintFormData, endDate: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowSprintModal(false)}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl"
                  >
                    Create Sprint
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CREATE TASK MODAL */}
      <AnimatePresence>
        {showTaskModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowTaskModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Create New Task</h2>
              </div>

              <form onSubmit={handleCreateTask} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Task Title *</label>
                  <input
                    type="text"
                    value={taskFormData.title}
                    onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={taskFormData.description}
                    onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Assign To</label>
                    <select
                      value={taskFormData.assignedTo}
                      onChange={(e) => setTaskFormData({ ...taskFormData, assignedTo: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Unassigned</option>
                      {project.teamMembers?.map(member => (
                        <option key={member._id} value={member._id}>{member.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                    <select
                      value={taskFormData.priority}
                      onChange={(e) => setTaskFormData({ ...taskFormData, priority: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowTaskModal(false)}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DAILY UPDATE MODAL */}
      <AnimatePresence>
        {showUpdateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowUpdateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Submit Daily Update</h2>
              </div>

              <form onSubmit={handleSubmitUpdate} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Achievements</label>
                  <textarea
                    value={updateFormData.achievements}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, achievements: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Blockers</label>
                  <textarea
                    value={updateFormData.blockers}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, blockers: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hours Worked</label>
                  <input
                    type="number"
                    value={updateFormData.hoursWorked}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, hoursWorked: parseFloat(e.target.value) })}
                    min="0"
                    max="24"
                    step="0.5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowUpdateModal(false)}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl"
                  >
                    Submit Update
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetail;
