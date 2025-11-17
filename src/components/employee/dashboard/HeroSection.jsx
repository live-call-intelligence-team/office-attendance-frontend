import { motion } from 'framer-motion';
import { FiSun, FiMoon, FiCoffee } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const HeroSection = ({ user, currentTime, clockedIn, workHours, breakTime }) => {
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return { text: 'Good Morning', emoji: '🌅', icon: FiSun };
    if (hour < 18) return { text: 'Good Afternoon', emoji: '☀️', icon: FiSun };
    return { text: 'Good Evening', emoji: '🌙', icon: FiMoon };
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-3xl overflow-hidden shadow-custom-xl"
      style={{ height: '300px' }}
    >
      {/* Professional Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-700" 
           style={{
             backgroundSize: '200% 200%',
             animation: 'gradient-x 15s ease infinite'
           }}
      />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-8">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 mb-2"
          >
            <GreetingIcon className="text-4xl text-text-white" />
            <h1 className="text-4xl font-bold text-text-white">
              {greeting.text}, {user?.name}! {greeting.emoji}
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-white/90 flex items-center gap-3"
          >
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
            <span>•</span>
            You're doing great this month! 🎉
          </motion.p>
        </div>

        {/* Clock Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`w-3 h-3 ${clockedIn ? 'bg-accent-400' : 'bg-error-400'} rounded-full shadow-lg`}
                />
                <span className="text-text-white font-semibold text-lg">
                  STATUS: {clockedIn ? '�� CLOCKED IN' : '🔴 NOT CLOCKED IN'}
                </span>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/employee/attendance')}
                  className="px-6 py-2 bg-accent-500 hover:bg-accent-600 backdrop-blur rounded-xl text-text-white font-medium flex items-center gap-2 transition-all shadow-lg"
                >
                  🚀 Clock In Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl text-text-white font-medium flex items-center gap-2 transition-all"
                >
                  <FiCoffee /> Take Break
                </motion.button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-text-white">
              <div>
                <p className="text-white/70 text-sm">Today's Time</p>
                <p className="text-2xl font-bold font-mono">{workHours}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm">Break Time</p>
                <p className="text-2xl font-bold font-mono">{breakTime}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm">Expected End</p>
                <p className="text-xl font-bold">--:--</p>
              </div>
              <div>
                <p className="text-white/70 text-sm">Productivity</p>
                <p className="text-xl font-bold">--%</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroSection;
