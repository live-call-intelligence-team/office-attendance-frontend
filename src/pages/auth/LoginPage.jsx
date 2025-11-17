import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Login from '../../components/auth/Login';

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated, user } = useAuth();

    // Redirect if already logged in
    if (isAuthenticated && user) {
        return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'} replace />;
    }

    const handleLogin = async (email, password) => {
        setLoading(true);
        try {
            await login(email, password);
        } catch (error) {
            // Error already shown by toast
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
                <Login onSubmit={handleLogin} loading={loading} />
            </div>
        </div>
    );
};

export default LoginPage;
