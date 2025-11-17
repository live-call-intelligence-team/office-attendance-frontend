import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { toast } from 'react-toastify';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiUsers,
  FiX,
  FiUserPlus,
  FiUserMinus,
} from 'react-icons/fi';

const TeamManagement = () => {
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showMembersModal, setShowMembersModal] = useState(false);

  const [formData, setFormData] = useState({
    displayName: '',
    description: '',
    icon: '👥',
    color: '#3B82F6',
    members: [],
  });

  const iconOptions = ['👥', '💻', '🎨', '📊', '🚀', '⚡', '🔥', '🎯', '💡', '🛠️'];
  const colorOptions = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#84CC16'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [teamsRes, employeesRes] = await Promise.all([
        api.get('/teams'),
        api.get('/users'),
      ]);
      setTeams(teamsRes.data.data || []);
      setEmployees(employeesRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();

    if (!formData.displayName.trim()) {
      toast.error('Team name is required');
      return;
    }

    try {
      const name = formData.displayName.toLowerCase().replace(/\s+/g, '-');
      await api.post('/teams', {
        ...formData,
        name,
      });
      toast.success('Team created successfully!');
      setShowCreateModal(false);
      setFormData({
        displayName: '',
        description: '',
        icon: '👥',
        color: '#3B82F6',
        members: [],
      });
      fetchData();
    } catch (error) {
      console.error('Error creating team:', error);
      toast.error(error.response?.data?.message || 'Failed to create team');
    }
  };

  const handleUpdateTeam = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/teams/${selectedTeam._id}`, formData);
      toast.success('Team updated successfully!');
      setShowEditModal(false);
      setSelectedTeam(null);
      fetchData();
    } catch (error) {
      console.error('Error updating team:', error);
      toast.error(error.response?.data?.message || 'Failed to update team');
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return;

    try {
      await api.delete(`/teams/${teamId}`);
      toast.success('Team deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting team:', error);
      toast.error(error.response?.data?.message || 'Failed to delete team');
    }
  };

  const handleAddMember = async (userId) => {
    try {
      await api.post(`/teams/${selectedTeam._id}/members`, { userId });
      toast.success('Member added successfully');
      fetchData();
      // Update selected team with new data
      const updatedTeam = teams.find(t => t._id === selectedTeam._id);
      setSelectedTeam(updatedTeam);
    } catch (error) {
      console.error('Error adding member:', error);
      toast.error(error.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await api.delete(`/teams/${selectedTeam._id}/members/${userId}`);
      toast.success('Member removed successfully');
      fetchData();
      const updatedTeam = teams.find(t => t._id === selectedTeam._id);
      setSelectedTeam(updatedTeam);
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error(error.response?.data?.message || 'Failed to remove member');
    }
  };

  const openEditModal = (team) => {
    setSelectedTeam(team);
    setFormData({
      displayName: team.displayName,
      description: team.description,
      icon: team.icon,
      color: team.color,
      members: team.members.map(m => m._id),
    });
    setShowEditModal(true);
  };

  const openMembersModal = (team) => {
    setSelectedTeam(team);
    setShowMembersModal(true);
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
            Team Management
          </h1>
          <p className="text-text-secondary mt-1">Create and manage chat teams</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <FiPlus />
          Create Team
        </motion.button>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team, index) => (
          <motion.div
            key={team._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-background-card rounded-2xl shadow-custom border border-border overflow-hidden"
            style={{ borderTopColor: team.color, borderTopWidth: '4px' }}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${team.color}20` }}
                  >
                    {team.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">{team.displayName}</h3>
                    <p className="text-xs text-text-muted">
                      {team.type === 'system' ? 'System Team' : 'Custom Team'}
                    </p>
                  </div>
                </div>

                {team.type !== 'system' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(team)}
                      className="p-2 hover:bg-background-secondary rounded-lg transition-colors"
                      title="Edit Team"
                    >
                      <FiEdit2 className="text-text-secondary" />
                    </button>
                    <button
                      onClick={() => handleDeleteTeam(team._id)}
                      className="p-2 hover:bg-error-50 rounded-lg transition-colors"
                      title="Delete Team"
                    >
                      <FiTrash2 className="text-error-500" />
                    </button>
                  </div>
                )}
              </div>

              <p className="text-sm text-text-secondary mb-4">{team.description}</p>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <FiUsers className="text-text-muted" />
                  <span className="text-sm text-text-secondary">
                    {team.members?.length || 0} members
                  </span>
                </div>
                <button
                  onClick={() => openMembersModal(team)}
                  className="px-4 py-2 bg-background-secondary hover:bg-border rounded-lg text-sm font-semibold text-text-primary transition-colors"
                >
                  Manage Members
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Team Modal */}
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
                <h3 className="text-2xl font-bold text-text-primary">Create New Team</h3>
              </div>

              <form onSubmit={handleCreateTeam} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    placeholder="e.g., Engineering Team"
                    className="w-full px-4 py-3 bg-background-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-text-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the team..."
                    rows={3}
                    className="w-full px-4 py-3 bg-background-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-text-primary resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    Icon
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon })}
                        className={`p-3 text-2xl rounded-xl transition-all ${
                          formData.icon === icon
                            ? 'bg-primary-100 border-2 border-primary-500'
                            : 'bg-background-secondary border-2 border-transparent hover:bg-background-primary'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    Color
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        className={`w-full h-12 rounded-xl transition-all ${
                          formData.color === color
                            ? 'ring-4 ring-offset-2 ring-primary-500'
                            : 'hover:scale-110'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    Create Team
                  </motion.button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setFormData({
                        displayName: '',
                        description: '',
                        icon: '👥',
                        color: '#3B82F6',
                        members: [],
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

      {/* Edit Team Modal - Similar to Create */}
      <AnimatePresence>
        {showEditModal && selectedTeam && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-border">
                <h3 className="text-2xl font-bold text-text-primary">Edit Team</h3>
              </div>

              <form onSubmit={handleUpdateTeam} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="w-full px-4 py-3 bg-background-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-text-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-background-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-text-primary resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    Icon
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon })}
                        className={`p-3 text-2xl rounded-xl transition-all ${
                          formData.icon === icon
                            ? 'bg-primary-100 border-2 border-primary-500'
                            : 'bg-background-secondary border-2 border-transparent hover:bg-background-primary'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    Color
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        className={`w-full h-12 rounded-xl transition-all ${
                          formData.color === color
                            ? 'ring-4 ring-offset-2 ring-primary-500'
                            : 'hover:scale-110'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    Update Team
                  </motion.button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedTeam(null);
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

      {/* Members Management Modal */}
      <AnimatePresence>
        {showMembersModal && selectedTeam && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background-card rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-text-primary">Manage Team Members</h3>
                  <p className="text-sm text-text-secondary mt-1">{selectedTeam.displayName}</p>
                </div>
                <button
                  onClick={() => setShowMembersModal(false)}
                  className="p-2 hover:bg-background-secondary rounded-lg transition-colors"
                >
                  <FiX className="text-2xl text-text-secondary" />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Current Members */}
                  <div>
                    <h4 className="text-lg font-bold text-text-primary mb-4">
                      Current Members ({selectedTeam.members?.length || 0})
                    </h4>
                    <div className="space-y-2">
                      {selectedTeam.members?.length === 0 ? (
                        <p className="text-text-muted text-center py-8">No members yet</p>
                      ) : (
                        selectedTeam.members?.map((member) => (
                          <div
                            key={member._id}
                            className="flex items-center justify-between p-3 bg-background-secondary rounded-xl"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-text-white font-bold">
                                {member.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-text-primary text-sm">{member.name}</p>
                                <p className="text-xs text-text-muted">{member.email}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveMember(member._id)}
                              className="p-2 hover:bg-error-50 rounded-lg transition-colors"
                              title="Remove Member"
                            >
                              <FiUserMinus className="text-error-500" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Available Employees */}
                  <div>
                    <h4 className="text-lg font-bold text-text-primary mb-4">
                      Available Employees
                    </h4>
                    <div className="space-y-2">
                      {employees
                        .filter(emp => !selectedTeam.members?.some(m => m._id === emp._id))
                        .map((employee) => (
                          <div
                            key={employee._id}
                            className="flex items-center justify-between p-3 bg-background-secondary rounded-xl"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center text-text-white font-bold">
                                {employee.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-text-primary text-sm">{employee.name}</p>
                                <p className="text-xs text-text-muted">{employee.email}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleAddMember(employee._id)}
                              className="p-2 hover:bg-accent-50 rounded-lg transition-colors"
                              title="Add Member"
                            >
                              <FiUserPlus className="text-accent-500" />
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamManagement;
