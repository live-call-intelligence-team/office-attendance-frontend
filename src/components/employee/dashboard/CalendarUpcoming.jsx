import { motion } from 'framer-motion';
import { FiCalendar } from 'react-icons/fi';

const CalendarUpcoming = () => {
  const upcomingEvents = [
    { 
      title: '🎉 Diwali Holiday', 
      date: 'Nov 18-20 (3 days)', 
      bgColor: 'bg-secondary-50',
      borderColor: 'border-secondary-200',
      textColor: 'text-secondary-700',
      action: 'View Details' 
    },
    { 
      title: '💼 Team Meeting', 
      date: 'Today, 2:00 PM', 
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200',
      textColor: 'text-primary-700',
      action: 'Join Now' 
    },
    { 
      title: '📝 Project Deadline', 
      date: 'Nov 25', 
      bgColor: 'bg-warning-50',
      borderColor: 'border-warning-200',
      textColor: 'text-warning-700',
      action: 'View Task' 
    },
  ];

  const quickActions = [
    { label: '🕐 Mark', action: () => {} },
    { label: '🏖️ Leave', action: () => {} },
    { label: '✅ Task', action: () => {} },
    { label: '📄 Docs', action: () => {} },
    { label: '�� Goals', action: () => {} },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
        className="lg:col-span-2 bg-background-card rounded-2xl shadow-custom p-6 border border-border"
      >
        <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
          📅 NOVEMBER 2025
        </h2>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div key={day} className="text-center font-semibold text-text-secondary text-sm">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {[...Array(30)].map((_, i) => {
            const day = i + 1;
            const isToday = day === 16;
            const isWeekend = (i % 7 === 0) || (i % 7 === 6);
            
            return (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1 }}
                className={`aspect-square flex items-center justify-center rounded-lg cursor-pointer text-sm font-medium transition-all ${
                  isToday
                    ? 'bg-gradient-to-br from-primary-500 to-secondary-500 text-text-white shadow-lg'
                    : isWeekend
                    ? 'bg-secondary-50 text-secondary-600'
                    : 'bg-background-secondary text-text-primary hover:bg-primary-50'
                }`}
              >
                {day}
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-accent-500 rounded-full" />
            <span className="text-xs text-text-secondary">🟢 Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-error-500 rounded-full" />
            <span className="text-xs text-text-secondary">🔴 Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-warning-500 rounded-full" />
            <span className="text-xs text-text-secondary">�� Leave</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary-500 rounded-full" />
            <span className="text-xs text-text-secondary">🔵 Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-border rounded-full" />
            <span className="text-xs text-text-secondary">⚪ Holiday</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-secondary-500 rounded-full" />
            <span className="text-xs text-text-secondary">🟣 Weekend</span>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 p-4 bg-accent-50 rounded-xl border border-accent-200">
          <p className="text-sm font-semibold text-text-primary">📊 Attendance: 95%</p>
          <p className="text-sm font-semibold text-warning-600">🔥 5 Day Streak!</p>
        </div>
      </motion.div>

      {/* Upcoming & Quick Actions */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-background-card rounded-2xl shadow-custom p-6 border border-border"
      >
        <h2 className="text-xl font-bold text-text-primary mb-6">📌 UPCOMING</h2>

        <div className="space-y-4 mb-6">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.05, x: 5 }}
              className={`p-4 ${event.bgColor} rounded-xl border ${event.borderColor} cursor-pointer`}
            >
              <h3 className={`font-semibold ${event.textColor} mb-1`}>{event.title}</h3>
              <p className="text-sm text-text-secondary mb-2">{event.date}</p>
              <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                [{event.action}]
              </button>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-bold text-text-primary mb-4">⚡ QUICK ACTIONS:</h3>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={action.action}
                className="px-3 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-text-white rounded-lg text-xs font-medium hover:shadow-lg transition-all"
              >
                {action.label}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CalendarUpcoming;
