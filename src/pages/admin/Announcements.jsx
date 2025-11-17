import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { 
  FiBell, FiPlus, FiX, FiEdit2, FiTrash2, FiAlertCircle,
  FiCalendar, FiUsers, FiCheckCircle
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const Announcements = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'general',
    priority: 'medium',
    targetAudience: 'all',
    targetDepartments: [],
    expiresAt: '',
  });

  const announcementTypes = [
    { value: 'general', label: 'General', color: 'blue', icon: FiBell },
    { value: 'urgent', label: 'Urgent', color: 'red', icon: FiAlertCircle },
    { value: 'event', label: 'Event', color: 'purple', icon: FiCalendar },
    { value: 'policy', label: 'Policy', color: 'yellow', icon: FiCheckCircle },
    { value: 'holiday', label: 'Holiday', color: 'green', icon: FiCalendar },
  ];

  const departments = [
    'AIML', 'Backend', 'Frontend', 'Flutter', 'Design', 'Testing',
    'DevOps', 'HR', 'Sales', 'Marketing', 'Finance', 'Administration'
  ];

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await api.get('/announcements');
      setAnnouncements(response.data.data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDepartmentToggle = (dept) => {
    setFormData(prev => ({
      ...prev,
      targetDepartments: prev.targetDepartments.includes(dept)
        ? prev.targetDepartments.filter(d => d !== dept)
        : [...prev.targetDepartments, dept]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.message) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      if (editingAnnouncement) {
        await api.put(`/announcements/${editingAnnouncement._id}`, formData);
        toast.success('Announcement updated successfully!');
      } else {
        await api.post('/announcements', formData);
        toast.success('Announcement created successfully!');
      }
      
      handleCloseModal();
      fetchAnnouncements();
    } catch (error) {
      console.error('Error saving announcement:', error);
      toast.error(error.response?.data?.message || 'Failed to save announcement');
    }
  };

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      message: announcement.message,
      type: announcement.type,
      priority: announcement.priority,
      targetAudience: announcement.targetAudience,
      targetDepartments: announcement.targetDepartments || [],
      expiresAt: announcement.expiresAt ? new Date(announcement.expiresAt).toISOString().slice(0, 16) : '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await api.delete(`/announcements/${id}`);
        toast.success('Announcement deleted successfully');
        fetchAnnouncements();
      } catch (error) {
        console.error('Error deleting announcement:', error);
        toast.error('Failed to delete announcement');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAnnouncement(null);
    setFormData({
      title: '',
      message: '',
      type: 'general',
      priority: 'medium',
      targetAudience: 'all',
      targetDepartments: [],
      expiresAt: '',
    });
  };

  const getTypeColor = (type) => {
    const typeObj = announcementTypes.find(t => t.value === type);
    return typeObj?.color || 'blue';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Announcements
          </h1>
          <p className="text-gray-600 mt-1">
            {announcements.length} active announcement{announcements.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        {user?.role === 'admin' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg"
          >
            <FiPlus className="text-xl" />
            New Announcement
          </motion.button>
        )}
      </motion.div>

      {/* Announcements Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {announcements.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full bg-white/70 backdrop-blur-xl rounded-2xl p-12 text-center"
            >
              <div className="text-6xl mb-4">📢</div>
              <p className="text-gray-500 text-lg">No announcements yet</p>
              <p className="text-gray-400 text-sm mt-2">Create your first announcement to get started</p>
            </motion.div>
          ) : (
            announcements.map((announcement, index) => {
              const TypeIcon = announcementTypes.find(t => t.value === announcement.type)?.icon || FiBell;
              const typeColor = getTypeColor(announcement.type);
              const priorityColor = getPriorityColor(announcement.priority);
              
              return (
                <motion.div
                  key={announcement._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/20"
                >
                  {/* Priority Bar */}
                  <div className={`h-2 bg-gradient-to-r ${
                    priorityColor === 'red' ? 'from-red-500 to-red-600' :
                    priorityColor === 'yellow' ? 'from-yellow-500 to-yellow-600' :
                    'from-green-500 to-green-600'
                  }`} />

                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-3 bg-gradient-to-br ${
                          typeColor === 'red' ? 'from-red-500 to-red-600' :
                          typeColor === 'blue' ? 'from-blue-500 to-blue-600' :
                          typeColor === 'purple' ? 'from-purple-500 to-purple-600' :
                          typeColor === 'yellow' ? 'from-yellow-500 to-yellow-600' :
                          'from-green-500 to-green-600'
                        } rounded-xl text-white`}>
                          <TypeIcon className="text-xl" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{announcement.title}</h3>
                          <div className="flex flex-wrap gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              typeColor === 'red' ? 'bg-red-100 text-red-800' :
                              typeColor === 'blue' ? 'bg-blue-100 text-blue-800' :
                              typeColor === 'purple' ? 'bg-purple-100 text-purple-800' :
                              typeColor === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {announcement.type}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                              priorityColor === 'red' ? 'bg-red-100 text-red-800' :
                              priorityColor === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {announcement.priority} Priority
                            </span>
                          </div>
                        </div>
                      </div>

                      {user?.role === 'admin' && (
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(announcement)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <FiEdit2 size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(announcement._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FiTrash2 size={18} />
                          </motion.button>
                        </div>
                      )}
                    </div>

                    {/* Message */}
                    <p className="text-gray-600 mb-4 whitespace-pre-wrap">{announcement.message}</p>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <FiUsers />
                          <span className="capitalize">{announcement.targetAudience}</span>
                        </div>
                        {announcement.expiresAt && (
                          <div className="flex items-center gap-1">
                            <FiCalendar />
                            <span>Expires: {new Date(announcement.expiresAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs">
                        By {announcement.createdBy?.name || 'Admin'} • {new Date(announcement.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Read Count (for admin) */}
                    {user?.role === 'admin' && announcement.readBy && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                        <FiCheckCircle />
                        <span>{announcement.readBy.length} employee{announcement.readBy.length !== 1 ? 's' : ''} read this</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl my-8"
            >
              <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl">
                <div className="flex items-center gap-3 text-white">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur">
                    <FiBell className="text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}
                    </h2>
                    <p className="text-blue-100 text-sm">Share important updates with your team</p>
                  </div>
                </div>
                <button onClick={handleCloseModal} className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white">
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Announcement Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Office Holiday on Friday"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    placeholder="Write your announcement message here..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Type & Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Type *</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {announcementTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Priority *</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                {/* Target Audience */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Target Audience *</label>
                  <select
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Employees</option>
                    <option value="employees">Employees Only</option>
                    <option value="specific">Specific Departments</option>
                  </select>
                </div>

                {/* Department Selection */}
                {formData.targetAudience === 'specific' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Departments
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {departments.map(dept => (
                        <label
                          key={dept}
                          className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition-all ${
                            formData.targetDepartments.includes(dept)
                              ? 'bg-blue-50 border-blue-500'
                              : 'border-gray-300 hover:border-blue-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.targetDepartments.includes(dept)}
                            onChange={() => handleDepartmentToggle(dept)}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          <span className="text-sm font-medium">{dept}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expiry Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    name="expiresAt"
                    value={formData.expiresAt}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCloseModal}
                    className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-medium shadow-lg"
                  >
                    {editingAnnouncement ? 'Update' : 'Create'} Announcement
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Announcements;
