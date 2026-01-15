import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import api from '../services/api';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // CSRF cookie for Sanctum
            await api.get('/sanctum/csrf-cookie').catch(() => { });

            const response = await api.post('/login', { email, password });
            const { token, user } = response.data;

            login(token, user);

            if (!user.onboarding_completed) {
                navigate('/onboarding');
            } else {
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 sm:p-10">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
                <p className="text-sm text-gray-500 mt-2">Enter your credentials to access your account</p>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm flex items-start gap-2 border border-red-100">
                    <AlertCircle size={16} className="mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-wa-green focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                            placeholder="you@company.com"
                        />
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <Link to="/forgot-password" className="text-xs font-semibold text-wa-green hover:text-green-700 transition-colors">Forgot Password?</Link>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-wa-green focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div className="flex items-center">
                    <input
                        id="remember"
                        type="checkbox"
                        className="w-4 h-4 text-wa-green border-gray-300 rounded focus:ring-wa-green"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-500">
                        Remember me for 30 days
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-wa-green hover:bg-green-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-green-500/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <>Sign In <ArrowRight size={18} /></>}
                </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-wa-green hover:text-green-700 transition-colors">
                    Create free account
                </Link>
            </div>
        </div>
    );
};
