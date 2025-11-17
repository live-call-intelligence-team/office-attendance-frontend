import { motion } from 'framer-motion';
import { FiUsers } from 'react-icons/fi';

const TeamActivity = () => {
  const activities = [
    { user: 'John Doe', action: 'completed "Q4 Report"', time: '2 mins ago', avatar: 'J' },
    { user: 'Sarah Smith', action: 'marked attendance', time: '15 mins ago', avatar: 'S' },
    { user: 'Mike Johnson', action: 'applied for leave (Nov 18-20)', time: '1 hour ago', avatar: 'M' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1 }}
      className="bg-background-card rounded-2xl shadow-custom p-6 border border-border"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl">
            <FiUsers className="text-text-white text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary">👥 TEAM ACTIVITY</h2>
        </div>
        <button className="text-primary-500 hover:text-primary-600 font-medium text-sm">
          View All →
        </button>
      </div>

      <div className="space-y-3 mb-6">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 + index * 0.1 }}
            className="flex items-center gap-4 p-4 bg-background-secondary rounded-xl hover:bg-primary-50 transition-all cursor-pointer group border border-transparent hover:border-primary-200"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-text-white font-bold text-lg shadow-lg">
              {activity.avatar}
            </div>
            <div className="flex-1">
              <p className="text-sm text-text-primary">
                <span className="font-semibold">👤 {activity.user}</span> {activity.action}
              </p>
            </div>
            <span className="text-xs text-text-muted">{activity.time}</span>
          </motion.div>
        ))}
      </div>

      {/* Who's Out Today */}
      <div className="p-4 bg-warning-50 rounded-xl border border-warning-200">
        <p className="text-sm font-semibold text-warning-700">
          WHO'S OUT TODAY: 3 teammates on leave 🏖️
        </p>
      </div>
    </motion.div>
  );
};

export default TeamActivity;
