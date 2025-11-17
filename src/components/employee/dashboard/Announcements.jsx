import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Announcements = ({ announcements, currentAnnouncement, setCurrentAnnouncement }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      className="bg-background-card rounded-2xl shadow-custom p-6 border border-border"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          📢 COMPANY ANNOUNCEMENTS
        </h2>
        <button className="text-primary-500 hover:text-primary-600 font-medium text-sm">
          View All (5) →
        </button>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAnnouncement}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="p-6 bg-primary-50 rounded-xl border border-primary-200"
          >
            <h3 className="text-xl font-bold text-text-primary mb-2">
              {announcements[currentAnnouncement].title}
            </h3>
            <p className="text-text-secondary mb-3">{announcements[currentAnnouncement].content}</p>
            <div className="flex items-center justify-between">
              <p className="text-sm text-text-muted">
                Posted by {announcements[currentAnnouncement].author} • {announcements[currentAnnouncement].time}
              </p>
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                [Read More]
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 pointer-events-none">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentAnnouncement((prev) => (prev - 1 + announcements.length) % announcements.length)}
            className="pointer-events-auto w-10 h-10 bg-background-card shadow-custom rounded-full flex items-center justify-center hover:bg-primary-50 border border-border"
          >
            <FiChevronLeft className="text-text-primary" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentAnnouncement((prev) => (prev + 1) % announcements.length)}
            className="pointer-events-auto w-10 h-10 bg-background-card shadow-custom rounded-full flex items-center justify-center hover:bg-primary-50 border border-border"
          >
            <FiChevronRight className="text-text-primary" />
          </motion.button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {announcements.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentAnnouncement(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentAnnouncement ? 'bg-primary-600 w-6' : 'bg-border'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Announcements;
