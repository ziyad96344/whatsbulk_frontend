import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, Building, ArrowRight, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export const Register = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        business_name: '',
        email: '',
        password: '',
        confirm_password: '', // API expects password_confirmation often, mapping manually
        accept_terms: false
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirm_password) {
            setError("Passwords do not match");
            return;
        }

        if (!formData.accept_terms) {
            setError("You must accept the terms and conditions");
            return;
        }

        setIsLoading(true);

        try {
            await api.get('/sanctum/csrf-cookie').catch(() => { });

            const response = await api.post('/register', {
                name: formData.full_name,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.confirm_password,
                business_name: formData.business_name
            });

            const { token, user } = response.data;
            login(token, user);
            navigate('/onboarding');

        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 sm:p-10">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Create an account</h2>
                <p className="text-sm text-gray-500 mt-2">Start your 14-day free trial. No credit card required.</p>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm flex items-start gap-2 border border-red-100">
                    <AlertCircle size={16} className="mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                name="full_name"
                                required
                                value={formData.full_name}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-wa-green focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Business Name</label>
                        <div className="relative">
                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                name="business_name"
                                required
                                value={formData.business_name}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-wa-green focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                                placeholder="Acme Inc."
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-wa-green focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                            placeholder="john@acme.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-wa-green focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                            placeholder="Create a strong password"
                            minLength={8}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="password"
                            name="confirm_password"
                            required
                            value={formData.confirm_password}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-wa-green focus:border-transparent outline-none transition-all bg-gray-50/50 focus:bg-white"
                            placeholder="Repeat password"
                        />
                    </div>
                </div>

                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            id="accept_terms"
                            name="accept_terms"
                            type="checkbox"
                            required
                            checked={formData.accept_terms}
                            onChange={handleChange}
                            className="w-4 h-4 text-wa-green border-gray-300 rounded focus:ring-wa-green"
                        />
                    </div>
                    <label htmlFor="accept_terms" className="ml-2 block text-sm text-gray-500">
                        I agree to the <a href="#" className="font-semibold text-wa-green hover:underline">Terms of Service</a> and <a href="#" className="font-semibold text-wa-green hover:underline">Privacy Policy</a>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-wa-green hover:bg-green-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-green-500/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <>Create Account <ArrowRight size={18} /></>}
                </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-wa-green hover:text-green-700 transition-colors">
                    Sign in
                </Link>
            </div>
        </div>
    );
};
