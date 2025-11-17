import { motion } from 'framer-motion';
import { FiClock } from 'react-icons/fi';

const AttendanceTimeline = ({ workHours, breakTime }) => {
  const weeklyData = [
    { day: 'Mon', hours: 8, percentage: 100 },
    { day: 'Tue', hours: 8, percentage: 100 },
    { day: 'Wed', hours: 8, percentage: 100 },
    { day: 'Thu', hours: 8, percentage: 100 },
    { day: 'Fri', hours: 0, percentage: 0 },
    { day: 'Sat', hours: 0, percentage: 0, off: true },
    { day: 'Sun', hours: 0, percentage: 0, off: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-background-card rounded-2xl shadow-custom p-6 border border-border"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
            <FiClock className="text-text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text-primary">⏱️ Today's Timeline</h2>
            <p className="text-sm text-text-secondary">Track your work hours and breaks</p>
          </div>
        </div>
        <button className="text-primary-500 hover:text-primary-600 font-medium text-sm">
          View Full Week →
        </button>
      </div>

      {/* Timeline */}
      <div className="relative mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-text-secondary">09:00 AM</span>
          <span className="text-sm font-semibold text-text-secondary">06:00 PM</span>
        </div>
        
        <div className="relative h-2 bg-background-secondary rounded-full">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '0%' }}
            className="absolute h-2 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full"
          />
          
          <div className="absolute left-0 -top-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-6 bg-error-500 rounded-full border-4 border-background-card shadow-lg"
            />
            <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
              <p className="text-xs font-semibold text-error-500">🔴 Not Started</p>
              <p className="text-xs text-text-muted">Click "Clock In"</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-background-secondary rounded-xl mb-6">
        <div>
          <p className="text-xs text-text-secondary">Today</p>
          <p className="text-xl font-bold text-text-primary">{workHours}</p>
        </div>
        <div>
          <p className="text-xs text-text-secondary">Break</p>
          <p className="text-xl font-bold text-text-primary">{breakTime}</p>
        </div>
        <div>
          <p className="text-xs text-text-secondary">Productive</p>
          <p className="text-xl font-bold text-accent-500">{workHours}</p>
        </div>
        <div>
          <p className="text-xs text-text-secondary">Status</p>
          <p className="text-xl font-bold text-text-muted">⚪ Not Started</p>
        </div>
      </div>

      {/* Weekly Overview */}
      <div>
        <h3 className="text-lg font-bold text-text-primary mb-4">📊 WEEK AT A GLANCE:</h3>
        <div className="grid grid-cols-7 gap-2">
          {weeklyData.map((day, index) => (
            <div key={index} className="text-center">
              <p className="text-xs font-semibold text-text-secondary mb-2">{day.day}</p>
              <div className="relative h-24 bg-background-secondary rounded-lg overflow-hidden">
                {day.off ? (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-text-muted">
                    OFF
                  </div>
                ) : (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${day.percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`absolute bottom-0 w-full ${
                      day.hours === 8 
                        ? 'bg-gradient-to-t from-accent-400 to-accent-500' 
                        : 'bg-gradient-to-t from-text-muted to-text-secondary'
                    }`}
                  />
                )}
              </div>
              <p className="text-xs font-bold text-text-primary mt-2">{day.hours}h</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AttendanceTimeline;
