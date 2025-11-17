import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, FiUsers, FiCalendar, FiFileText, FiCheckSquare, 
  FiBarChart2, FiBell, FiSettings, FiMenu, FiX, FiMoon, FiSun,
  FiChevronRight, FiLogOut
} from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const adminMenuItems = [
    { icon: FiHome, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: FiUsers, label: 'Employees', path: '/admin/employees' },
    { icon: FiCalendar, label: 'Attendance', path: '/admin/attendance' },
    { icon: FiFileText, label: 'Leave Management', path: '/admin/leaves' },
    { icon: FiCheckSquare, label: 'Task Management', path: '/admin/tasks' },
    { icon: FiBarChart2, label: 'Analytics', path: '/admin/analytics' },
    { icon: FiBell, label: 'Announcements', path: '/admin/announcements' },
    { icon: FiSettings, label: 'Settings', path: '/admin/settings' },
  ];

  const employeeMenuItems = [
    { icon: FiHome, label: 'Dashboard', path: '/employee/dashboard' },
    { icon: FiCalendar, label: 'My Attendance', path: '/employee/attendance' },
    { icon: FiFileText, label: 'My Leaves', path: '/employee/leaves' },
    { icon: FiCheckSquare, label: 'My Tasks', path: '/employee/tasks' },
    { icon: FiSettings, label: 'My Profile', path: '/employee/profile' },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : employeeMenuItems;

  const sidebarVariants = {
    expanded: { width: '16rem' },
    collapsed: { width: '5rem' }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.3 }
    })
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={isExpanded ? 'expanded' : 'collapsed'}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed left-0 top-0 h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white shadow-2xl z-50 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } transition-transform duration-300`}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              animate={{ justifyContent: isExpanded ? 'flex-start' : 'center' }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold">OA</span>
              </div>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h1 className="text-lg font-bold whitespace-nowrap">Office Attendance</h1>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden lg:flex p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <motion.div
                animate={{ rotate: isExpanded ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                <FiChevronRight />
              </motion.div>
            </button>

            <button onClick={onClose} className="lg:hidden p-2 hover:bg-white/10 rounded-lg">
              <FiX size={20} />
            </button>
          </div>

          {/* User Info */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                    {user?.name?.charAt(0)}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-semibold truncate">{user?.name}</p>
                    <p className="text-xs text-blue-200 capitalize">{user?.role}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <ul className="space-y-2">
            {menuItems.map((item, i) => (
              <motion.li
                key={item.path}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                      isActive
                        ? 'bg-white/20 shadow-lg'
                        : 'hover:bg-white/10'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active Indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-500 rounded-r"
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}

                      {/* Icon */}
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className={`text-xl ${isActive ? 'text-white' : 'text-blue-200 group-hover:text-white'}`}
                      >
                        <item.icon />
                      </motion.div>

                      {/* Label */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className={`font-medium whitespace-nowrap ${
                              isActive ? 'text-white' : 'text-blue-100 group-hover:text-white'
                            }`}
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Hover Effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                      />
                    </>
                  )}
                </NavLink>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDark(!isDark)}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-xl transition-colors"
          >
            <motion.div
              animate={{ rotate: isDark ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isDark ? <FiMoon className="text-xl" /> : <FiSun className="text-xl" />}
            </motion.div>
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-medium"
                >
                  {isDark ? 'Dark Mode' : 'Light Mode'}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Logout */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/20 text-red-300 hover:text-red-200 rounded-xl transition-colors"
          >
            <FiLogOut className="text-xl" />
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-medium"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Version */}
          <AnimatePresence>
            {isExpanded && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-center text-blue-300 pt-2"
              >
                Version 1.0.0
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
