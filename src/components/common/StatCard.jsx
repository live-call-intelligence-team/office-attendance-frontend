import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const StatCard = ({ title, value, icon: Icon, color, gradient, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-red-600',
    pink: 'from-pink-500 to-pink-600',
  };

  const bgColorClasses = {
    blue: 'from-blue-500/20 to-blue-600/20',
    green: 'from-green-500/20 to-green-600/20',
    yellow: 'from-yellow-500/20 to-yellow-600/20',
    purple: 'from-purple-500/20 to-purple-600/20',
    red: 'from-red-500/20 to-red-600/20',
    pink: 'from-pink-500/20 to-pink-600/20',
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3 }
      }}
      className="relative group"
    >
      {/* Glassmorphism Card */}
      <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 overflow-hidden">
        {/* Gradient Background on Hover */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${bgColorClasses[color]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700">
              {title}
            </p>
            
            {/* Animated Icon */}
            <motion.div
              whileHover={{ rotate: 360, scale: 1.2 }}
              transition={{ duration: 0.6 }}
              className={`p-3 bg-gradient-to-br ${colorClasses[color]} rounded-xl shadow-lg`}
            >
              <Icon className="text-white text-xl" />
            </motion.div>
          </div>

          {/* Animated Number */}
          <motion.div
            initial={{ scale: 0.5 }}
            animate={isInView ? { scale: 1 } : { scale: 0.5 }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
          >
            <h3 className="text-4xl font-bold bg-gradient-to-br from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {isInView && (
                <CountUp
                  end={value}
                  duration={2}
                  separator=","
                />
              )}
            </h3>
          </motion.div>
        </div>

        {/* Shine Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />

        {/* Bottom Glow */}
        <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-gradient-to-r ${colorClasses[color]} blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />
      </div>
    </motion.div>
  );
};

export default StatCard;
