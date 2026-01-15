import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F0F4F8]">
                <Loader2 className="w-10 h-10 text-wa-green animate-spin" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Redirect to onboarding if not completed and trying to access dashboard
    if (!user.onboarding_completed && location.pathname !== '/onboarding') {
        return <Navigate to="/onboarding" replace />;
    }

    // Redirect to dashboard if onboarding completed and trying to access onboarding
    if (user.onboarding_completed && location.pathname === '/onboarding') {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};
