import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('═══════════════════════════════════════');
  console.log('🛡️ PROTECTED ROUTE CHECK');
  console.log('   Path:', location.pathname);
  console.log('   Loading:', loading);
  console.log('   User:', user?.name || 'null');
  console.log('   User Role:', user?.role || 'null');
  console.log('   Allowed Roles:', allowedRoles);
  console.log('   Token in localStorage:', !!localStorage.getItem('token'));

  if (loading) {
    console.log('   ⏳ LOADING - showing spinner');
    console.log('═══════════════════════════════════════');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    console.log('   ❌ NO USER - redirecting to login');
    console.log('═══════════════════════════════════════');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log('   ❌ ROLE NOT ALLOWED');
    console.log('   User has role:', user.role);
    console.log('   Required roles:', allowedRoles);
    console.log('   Redirecting to:', user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard');
    console.log('═══════════════════════════════════════');
    
    // Redirect to appropriate dashboard based on role
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'} replace />;
  }

  console.log('   ✅ ACCESS GRANTED');
  console.log('═══════════════════════════════════════');
  
  return children;
};

export default ProtectedRoute;
