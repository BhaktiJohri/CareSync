import React, { useState, useEffect } from 'react';
import { Heart, Shield, Clock, Users, ChevronRight, CheckCircle, Phone, Mail, ArrowRight } from 'lucide-react';
import Logo from './Logo.jsx';

/**
 * Landing Page Component - First page users see before login
 * @param {Object} props
 * @param {() => void} props.onLoginClick - Callback when login is clicked
 */
const LandingPage = ({ onLoginClick }) => {
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['home', 'features', 'about', 'contact'];
            const scrollPosition = window.scrollY + 200;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (sectionId) => {
        setActiveSection(sectionId);
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
            {/* Navigation Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center cursor-pointer" onClick={() => scrollToSection('home')}>
                            <Logo />
                        </div>

                        <nav className="hidden md:flex items-center gap-2">
                            {['home', 'features', 'about', 'contact'].map((section) => (
                                <button
                                    key={section}
                                    onClick={() => scrollToSection(section)}
                                    className={`relative px-6 py-2 text-lg font-semibold transition-all duration-300 ${activeSection === section
                                        ? 'text-teal-600'
                                        : 'text-slate-700 hover:text-teal-600'
                                        }`}
                                >
                                    <span className="relative z-10 capitalize">{section}</span>
                                    {activeSection === section && (
                                        <span className="absolute inset-0 bg-teal-50 rounded-xl animate-[slideIn_0.3s_ease-out]"></span>
                                    )}
                                </button>
                            ))}
                        </nav>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={onLoginClick}
                                className="px-8 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-lg font-bold rounded-2xl hover:shadow-xl hover:scale-105 transition-all"
                            >
                                Login / Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section id="home" className="pt-32 pb-20 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-8 animate-[slideInLeft_1.2s_cubic-bezier(0.16,1,0.3,1)]">
                            <h1 className="text-6xl lg:text-7xl font-extrabold text-slate-900 leading-tight">
                                Never Miss a
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600 bg-[length:200%_auto] animate-[shimmer_2s_linear_infinite]">
                                    Medication
                                </span>
                            </h1>

                            <p className="text-2xl text-slate-600 leading-relaxed font-medium">
                                The smart medication management system designed for elderly care.
                                Track medications, monitor health vitals, and stay connected with caregivers.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={onLoginClick}
                                    className="px-10 py-5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-xl font-bold rounded-2xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3"
                                >
                                    Get Started Free
                                    <ArrowRight className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={() => scrollToSection('features')}
                                    className="px-10 py-5 bg-white border-2 border-slate-300 text-slate-800 text-xl font-bold rounded-2xl hover:bg-slate-50 hover:border-teal-500 transition-all"
                                >
                                    Learn More
                                </button>
                            </div>

                            <div className="flex items-center gap-8 pt-4">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-7 h-7 text-teal-500" />
                                    <span className="text-lg font-semibold text-slate-700">100% Free</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-7 h-7 text-teal-500" />
                                    <span className="text-lg font-semibold text-slate-700">Easy to Use</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-7 h-7 text-teal-500" />
                                    <span className="text-lg font-semibold text-slate-700">24/7 Support</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="relative animate-[slideInRight_1.2s_cubic-bezier(0.16,1,0.3,1)_0.3s_both]">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-teal-100 to-blue-100 p-8 hover:scale-110 transition-all duration-500">
                                <div className="bg-white rounded-2xl p-8 space-y-6">
                                    <div className="flex items-center gap-4 p-5 bg-teal-50 rounded-xl border-l-4 border-teal-500 animate-[slideInRight_1s_cubic-bezier(0.34,1.56,0.64,1)_0.5s_both] hover:translate-x-4 transition-transform cursor-pointer">
                                        <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center animate-[bigBounce_2s_ease-in-out_infinite]">
                                            <Heart className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-500">MORNING DOSE</p>
                                            <p className="text-xl font-bold text-slate-900">Aspirin 75mg</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-5 bg-blue-50 rounded-xl border-l-4 border-blue-500 animate-[slideInRight_0.6s_ease-out_0.7s_both] hover:translate-x-2 transition-transform">
                                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center animate-[bounce_2s_ease-in-out_0.5s_infinite]">
                                            <Clock className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-500">AFTERNOON DOSE</p>
                                            <p className="text-xl font-bold text-slate-900">Metformin 500mg</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-5 bg-emerald-50 rounded-xl border-l-4 border-emerald-500 animate-[slideInRight_0.6s_ease-out_0.9s_both] hover:translate-x-2 transition-transform">
                                        <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center animate-[bounce_2s_ease-in-out_1s_infinite]">
                                            <Shield className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-500">EVENING DOSE</p>
                                            <p className="text-xl font-bold text-slate-900">Vitamin D 1000IU</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute -top-6 -right-6 w-32 h-32 bg-teal-200 rounded-full blur-3xl opacity-50 animate-[pulse_4s_ease-in-out_infinite]"></div>
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-50 animate-[pulse_4s_ease-in-out_1s_infinite]"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 px-6 lg:px-8 bg-white relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-teal-200 rounded-full blur-3xl opacity-20 animate-[float_6s_ease-in-out_infinite]"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20 animate-[float_8s_ease-in-out_2s_infinite]"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16 animate-[slideInLeft_1s_cubic-bezier(0.16,1,0.3,1)]">
                        <h2 className="text-5xl font-extrabold text-slate-900 mb-6 animate-[bigBounce_2s_ease-in-out_infinite]">
                            Powerful Features for Better Care
                        </h2>
                        <p className="text-2xl text-slate-600 max-w-3xl mx-auto font-medium">
                            Everything you need to manage medications and health monitoring in one simple app
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="group bg-gradient-to-br from-teal-50 to-white p-8 rounded-3xl border-2 border-teal-100 hover:border-teal-400 hover:shadow-2xl hover:scale-110 hover:-translate-y-4 transition-all duration-500 animate-[fadeInUp_0.8s_cubic-bezier(0.34,1.56,0.64,1)_0.2s_both] cursor-pointer">
                            <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-[360deg] group-hover:scale-125 transition-all duration-700 shadow-lg animate-[bigBounce_3s_ease-in-out_infinite]">
                                <Clock className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-teal-600 transition-colors">Smart Reminders</h3>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                Never miss a dose with intelligent medication reminders. Large, clear notifications designed for easy visibility.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group bg-gradient-to-br from-blue-50 to-white p-8 rounded-3xl border-2 border-blue-100 hover:border-blue-400 hover:shadow-2xl hover:scale-110 hover:-translate-y-4 transition-all duration-500 animate-[fadeInUp_0.8s_cubic-bezier(0.34,1.56,0.64,1)_0.4s_both] cursor-pointer">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-[360deg] group-hover:scale-125 transition-all duration-700 shadow-lg animate-[bigBounce_3s_ease-in-out_0.5s_infinite]">
                                <Heart className="w-10 h-10 text-white animate-pulse" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">Health Tracking</h3>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                Monitor blood pressure, blood sugar, and other vital signs. AI-powered insights for better health management.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group bg-gradient-to-br from-emerald-50 to-white p-8 rounded-3xl border-2 border-emerald-100 hover:border-emerald-400 hover:shadow-2xl hover:scale-110 hover:-translate-y-4 transition-all duration-500 animate-[fadeInUp_0.8s_cubic-bezier(0.34,1.56,0.64,1)_0.6s_both] cursor-pointer">
                            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-[360deg] group-hover:scale-125 transition-all duration-700 shadow-lg animate-[bigBounce_3s_ease-in-out_1s_infinite]">
                                <Users className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors">Family Connect</h3>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                Keep family members and caregivers informed. Share reports and get alerts when medications are missed.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="group bg-gradient-to-br from-purple-50 to-white p-8 rounded-3xl border-2 border-purple-100 hover:border-purple-400 hover:shadow-2xl hover:scale-110 hover:-translate-y-4 transition-all duration-500 animate-[fadeInUp_0.8s_cubic-bezier(0.34,1.56,0.64,1)_0.8s_both] cursor-pointer">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-[360deg] group-hover:scale-125 transition-all duration-700 shadow-lg animate-[bigBounce_3s_ease-in-out_1.5s_infinite]">
                                <Shield className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-purple-600 transition-colors">AI Prescription Scanner</h3>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                Simply scan your prescription. Our AI extracts medications, dosages, and schedules automatically.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="group bg-gradient-to-br from-rose-50 to-white p-8 rounded-3xl border-2 border-rose-100 hover:border-rose-400 hover:shadow-2xl hover:scale-110 hover:-translate-y-4 transition-all duration-500 animate-[fadeInUp_0.8s_cubic-bezier(0.34,1.56,0.64,1)_1s_both] cursor-pointer">
                            <div className="w-20 h-20 bg-gradient-to-br from-rose-400 to-rose-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-[360deg] group-hover:scale-125 transition-all duration-700 shadow-lg animate-[bigBounce_3s_ease-in-out_2s_infinite]">
                                <Phone className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-rose-600 transition-colors">Doctor Portal</h3>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                Doctors can view patient history, medication adherence, and vital trends in one dashboard.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="group bg-gradient-to-br from-amber-50 to-white p-8 rounded-3xl border-2 border-amber-100 hover:border-amber-400 hover:shadow-2xl hover:scale-110 hover:-translate-y-4 transition-all duration-500 animate-[fadeInUp_0.8s_cubic-bezier(0.34,1.56,0.64,1)_1.2s_both] cursor-pointer">
                            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-[360deg] group-hover:scale-125 transition-all duration-700 shadow-lg animate-[bigBounce_3s_ease-in-out_2.5s_infinite]">
                                <Mail className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-amber-600 transition-colors">Weekly Reports</h3>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                Automatic health summaries sent to family members and caregivers. Stay informed without effort.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-24 px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-5xl font-extrabold text-slate-900 mb-8">
                                Designed for
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600 animate-[shimmer_3s_ease-in-out_infinite]">
                                    Elderly Care
                                </span>
                            </h2>

                            <div className="space-y-6 text-xl text-slate-700 leading-relaxed">
                                <p className="font-medium">
                                    We know how hard it is when your loved ones live alone. Missing a pill or taking the wrong dose can turn into a serious problem fast. That's why we made everything big, clear, and simple to use.
                                </p>

                                <p className="font-medium">
                                    Whether you're checking in on your parents from across town or a doctor managing multiple patients, you can see what's happening with their medications anytime. No more guessing if they took their evening pills.
                                </p>

                                <p className="font-medium">
                                    We started this because too many families were dealing with preventable health scares. Now thousands of seniors are staying healthier at home, and their families actually sleep better at night.
                                </p>
                            </div>

                            <div className="mt-10 grid grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                                    <p className="text-4xl font-extrabold text-teal-600 mb-2">10K+</p>
                                    <p className="text-lg font-semibold text-slate-600">Active Users</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                                    <p className="text-4xl font-extrabold text-teal-600 mb-2">95%</p>
                                    <p className="text-lg font-semibold text-slate-600">Adherence Rate</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                                    <p className="text-4xl font-extrabold text-teal-600 mb-2">24/7</p>
                                    <p className="text-lg font-semibold text-slate-600">Support Available</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                                    <p className="text-4xl font-extrabold text-teal-600 mb-2">100%</p>
                                    <p className="text-lg font-semibold text-slate-600">Free to Use</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-gradient-to-br from-teal-100 to-blue-100 rounded-3xl p-8 shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&h=800&fit=crop"
                                    alt="Elderly person with caregiver"
                                    className="rounded-2xl shadow-xl w-full h-auto object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        const parent = e.currentTarget.parentElement;
                                        if (parent) {
                                            parent.innerHTML = '<div class="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-20 flex items-center justify-center"><div class="text-white text-center"><div class="text-6xl mb-4">💊</div><p class="text-2xl font-bold">CareSync</p><p class="text-lg">Medication Management</p></div></div>';
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 lg:px-8 bg-gradient-to-r from-teal-500 to-emerald-600 overflow-hidden">
                <div className="max-w-5xl mx-auto text-center relative">
                    <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                    <h2 className="text-5xl font-extrabold text-white mb-6 relative z-10 animate-[fadeIn_0.8s_ease-out]">
                        Ready to Get Started?
                    </h2>
                    <p className="text-2xl text-teal-50 mb-10 font-medium relative z-10 animate-[fadeIn_1s_ease-out_0.2s_both]">
                        Join thousands of families already using CareSync for better medication management
                    </p>
                    <button
                        onClick={onLoginClick}
                        className="px-12 py-5 bg-white text-teal-600 text-xl font-bold rounded-2xl hover:bg-slate-50 hover:shadow-2xl hover:scale-110 transition-all inline-flex items-center gap-3 relative z-10 animate-[fadeInUp_0.8s_ease-out_0.4s_both]"
                    >
                        Create Free Account
                        <ChevronRight className="w-6 h-6 animate-[slideInRight_1s_ease-in-out_infinite]" />
                    </button>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-24 px-6 lg:px-8 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-5xl font-extrabold text-slate-900 mb-6">
                        Get in Touch
                    </h2>
                    <p className="text-2xl text-slate-600 mb-12 font-medium animate-[fadeIn_1s_ease-out_0.2s_both]">
                        Have questions? We're here to help 24/7
                    </p>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 bg-slate-50 rounded-2xl hover:bg-teal-50 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 animate-[fadeInUp_0.6s_ease-out_0.4s_both] group">
                            <Phone className="w-12 h-12 text-teal-500 mx-auto mb-4 group-hover:scale-125 transition-transform duration-300" />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Call Us</h3>
                            <p className="text-lg text-slate-600">1-800-CARE-SYNC</p>
                        </div>

                        <div className="p-8 bg-slate-50 rounded-2xl hover:bg-teal-50 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 animate-[fadeInUp_0.6s_ease-out_0.6s_both] group">
                            <Mail className="w-12 h-12 text-teal-500 mx-auto mb-4 group-hover:scale-125 transition-transform duration-300" />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Email Us</h3>
                            <p className="text-lg text-slate-600">support@caresync.app</p>
                        </div>

                        <div className="p-8 bg-slate-50 rounded-2xl hover:bg-teal-50 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 animate-[fadeInUp_0.6s_ease-out_0.8s_both] group">
                            <Users className="w-12 h-12 text-teal-500 mx-auto mb-4 group-hover:scale-125 transition-transform duration-300" />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Live Chat</h3>
                            <p className="text-lg text-slate-600">Available 24/7</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 lg:px-8 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-lg">
                                <Logo />
                            </div>
                            <span className="text-xl font-bold">© 2025 CareSync. All rights reserved.</span>
                        </div>

                        <div className="flex gap-8 text-lg">
                            <button className="hover:text-teal-400 transition-colors font-semibold">Privacy Policy</button>
                            <button className="hover:text-teal-400 transition-colors font-semibold">Terms of Service</button>
                            <button className="hover:text-teal-400 transition-colors font-semibold">Support</button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
