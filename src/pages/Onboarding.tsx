import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Building, Smartphone, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const steps = [
    { id: 1, name: 'Account', icon: CheckCircle },
    { id: 2, name: 'Business Info', icon: Building },
    { id: 3, name: 'WhatsApp', icon: Smartphone },
    { id: 4, name: 'Finish', icon: Check },
];

export const Onboarding = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Step 2 Data
    const [businessData, setBusinessData] = useState({
        category: '',
        country: 'US',
        timezone: 'UTC'
    });

    // Step 3 Data
    const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected'>('idle');

    useEffect(() => {
        // User already created, auto-complete step 1
        if (currentStep === 1) {
            const timer = setTimeout(() => setCurrentStep(2), 1000);
            return () => clearTimeout(timer);
        }
    }, [currentStep]);

    const handleBusinessSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/onboarding/business', businessData);
            setCurrentStep(3);
        } catch (error) {
            console.error('Failed to save business info', error);
        } finally {
            setIsLoading(false);
        }
    };

    const connectWhatsApp = async () => {
        setConnectionStatus('connecting');
        // Simulate API call for QR generation / check
        setTimeout(() => {
            setConnectionStatus('connected');
        }, 2000);
    };

    const finishOnboarding = async () => {
        setIsLoading(true);
        try {
            // Finalize on backend
            await api.post('/onboarding/finish');
            if (user) {
                updateUser({ ...user, onboarding_completed: true });
            }
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F4F8] flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-2xl">
                {/* Stepper */}
                <div className="mb-10">
                    <div className="flex justify-between relative">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 -z-10 rounded-full"></div>
                        <div
                            className="absolute top-1/2 left-0 h-1 bg-wa-green -translate-y-1/2 -z-10 rounded-full transition-all duration-500"
                            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                        ></div>

                        {steps.map((step) => {
                            const isCompleted = step.id < currentStep;
                            const isCurrent = step.id === currentStep;

                            return (
                                <div key={step.id} className="flex flex-col items-center gap-2 bg-[#F0F4F8] px-2">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isCompleted ? 'bg-wa-green border-wa-green text-white' :
                                                isCurrent ? 'bg-white border-wa-green text-wa-green shadow-lg shadow-green-500/20' :
                                                    'bg-white border-gray-300 text-gray-400'
                                            }`}
                                    >
                                        <step.icon size={isCurrent ? 20 : 18} />
                                    </div>
                                    <span className={`text-xs font-semibold transition-colors ${isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>{step.name}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-gray-100 p-8 min-h-[400px] flex flex-col">
                    <AnimatePresence mode='wait'>
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                className="flex-1 flex flex-col items-center justify-center text-center"
                            >
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle size={40} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Account Created!</h2>
                                <p className="text-gray-500 mt-2">Setting up your workspace...</p>
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="flex-1"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Tell us about your business</h2>
                                <form onSubmit={handleBusinessSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Category</label>
                                        <select
                                            required
                                            value={businessData.category}
                                            onChange={(e) => setBusinessData({ ...businessData, category: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-wa-green focus:border-transparent outline-none bg-white"
                                        >
                                            <option value="">Select a category</option>
                                            <option value="retail">Retail & E-commerce</option>
                                            <option value="software">Software & IT</option>
                                            <option value="finance">Finance</option>
                                            <option value="health">Healthcare</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                        <select
                                            required
                                            value={businessData.country}
                                            onChange={(e) => setBusinessData({ ...businessData, country: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-wa-green focus:border-transparent outline-none bg-white"
                                        >
                                            <option value="US">United States</option>
                                            <option value="IN">India</option>
                                            <option value="UK">United Kingdom</option>
                                            <option value="AE">UAE</option>
                                        </select>
                                    </div>
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-wa-green text-white py-3 rounded-xl font-bold shadow-lg shadow-green-500/20 hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                                        >
                                            {isLoading ? <Loader2 className="animate-spin" /> : <>Continue <ArrowRight size={18} /></>}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="flex-1 flex flex-col"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect WhatsApp</h2>
                                <p className="text-gray-500 mb-8">Scan the QR code to link your business number.</p>

                                <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-8">
                                    {connectionStatus === 'idle' && (
                                        <div className="text-center">
                                            <Smartphone size={48} className="mx-auto text-gray-300 mb-4" />
                                            <button
                                                onClick={connectWhatsApp}
                                                className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-black transition-colors"
                                            >
                                                Generate QR Code
                                            </button>
                                        </div>
                                    )}
                                    {connectionStatus === 'connecting' && (
                                        <div className="text-center">
                                            <Loader2 size={48} className="mx-auto text-wa-green animate-spin mb-4" />
                                            <p className="font-medium text-gray-700">Waiting for connection...</p>
                                            <p className="text-xs text-gray-400 mt-2">Open WhatsApp {'>'} Linked Devices {'>'} Link a Device</p>
                                        </div>
                                    )}
                                    {connectionStatus === 'connected' && (
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Check size={32} />
                                            </div>
                                            <p className="font-bold text-gray-900">Successfully Connected!</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <button
                                        onClick={() => setCurrentStep(4)}
                                        disabled={connectionStatus !== 'connected'}
                                        className="bg-wa-green text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-500/20 hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Continue
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                className="flex-1 flex flex-col items-center justify-center text-center"
                            >
                                <div className="mb-6 relative">
                                    <div className="absolute inset-0 bg-green-500 blur-xl opacity-20 rounded-full"></div>
                                    <div className="w-24 h-24 bg-gradient-to-tr from-wa-green to-emerald-400 text-white rounded-full flex items-center justify-center shadow-2xl relative z-10">
                                        <Check size={48} />
                                    </div>
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-3">You're all set!</h2>
                                <p className="text-gray-500 max-w-sm mx-auto mb-8">Your dashboard is ready. Start creating your first marketing campaign today.</p>

                                <button
                                    onClick={finishOnboarding}
                                    disabled={isLoading}
                                    className="w-full max-w-xs bg-gray-900 text-white py-3.5 rounded-xl font-bold shadow-xl hover:bg-black transition-all transform hover:scale-105"
                                >
                                    {isLoading ? <Loader2 className="animate-spin mx-auto" /> : "Go to Dashboard"}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
