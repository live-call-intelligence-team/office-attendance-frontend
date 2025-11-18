import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiUser,
  FiSettings,
  FiFileText,
  FiMessageSquare,
  FiGrid,
  FiCheckSquare,
  FiBarChart2,
  FiFolder,
} from 'react-icons/fi';

const Sidebar = () => {
  const { user } = useAuth();

  const adminMenuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: FiHome },
    { name: 'Employees', path: '/admin/employees', icon: FiUsers },
    { name: 'Attendance', path: '/admin/attendance', icon: FiCalendar },
    { name: 'Leave Management', path: '/admin/leaves', icon: FiFileText },
    { name: 'Team Management', path: '/admin/teams', icon: FiGrid },
    { name: 'Task Management', path: '/admin/tasks', icon: FiCheckSquare },
    { name: 'Projects', path: '/admin/projects', icon: FiFolder },
    { name: 'Analytics & Reports', path: '/admin/analytics', icon: FiBarChart2 },
    { name: 'Team Chat', path: '/admin/chat', icon: FiMessageSquare },
    { name: 'Settings', path: '/admin/settings', icon: FiSettings },
  ];

  const employeeMenuItems = [
    { name: 'Dashboard', path: '/employee/dashboard', icon: FiHome },
    { name: 'My Attendance', path: '/employee/attendance', icon: FiCalendar },
    { name: 'Leave Applications', path: '/employee/leaves', icon: FiFileText },
    { name: 'My Tasks', path: '/employee/tasks', icon: FiCheckSquare },
    { name: 'Projects', path: '/employee/projects', icon: FiFolder },
    { name: 'My Analytics', path: '/employee/analytics', icon: FiBarChart2 },
    { name: 'Team Chat', path: '/employee/chat', icon: FiMessageSquare },
    { name: 'My Profile', path: '/employee/profile', icon: FiUser },
    { name: 'Settings', path: '/employee/settings', icon: FiSettings },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : employeeMenuItems;

  return (
    <aside className="w-64 bg-background-card border-r border-border flex flex-col h-full overflow-y-auto">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-text-white font-bold text-lg">
            OA
          </div>
          <div>
            <h1 className="font-bold text-text-primary text-lg">Office Attendance</h1>
            <p className="text-xs text-text-secondary capitalize">{user?.role} Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-text-white shadow-lg'
                      : 'text-text-secondary hover:bg-background-secondary hover:text-text-primary'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`text-xl ${isActive ? 'text-text-white' : ''}`} />
                    <span className="font-medium">{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Info */}
      <div className="mt-auto p-6 border-t border-border bg-background-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-text-white font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-text-primary text-sm truncate">{user?.name}</p>
            <p className="text-xs text-text-secondary truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
