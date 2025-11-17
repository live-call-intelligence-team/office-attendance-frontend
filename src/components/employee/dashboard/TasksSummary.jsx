import { motion } from 'framer-motion';
import { FiCheckSquare } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const TasksSummary = ({ stats }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
      className="bg-background-card rounded-2xl shadow-custom p-6 border border-border"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl">
            <FiCheckSquare className="text-text-white text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary">✅ MY TASKS</h2>
        </div>
        <button 
          onClick={() => navigate('/employee/tasks')}
          className="text-primary-500 hover:text-primary-600 font-medium text-sm"
        >
          View All {stats?.myTasks || 0} →
        </button>
      </div>

      {/* Priority Overview */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-text-primary mb-4">PRIORITY OVERVIEW:</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-error-500 rounded-full" />
            <span className="text-sm text-text-primary">🔴 Urgent: 0</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-warning-500 rounded-full" />
            <span className="text-sm text-text-primary">🟡 High: 0</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-accent-500 rounded-full" />
            <span className="text-sm text-text-primary">🟢 Normal: 0</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-text-muted rounded-full" />
            <span className="text-sm text-text-primary">⚪ Low: 0</span>
          </div>
        </div>
      </div>

      {/* Status Pills */}
      <div className="flex gap-3 mb-6">
        <div className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-semibold border border-primary-200">
          📋 To Do: 0
        </div>
        <div className="px-4 py-2 bg-warning-50 text-warning-700 rounded-lg text-sm font-semibold border border-warning-200">
          🔄 In Progress: 0
        </div>
        <div className="px-4 py-2 bg-accent-50 text-accent-700 rounded-lg text-sm font-semibold border border-accent-200">
          ✅ Done: {stats?.completedTasks || 0}
        </div>
      </div>

      {/* Empty State */}
      <div className="p-6 bg-accent-50 rounded-xl border border-accent-200 text-center mb-4">
        <p className="text-accent-700 font-semibold mb-1">🎉 All caught up! No pending tasks.</p>
        <p className="text-sm text-accent-600">Great job staying on top of your work!</p>
      </div>

      {/* Weekly Stats */}
      <div className="text-center">
        <p className="text-sm font-semibold text-text-primary">
          COMPLETED THIS WEEK: {stats?.completedTasks || 0} tasks ✨
        </p>
      </div>
    </motion.div>
  );
};

export default TasksSummary;
