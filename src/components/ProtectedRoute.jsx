import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  console.log('');
  console.log('🛡️ PROTECTED ROUTE CHECK');
  console.log('   Loading:', loading);
  console.log('   User:', user ? user.name : 'NULL');
  console.log('   User Role:', user?.role || 'NULL');
  console.log('   Allowed Roles:', allowedRoles);
  console.log('   Token in localStorage:', !!localStorage.getItem('token'));

  if (loading) {
    console.log('   ⏳ Still loading - showing spinner');
    console.log('');
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('   ❌ NO USER - Redirecting to /login');
    console.log('');
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log('   ❌ WRONG ROLE - User is', user.role, 'but needs', allowedRoles);
    console.log('   Redirecting to /login');
    console.log('');
    return <Navigate to="/login" replace />;
  }

  console.log('   ✅ ACCESS GRANTED - Rendering protected content');
  console.log('');
  return children;
};

export default ProtectedRoute;
