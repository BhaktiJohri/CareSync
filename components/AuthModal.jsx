import React, { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, AlertCircle } from 'lucide-react';
import Logo from './Logo.jsx';

/**
 * Authentication Modal Component
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {() => void} props.onClose - Callback to close modal
 * @param {(user: any) => void} props.onLogin - Callback when user logs in successfully
 */
const AuthModal = ({ isOpen, onClose, onLogin }) => {
    const [mode, setMode] = useState('login'); // 'login' or 'signup'
    const [userType, setUserType] = useState('patient'); // 'patient', 'caregiver', 'doctor'
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        phone: '',
        age: '',
        patientId: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Basic validation
        if (!formData.email || !formData.password) {
            setError('Email and password are required');
            setLoading(false);
            return;
        }

        if (mode === 'signup' && !formData.name) {
            setError('Name is required');
            setLoading(false);
            return;
        }

        // Simulate API call
        setTimeout(() => {
            const user = {
                email: formData.email,
                name: formData.name || formData.email.split('@')[0],
                userType: userType,
                id: `user-${Date.now()}`
            };

            // Store in localStorage
            localStorage.setItem('caresync_user', JSON.stringify(user));

            setLoading(false);
            onLogin(user);
        }, 1000);
    };

    const handleGoogleLogin = () => {
        setLoading(true);
        // Simulate Google OAuth
        setTimeout(() => {
            const user = {
                email: 'user@gmail.com',
                name: 'Google User',
                userType: userType,
                id: `user-${Date.now()}`,
                authMethod: 'google'
            };
            localStorage.setItem('caresync_user', JSON.stringify(user));
            setLoading(false);
            onLogin(user);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden animate-slide-up flex flex-col md:flex-row max-h-[90vh]">

                {/* Left Side - Branding */}
                <div className="hidden md:flex md:w-2/5 bg-gradient-to-br from-teal-500 to-emerald-600 p-12 flex-col justify-between text-white">
                    <div>
                        <div className="bg-white/20 backdrop-blur-md w-fit p-3 rounded-2xl mb-6">
                            <div className="scale-150 origin-left">
                                <Logo />
                            </div>
                        </div>
                        <h2 className="text-4xl font-extrabold mb-4">Welcome to CareSync</h2>
                        <p className="text-xl text-teal-50 leading-relaxed font-medium">
                            Your trusted partner for medication management and elderly care
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-lg">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">✓</div>
                            <span className="font-semibold">AI-Powered Reminders</span>
                        </div>
                        <div className="flex items-center gap-3 text-lg">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">✓</div>
                            <span className="font-semibold">Family Monitoring</span>
                        </div>
                        <div className="flex items-center gap-3 text-lg">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">✓</div>
                            <span className="font-semibold">100% Free & Secure</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="md:w-3/5 p-8 md:p-12 overflow-y-auto">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="text-3xl font-extrabold text-slate-900 mb-2">
                                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                            </h3>
                            <p className="text-lg text-slate-600 font-medium">
                                {mode === 'login' ? 'Login to access your dashboard' : 'Sign up to get started'}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <X className="w-6 h-6 text-slate-500" />
                        </button>
                    </div>

                    {/* User Type Selection */}
                    <div className="mb-8">
                        <label className="block text-base font-bold text-slate-700 mb-3">I am a:</label>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                type="button"
                                onClick={() => setUserType('patient')}
                                className={`p-4 rounded-xl border-2 text-base font-bold transition-all ${userType === 'patient'
                                    ? 'bg-teal-50 border-teal-500 text-teal-700'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                    }`}
                            >
                                Patient
                            </button>
                            <button
                                type="button"
                                onClick={() => setUserType('caregiver')}
                                className={`p-4 rounded-xl border-2 text-base font-bold transition-all ${userType === 'caregiver'
                                    ? 'bg-teal-50 border-teal-500 text-teal-700'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                    }`}
                            >
                                Caregiver
                            </button>
                            <button
                                type="button"
                                onClick={() => setUserType('doctor')}
                                className={`p-4 rounded-xl border-2 text-base font-bold transition-all ${userType === 'doctor'
                                    ? 'bg-teal-50 border-teal-500 text-teal-700'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                    }`}
                            >
                                Doctor
                            </button>
                        </div>
                    </div>

                    {/* Google Sign In */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full mb-6 p-4 bg-white border-2 border-slate-300 rounded-xl text-slate-700 font-bold text-lg hover:bg-slate-50 hover:border-slate-400 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-300"></div>
                        </div>
                        <div className="relative flex justify-center text-base">
                            <span className="px-4 bg-white text-slate-500 font-semibold">Or continue with email</span>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {mode === 'signup' && (
                            <div>
                                <label className="block text-base font-bold text-slate-700 mb-2">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        placeholder="Enter your full name"
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-lg font-semibold focus:border-teal-500 focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-base font-bold text-slate-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    placeholder="your.email@example.com"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-lg font-semibold focus:border-teal-500 focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {mode === 'signup' && userType !== 'doctor' && (
                            <div>
                                <label className="block text-base font-bold text-slate-700 mb-2">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                        placeholder="(123) 456-7890"
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-lg font-semibold focus:border-teal-500 focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>
                        )}

                        {mode === 'signup' && userType === 'patient' && (
                            <div>
                                <label className="block text-base font-bold text-slate-700 mb-2">Age</label>
                                <input
                                    type="number"
                                    value={formData.age}
                                    onChange={(e) => handleChange('age', e.target.value)}
                                    placeholder="Your age"
                                    className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-lg font-semibold focus:border-teal-500 focus:outline-none transition-colors"
                                />
                            </div>
                        )}

                        {mode === 'signup' && userType === 'caregiver' && (
                            <div>
                                <label className="block text-base font-bold text-slate-700 mb-2">Patient ID (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.patientId}
                                    onChange={(e) => handleChange('patientId', e.target.value)}
                                    placeholder="Enter patient ID to connect"
                                    className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-lg font-semibold focus:border-teal-500 focus:outline-none transition-colors"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-base font-bold text-slate-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-lg font-semibold focus:border-teal-500 focus:outline-none transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl">
                                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                                <p className="text-base font-semibold text-red-700">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-xl font-bold rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    {mode === 'login' ? 'Login' : 'Create Account'}
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Toggle Mode */}
                    <div className="mt-6 text-center">
                        <p className="text-lg text-slate-600">
                            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => {
                                    setMode(mode === 'login' ? 'signup' : 'login');
                                    setError('');
                                }}
                                className="text-teal-600 font-bold hover:text-teal-700 transition-colors"
                            >
                                {mode === 'login' ? 'Sign Up' : 'Login'}
                            </button>
                        </p>
                    </div>

                    {mode === 'login' && (
                        <div className="mt-4 text-center">
                            <button className="text-base text-teal-600 font-bold hover:text-teal-700 transition-colors">
                                Forgot Password?
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
