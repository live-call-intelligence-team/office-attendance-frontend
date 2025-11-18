import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './components/auth/Login';
import ProtectedRoute from './components/ProtectedRoute';

// Admin Pages
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import EmployeeManagement from './pages/admin/EmployeeManagement';
import AttendanceManagement from './pages/admin/AttendanceManagement';
import LeaveManagement from './pages/admin/LeaveManagement';
import TeamManagement from './pages/admin/TeamManagement';
import TaskManagement from './pages/admin/TaskManagement';
import Analytics from './pages/admin/Analytics';
import AdminSettings from './pages/admin/Settings';
import AdminTeamChat from './pages/admin/TeamChat';

// Employee Pages
import EmployeeLayout from './layouts/EmployeeLayout';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import MyAttendance from './pages/employee/MyAttendance';
import MyLeaves from './pages/employee/MyLeaves';
import MyTasks from './pages/employee/MyTasks';
import MyAnalytics from './pages/employee/MyAnalytics';
import MyProfile from './pages/employee/MyProfile';
import EmployeeSettings from './pages/employee/Settings';
import TeamChat from './pages/employee/TeamChat';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="employees" element={<EmployeeManagement />} />
            <Route path="attendance" element={<AttendanceManagement />} />
            <Route path="leaves" element={<LeaveManagement />} />
            <Route path="teams" element={<TeamManagement />} />
            <Route path="tasks" element={<TaskManagement />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="chat" element={<AdminTeamChat />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Employee Routes */}
          <Route
            path="/employee"
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <EmployeeLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/employee/dashboard" replace />} />
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="attendance" element={<MyAttendance />} />
            <Route path="leaves" element={<MyLeaves />} />
            <Route path="tasks" element={<MyTasks />} />
            <Route path="analytics" element={<MyAnalytics />} />
            <Route path="chat" element={<TeamChat />} />
            <Route path="profile" element={<MyProfile />} />
            <Route path="settings" element={<EmployeeSettings />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AuthProvider>
    </Router>
  );
}

export default App;
