import { motion } from 'framer-motion';
import { FiClock, FiCalendar, FiCheckSquare } from 'react-icons/fi';

const StatsCards = ({ stats, leaveBalance, workHours }) => {
  const cards = [
    {
      title: 'Working Hours',
      value: workHours,
      subtitle: 'Target: 160h',
      progress: 0,
      icon: FiClock,
      gradient: 'from-primary-500 to-primary-600',
      lightBg: 'bg-primary-50',
      iconColor: 'text-primary-500',
    },
    {
      title: 'Present This Month',
      value: `${stats?.presentDays || 0} Days`,
      subtitle: 'Goal: 22 Days',
      progress: stats?.attendancePercentage || 0,
      icon: FiCalendar,
      gradient: 'from-accent-500 to-accent-600',
      lightBg: 'bg-accent-50',
      iconColor: 'text-accent-500',
    },
    {
      title: 'Leave Balance',
      value: leaveBalance 
        ? `${leaveBalance.casualLeave.remaining + leaveBalance.sickLeave.remaining} Days`
        : '0 Days',
      subtitle: 'Use Soon!',
      progress: 60,
      icon: FiCalendar,
      gradient: 'from-warning-500 to-warning-600',
      lightBg: 'bg-warning-50',
      iconColor: 'text-warning-500',
    },
    {
      title: 'Active Tasks',
      value: stats?.pendingTasks || 0,
      subtitle: stats?.pendingTasks > 0 ? `${stats.pendingTasks} Pending` : 'No Overdue',
      progress: 75,
      icon: FiCheckSquare,
      gradient: 'from-secondary-500 to-secondary-600',
      lightBg: 'bg-secondary-50',
      iconColor: 'text-secondary-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className={`relative bg-background-card rounded-2xl p-6 shadow-custom hover:shadow-custom-lg transition-all cursor-pointer overflow-hidden border border-border`}
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg`}>
                  <Icon className="text-2xl text-text-white" />
                </div>
              </div>
              
              <h3 className="text-sm font-semibold text-text-secondary mb-2">{card.title}</h3>
              <motion.p
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                className="text-3xl font-bold text-text-primary mb-2"
              >
                {card.value}
              </motion.p>

              <div className="w-full bg-background-secondary rounded-full h-2 mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${card.progress}%` }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                  className={`h-2 rounded-full bg-gradient-to-r ${card.gradient}`}
                />
              </div>
              <p className="text-xs text-text-secondary">{card.subtitle}</p>
              <p className="text-xs text-text-muted">{card.progress}% Complete</p>
            </div>

            {/* Decorative background circle */}
            <div className={`absolute -right-8 -bottom-8 w-32 h-32 ${card.lightBg} rounded-full opacity-30`} />
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatsCards;
