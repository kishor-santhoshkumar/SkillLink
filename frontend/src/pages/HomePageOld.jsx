import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Users, 
  Building2, 
  CheckCircle, 
  Shield, 
  ArrowRight,
  Zap,
  Target,
  Award,
  Briefcase,
  Wrench
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRole } from '../context/RoleContext';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal';

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { role, switchRole } = useRole();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Show login modal if redirected from protected route
  useEffect(() => {
    if (location.state?.showLogin && !isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [location, isAuthenticated]);

  const switchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const switchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const handleRoleSelect = (selectedRole) => {
    switchRole(selectedRole);
    // If authenticated, redirect to appropriate dashboard
    if (isAuthenticated) {
      if (selectedRole === 'company') {
        navigate('/company/dashboard');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <>
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={switchToRegister}
      />
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={switchToLogin}
      />
      <div className="min-h-screen">
      
      {/* Role Selection Banner - Only show if not authenticated */}
      {!isAuthenticated && (
        <section className="bg-gradient-to-r from-[#1F3A5F] to-[#2563EB] py-6 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-4">
              <p className="text-white text-sm font-medium mb-2">I am a:</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {/* Worker Card */}
              <button
                onClick={() => handleRoleSelect('worker')}
                className={`group relative overflow-hidden rounded-xl p-6 transition-all duration-300 transform hover:scale-105 ${
                  role === 'worker'
                    ? 'bg-white shadow-xl ring-4 ring-white ring-opacity-50'
                    : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center transition-colors ${
                    role === 'worker' ? 'bg-[#2563EB]' : 'bg-white/20'
                  }`}>
                    <Wrench className={`w-8 h-8 ${role === 'worker' ? 'text-white' : 'text-white/80'}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className={`text-xl font-bold mb-1 ${
                      role === 'worker' ? 'text-[#1F3A5F]' : 'text-white'
                    }`}>
                      Skilled Worker
                    </h3>
                    <p className={`text-sm ${
                      role === 'worker' ? 'text-slate-600' : 'text-white/80'
                    }`}>
                      Create profile & find jobs
                    </p>
                  </div>
                  {role === 'worker' && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle className="w-6 h-6 text-green-500 fill-green-500" />
                    </div>
                  )}
                </div>
              </button>

              {/* Company Card */}
              <button
                onClick={() => handleRoleSelect('company')}
                className={`group relative overflow-hidden rounded-xl p-6 transition-all duration-300 transform hover:scale-105 ${
                  role === 'company'
                    ? 'bg-white shadow-xl ring-4 ring-white ring-opacity-50'
                    : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center transition-colors ${
                    role === 'company' ? 'bg-[#2563EB]' : 'bg-white/20'
                  }`}>
                    <Building2 className={`w-8 h-8 ${role === 'company' ? 'text-white' : 'text-white/80'}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className={`text-xl font-bold mb-1 ${
                      role === 'company' ? 'text-[#1F3A5F]' : 'text-white'
                    }`}>
                      Company
                    </h3>
                    <p className={`text-sm ${
                      role === 'company' ? 'text-slate-600' : 'text-white/80'
                    }`}>
                      Find & hire workers
                    </p>
                  </div>
                  {role === 'company' && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle className="w-6 h-6 text-green-500 fill-green-500" />
                    </div>
                  )}
                </div>
              </button>
            </div>
            <div className="text-center mt-4">
              <p className="text-white/80 text-sm">
                Select your role to see relevant features
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-indigo-50 py-24 px-4 sm:px-6 lg:px-8">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #1F3A5F 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-2 h-2 bg-[#2563EB] rounded-full opacity-40 animate-float"></div>
          <div className="absolute top-40 right-20 w-3 h-3 bg-[#3B82F6] rounded-full opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-[#1F3A5F] rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-[#2563EB] rounded-full opacity-25 animate-float" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in">
          {/* Logo/Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1F3A5F] mb-6 tracking-tight">
            SkillLink
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-[#2563EB] font-semibold mb-4">
            AI-Powered Skilled Worker Hiring Platform
          </p>

          {/* Mission Statement */}
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Connecting skilled workers from rural and urban communities with trusted companies and employers.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Link
              to="/paragraph"
              className="premium-button premium-button-primary px-12 py-5 text-lg flex items-center gap-3 group"
            >
              <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              Create Profile
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why SkillLink Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F3A5F] mb-4">
              Why SkillLink?
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-[#2563EB] to-[#1F3A5F] mx-auto rounded-full shadow-sm"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Zap,
                title: 'Easy Profile Creation',
                description: 'Create your professional profile in minutes with AI assistance'
              },
              {
                icon: Sparkles,
                title: 'AI-Powered Extraction',
                description: 'Smart technology extracts your skills and experience automatically'
              },
              {
                icon: Users,
                title: 'Rural-Friendly Platform',
                description: 'Designed for workers from all backgrounds and literacy levels'
              },
              {
                icon: Target,
                title: 'Direct Hiring Support',
                description: 'Connect directly with employers looking for your skills'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="premium-card p-6 group animate-fade-in-stagger"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#2563EB] to-[#1F3A5F] rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#1F3A5F] mb-2 group-hover:text-[#2563EB] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Workers Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1F3A5F] mb-4">
                For Workers
              </h2>
              <div className="w-24 h-1 bg-[#2563EB] mb-6 rounded-full"></div>
              <ul className="space-y-4">
                {[
                  'Build your digital professional profile',
                  'Get hired faster by showcasing your skills',
                  'Show your experience clearly to employers',
                  'Receive verified worker badge',
                  'Access job opportunities directly'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#2563EB] flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-[#1F3A5F] to-[#2563EB] p-8 rounded-2xl shadow-xl">
              <div className="text-white">
                <Users className="w-16 h-16 mb-4 opacity-90" />
                <h3 className="text-2xl font-bold mb-2">Join Thousands of Workers</h3>
                <p className="text-blue-100 mb-6">
                  Already building their careers on SkillLink
                </p>
                <Link
                  to="/paragraph"
                  className="inline-block px-6 py-3 bg-white text-[#1F3A5F] rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300"
                >
                  Get Started Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Companies Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 bg-gradient-to-br from-[#2563EB] to-[#1F3A5F] p-8 rounded-2xl shadow-xl">
              <div className="text-white">
                <Building2 className="w-16 h-16 mb-4 opacity-90" />
                <h3 className="text-2xl font-bold mb-2">Trusted by Companies</h3>
                <p className="text-blue-100 mb-6">
                  Find the right skilled workers for your projects
                </p>
                <button className="px-6 py-3 bg-white text-[#1F3A5F] rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1F3A5F] mb-4">
                For Companies
              </h2>
              <div className="w-24 h-1 bg-[#2563EB] mb-6 rounded-full"></div>
              <ul className="space-y-4">
                {[
                  'Find verified skilled workers quickly',
                  'View detailed skill-based profiles',
                  'Direct contact access to workers',
                  'See ratings and reviews from other clients',
                  'Hire with confidence'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#2563EB] flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F3A5F] mb-4">
              How It Works
            </h2>
            <div className="w-24 h-1 bg-[#2563EB] mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Create Profile',
                description: 'Tell us about your skills and experience in your own words'
              },
              {
                step: '2',
                title: 'Get Verified',
                description: 'Complete projects and earn ratings to become a verified worker'
              },
              {
                step: '3',
                title: 'Get Hired',
                description: 'Connect with employers and start working on projects'
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1F3A5F] to-[#2563EB] rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <span className="text-3xl font-bold text-white">{step.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#1F3A5F] mb-3 text-center">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 text-center leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-[#2563EB]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F3A5F] mb-4">
              Trust & Safety
            </h2>
            <div className="w-24 h-1 bg-[#2563EB] mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: 'Profile Verification',
                description: 'Workers earn verified badges through completed projects and ratings'
              },
              {
                icon: CheckCircle,
                title: 'Rating System',
                description: 'Transparent ratings and reviews from real clients'
              },
              {
                icon: Shield,
                title: 'Secure Data Handling',
                description: 'Your information is protected with industry-standard security'
              }
            ].map((item, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl hover:bg-[#F8FAFC] transition-all duration-300"
              >
                <div className="w-16 h-16 bg-[#2563EB] bg-opacity-10 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <item.icon className="w-8 h-8 text-[#2563EB]" />
                </div>
                <h3 className="text-lg font-bold text-[#1F3A5F] mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1F3A5F] to-[#2563EB]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Start Building Your Professional Profile Today
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of skilled workers already on SkillLink
          </p>
          <Link
            to="/paragraph"
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-[#1F3A5F] rounded-xl font-bold text-lg shadow-xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
          >
            <Sparkles className="w-6 h-6" />
            Create Profile Now
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E293B] text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-400">
            © 2024 SkillLink. AI-Powered Skilled Worker Hiring Platform.
          </p>
        </div>
      </footer>
      </div>
    </>
  );
};

export default HomePage;
