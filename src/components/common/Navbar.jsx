import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { FiBell, FiSearch, FiMenu, FiLogOut, FiUser } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifications = [
    { id: 1, text: 'New attendance marked', time: '5 mins ago', unread: true },
    { id: 2, text: 'Leave request approved', time: '1 hour ago', unread: false },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-background-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-background-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-text-primary"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 ml-6">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 hover:bg-background-secondary rounded-lg transition-colors relative"
          >
            <FiBell className="text-xl text-text-secondary" />
            {notifications.some(n => n.unread) && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full"></span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-80 bg-background-card rounded-xl shadow-2xl border border-border overflow-hidden"
              >
                <div className="p-4 border-b border-border">
                  <h3 className="font-bold text-text-primary">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-border hover:bg-background-secondary transition-colors ${
                        notification.unread ? 'bg-primary-50' : ''
                      }`}
                    >
                      <p className="text-sm text-text-primary">{notification.text}</p>
                      <p className="text-xs text-text-muted mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 hover:bg-background-secondary rounded-xl px-3 py-2 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-text-white font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-semibold text-text-primary">{user?.name}</p>
              <p className="text-xs text-text-secondary capitalize">{user?.role}</p>
            </div>
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-64 bg-background-card rounded-xl shadow-2xl border border-border overflow-hidden"
              >
                <div className="p-4 border-b border-border">
                  <p className="font-bold text-text-primary">{user?.name}</p>
                  <p className="text-sm text-text-secondary">{user?.email}</p>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => {
                      navigate(user?.role === 'admin' ? '/admin/settings' : '/employee/profile');
                      setShowProfile(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-background-secondary rounded-lg transition-colors text-text-primary"
                  >
                    <FiUser />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-error-50 rounded-lg transition-colors text-error-600"
                  >
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
