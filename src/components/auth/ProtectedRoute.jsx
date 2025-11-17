import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useAuth();

    console.log('ProtectedRoute - Loading:', loading);
    console.log('ProtectedRoute - User:', user);
    console.log('ProtectedRoute - Allowed Roles:', allowedRoles);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        console.log('No user found, redirecting to login');
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        console.log('User role not allowed:', user.role);
        return <Navigate to="/login" replace />;
    }

    console.log('Access granted for user:', user.name);
    return children;
};

export default ProtectedRoute;
