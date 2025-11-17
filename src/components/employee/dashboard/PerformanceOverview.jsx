import { motion } from 'framer-motion';
import { FiBarChart2 } from 'react-icons/fi';

const PerformanceOverview = ({ stats }) => {
  const metrics = [
    { 
      label: 'Attendance', 
      value: stats?.attendancePercentage || 0, 
      gradient: 'from-primary-400 to-primary-600',
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200',
    },
    { 
      label: 'Tasks Done', 
      value: 85, 
      gradient: 'from-accent-400 to-accent-600',
      bgColor: 'bg-accent-50',
      borderColor: 'border-accent-200',
    },
    { 
      label: 'Rating', 
      value: 96, 
      rating: '⭐⭐⭐⭐⭐',
      subtext: 'No data',
      gradient: 'from-secondary-400 to-secondary-600',
      bgColor: 'bg-secondary-50',
      borderColor: 'border-secondary-200',
    },
  ];

  const achievements = [
    { icon: '🥇', label: 'Perfect Attendance', subtitle: 'November', locked: true },
    { icon: '🥈', label: 'Task Master', subtitle: 'Completed 50+ tasks', locked: true },
    { icon: '🥉', label: 'Team Player', subtitle: 'Helped 10 colleagues', locked: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0 }}
      className="bg-background-card rounded-2xl shadow-custom p-6 border border-border"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
            <FiBarChart2 className="text-text-white text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary">📊 YOUR PERFORMANCE</h2>
        </div>
        <select className="text-sm border-2 border-border rounded-lg px-3 py-1 text-text-primary bg-background-card">
          <option>This Month</option>
          <option>Last Month</option>
          <option>Last 3 Months</option>
        </select>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {metrics.map((metric, index) => (
          <div 
            key={index} 
            className={`p-6 ${metric.bgColor} rounded-xl border ${metric.borderColor}`}
          >
            <h3 className="text-sm font-semibold text-text-secondary mb-2">{metric.label}</h3>
            <p className="text-4xl font-bold text-text-primary mb-2">
              {metric.rating || `${metric.value}%`}
            </p>
            <div className="w-full bg-background-secondary rounded-full h-2 mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metric.value}%` }}
                transition={{ duration: 1, delay: 1.1 + index * 0.1 }}
                className={`h-2 rounded-full bg-gradient-to-r ${metric.gradient}`}
              />
            </div>
            {metric.subtext && (
              <p className="text-sm text-text-secondary mt-2">{metric.subtext}</p>
            )}
          </div>
        ))}
      </div>

      {/* Productivity Trend */}
      <div className="mb-6 p-6 bg-background-secondary rounded-xl border border-border">
        <h3 className="text-lg font-bold text-text-primary mb-4">📈 PRODUCTIVITY TREND (Last 6 months)</h3>
        <div className="h-40 flex items-center justify-center text-text-muted">
          [Line Chart - No data available yet]
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h3 className="text-lg font-bold text-text-primary mb-4">🏆 ACHIEVEMENTS:</h3>
        <div className="flex flex-wrap gap-3">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + index * 0.1, type: "spring" }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                achievement.locked 
                  ? 'bg-background-secondary border-2 border-border opacity-50'
                  : 'bg-warning-50 border-2 border-warning-300'
              }`}
            >
              <span className="text-3xl">{achievement.icon}</span>
              <div>
                <p className="font-bold text-text-primary text-sm">{achievement.label}</p>
                <p className="text-xs text-text-secondary">{achievement.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <p className="text-sm text-text-muted mt-4 text-center">
          [All Locked - Complete goals to unlock badges]
        </p>
      </div>
    </motion.div>
  );
};

export default PerformanceOverview;
