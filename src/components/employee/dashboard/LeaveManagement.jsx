import { motion } from 'framer-motion';
import { FiCalendar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const LeaveManagement = ({ leaveBalance }) => {
  const navigate = useNavigate();

  const leaveTypes = leaveBalance ? [
    { 
      label: 'Casual', 
      remaining: leaveBalance.casualLeave.remaining, 
      used: leaveBalance.casualLeave.used,
      total: leaveBalance.casualLeave.total,
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200',
      textColor: 'text-primary-700',
    },
    { 
      label: 'Sick', 
      remaining: leaveBalance.sickLeave.remaining, 
      used: leaveBalance.sickLeave.used,
      total: leaveBalance.sickLeave.total,
      bgColor: 'bg-error-50',
      borderColor: 'border-error-200',
      textColor: 'text-error-700',
    },
    { 
      label: 'Earned', 
      remaining: leaveBalance.earnedLeave.remaining, 
      used: leaveBalance.earnedLeave.used,
      total: leaveBalance.earnedLeave.total,
      bgColor: 'bg-accent-50',
      borderColor: 'border-accent-200',
      textColor: 'text-accent-700',
    },
    { 
      label: 'Comp Off', 
      remaining: leaveBalance.compOff.remaining, 
      used: leaveBalance.compOff.used,
      total: leaveBalance.compOff.total,
      bgColor: 'bg-secondary-50',
      borderColor: 'border-secondary-200',
      textColor: 'text-secondary-700',
    },
  ] : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="bg-background-card rounded-2xl shadow-custom p-6 border border-border"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-warning-500 to-warning-600 rounded-xl">
            <FiCalendar className="text-text-white text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary">🏖️ LEAVE MANAGEMENT</h2>
        </div>
        <button 
          onClick={() => navigate('/employee/leaves')}
          className="text-primary-500 hover:text-primary-600 font-medium text-sm"
        >
          Apply Leave →
        </button>
      </div>

      {/* Leave Balance */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-text-primary mb-4">YOUR BALANCE:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {leaveTypes.map((leave, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className={`p-4 ${leave.bgColor} rounded-xl border ${leave.borderColor}`}
            >
              <h4 className="text-sm font-semibold text-text-secondary mb-2">{leave.label}</h4>
              <p className={`text-3xl font-bold ${leave.textColor} mb-1`}>{leave.remaining}</p>
              <p className="text-xs text-text-secondary">days</p>
              <p className="text-xs text-text-muted mt-2">Used: {leave.used}/{leave.total}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pending Requests */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-text-primary mb-4">PENDING REQUESTS (0):</h3>
        <div className="p-6 bg-accent-50 rounded-xl border border-accent-200 text-center">
          <p className="text-accent-700 font-semibold mb-1">✅ No pending leave requests</p>
          <p className="text-sm text-accent-600">Your requests are all processed!</p>
        </div>
      </div>

      {/* Recent History */}
      <div>
        <h3 className="text-lg font-bold text-text-primary mb-4">RECENT HISTORY:</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-background-secondary rounded-lg">
            <span className="text-sm text-text-primary">✅ Oct 15-16 (Casual) - Approved</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-background-secondary rounded-lg">
            <span className="text-sm text-text-primary">✅ Sep 05 (Sick) - Approved</span>
          </div>
        </div>
        <button 
          onClick={() => navigate('/employee/leaves')}
          className="mt-4 w-full py-2 text-primary-500 hover:text-primary-600 font-medium text-sm"
        >
          View Full History →
        </button>
      </div>
    </motion.div>
  );
};

export default LeaveManagement;
