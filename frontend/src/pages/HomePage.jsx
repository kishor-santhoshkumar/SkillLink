import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Users, 
  Building2, 
  CheckCircle, 
  Shield, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Zap,
  Target,
  Award,
  Briefcase,
  Wrench,
  TrendingUp,
  MapPin,
  Star,
  Mic,
  FileText,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRole } from '../context/RoleContext';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// Profile Options Modal Component
const ProfileOptionsModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleOptionClick = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#2563EB] to-[#1e40af] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#1e40af] mb-2">Create Your Profile</h2>
          <p className="text-gray-600">Choose how you want to create your profile</p>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {/* Option 1: Describe Your Work */}
          <button
            onClick={() => handleOptionClick('/paragraph')}
            className="w-full p-6 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-2xl hover:border-blue-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#2563EB] to-[#1e40af] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Mic className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg font-bold text-[#1e40af] mb-1 group-hover:text-[#2563EB] transition-colors">
                  Describe Your Work
                </h3>
                <p className="text-sm text-gray-600">
                  Write or speak about your skills
                </p>
              </div>
              <ArrowRight className="w-6 h-6 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Option 2: Fill Through Forms */}
          <button
            onClick={() => handleOptionClick('/form')}
            className="w-full p-6 bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-2xl hover:border-green-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg font-bold text-green-700 mb-1 group-hover:text-green-600 transition-colors">
                  Fill Through Forms
                </h3>
                <p className="text-sm text-gray-600">
                  Step-by-step guided form
                </p>
              </div>
              <ArrowRight className="w-6 h-6 text-green-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

// Generic Features Carousel Component
const FeaturesCarousel = ({ features }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const cardsPerPage = 3;
  const totalPages = Math.ceil(features.length / cardsPerPage);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? (totalPages - 1) * cardsPerPage : prev - cardsPerPage));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const nextIndex = prev + cardsPerPage;
      return nextIndex >= features.length ? 0 : nextIndex;
    });
  };

  // Get current page of 3 cards
  const visibleFeatures = features.slice(currentIndex, currentIndex + cardsPerPage);

  // Calculate current page number
  const currentPage = Math.floor(currentIndex / cardsPerPage);

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-14 h-14 bg-gradient-to-r from-[#3b82f6] to-[#1e40af] rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-all duration-300 group"
        aria-label="Previous features"
      >
        <ChevronLeft className="w-8 h-8 text-white" strokeWidth={3} />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-14 h-14 bg-gradient-to-r from-[#3b82f6] to-[#1e40af] rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-all duration-300 group"
        aria-label="Next features"
      >
        <ChevronRight className="w-8 h-8 text-white" strokeWidth={3} />
      </button>

      {/* Cards Container */}
      <div className="overflow-hidden px-16">
        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-500 ease-in-out"
          key={currentIndex}
        >
          {visibleFeatures.map((feature, index) => (
            <div
              key={currentIndex + index}
              className="feature-card bg-white rounded-3xl border-2 border-gray-200 shadow-lg p-8 text-center group hover:-translate-y-2 hover:shadow-2xl hover:border-blue-400 transition-all duration-300 animate-fade-in min-h-[320px]"
            >
              {/* Emoji Icon */}
              <div className="text-8xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.emoji}
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-bold text-[#1e40af] mb-3 group-hover:text-[#3b82f6] transition-colors">
                {feature.title}
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Page Indicators */}
      <div className="flex justify-center gap-3 mt-8">
        {Array.from({ length: totalPages }).map((_, pageIndex) => (
          <button
            key={pageIndex}
            onClick={() => setCurrentIndex(pageIndex * cardsPerPage)}
            className={`transition-all duration-300 rounded-full ${
              pageIndex === currentPage
                ? 'w-10 h-3 bg-[#1e40af]'
                : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to page ${pageIndex + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { role, switchRole } = useRole();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [stats, setStats] = useState({
    totalWorkers: 0,
    totalCompanies: 0,
    publishedWorkers: 0,
    successRate: 95
  });
  const [publishedWorkers, setPublishedWorkers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [currentWorkerIndex, setCurrentWorkerIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showProfileOptionsModal, setShowProfileOptionsModal] = useState(false);
  const [jobOpenings, setJobOpenings] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  useEffect(() => {
    if (location.state?.showLogin && !isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [location, isAuthenticated]);

  useEffect(() => {
    fetchPublishedWorkers();
    fetchCompanies();
    if (isAuthenticated && role === 'worker') {
      fetchJobOpenings();
    }
  }, [isAuthenticated, role]);

  // Auto-rotate workers/companies every 3 seconds
  useEffect(() => {
    const itemsToRotate = isAuthenticated && role === 'worker' ? jobOpenings : companies;
    if (itemsToRotate.length > 1) {
      const interval = setInterval(() => {
        setCurrentWorkerIndex((prev) => (prev + 1) % itemsToRotate.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, role, jobOpenings, companies]);

  const fetchPublishedWorkers = async () => {
    try {
      const response = await fetch(`${API_URL}/workers/`);
      const workers = await response.json();
      
      // Get only published workers
      const published = workers.filter(w => w.is_published);
      setPublishedWorkers(published);
      
      setStats({
        totalWorkers: workers.length,
        totalCompanies: 500,
        publishedWorkers: published.length,
        successRate: 95
      });
    } catch (error) {
      console.error('Error fetching workers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await fetch(`${API_URL}/companies/`);
      const companiesData = await response.json();
      setCompanies(companiesData);
      console.log('Fetched companies:', companiesData);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchJobOpenings = async () => {
    setLoadingJobs(true);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const response = await fetch(`${API_URL}/jobs/`, { headers });
      if (response.ok) {
        const jobs = await response.json();
        console.log('Fetched jobs:', jobs); // Debug log
        setJobOpenings(jobs);
      } else {
        console.error('Failed to fetch jobs:', response.status);
      }
    } catch (error) {
      console.error('Error fetching job openings:', error);
    } finally {
      setLoadingJobs(false);
    }
  };

  const switchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const switchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const handleWorkerClick = (workerId) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    } else {
      // Navigate to worker detail page if authenticated
      navigate(`/company/workers/${workerId}`);
    }
  };

  const handleAIResumeClick = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    // Check if user has a profile
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/resumes/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Profile exists, navigate to profile page
        navigate('/profile');
      } else if (response.status === 404) {
        // No profile, show create profile options
        setShowProfileOptionsModal(true);
      } else {
        // Other error, show create profile options
        setShowProfileOptionsModal(true);
      }
    } catch (error) {
      console.error('Error checking profile:', error);
      // On error, show create profile options
      setShowProfileOptionsModal(true);
    }
  };

  const handleRoleSelect = (selectedRole) => {
    switchRole(selectedRole);
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
      <ProfileOptionsModal
        isOpen={showProfileOptionsModal}
        onClose={() => setShowProfileOptionsModal(false)}
      />
      
      <div className="min-h-screen">
        
        {/* ============================================
            HERO SECTION - TWO COLUMN LAYOUT
            ============================================ */}
        <section className="relative overflow-hidden py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
          {/* Premium Multi-Layer Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"></div>
          
          {/* Animated Gradient Orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          </div>
          
          {/* Sophisticated Grid Pattern */}
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.05) 1.5px, transparent 1.5px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1.5px, transparent 1.5px),
              linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
            backgroundPosition: '-1.5px -1.5px, -1.5px -1.5px, -1px -1px, -1px -1px'
          }}></div>
          
          {/* Diagonal Accent Lines */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-400 to-transparent"></div>
            <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-indigo-400 to-transparent"></div>
          </div>
          
          {/* Floating Geometric Shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-4 h-4 border-2 border-blue-400/30 rotate-45 animate-float"></div>
            <div className="absolute top-40 right-20 w-6 h-6 border-2 border-indigo-400/30 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-blue-500/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/3 right-1/3 w-5 h-5 border-2 border-purple-400/30 animate-float" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rotate-12 animate-float" style={{ animationDelay: '0.5s' }}></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Column - Content */}
              <div className="text-center lg:text-left animate-slide-in-left">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight max-w-2xl mx-auto lg:mx-0" style={{background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>
                  SkillLink
                </h1>
                
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F3A5F] mb-6 max-w-2xl mx-auto lg:mx-0">
                  Hire Skilled Workers Faster
                </h2>
                
                <p className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  AI-powered platform connecting skilled blue-collar workers with trusted companies. 
                  Build your profile in minutes and get hired by top employers.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up">
                  <Link
                    to="/paragraph"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 text-lg rounded-xl font-semibold shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 group"
                  >
                    <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                    Create Profile
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  
                  {role === 'company' ? (
                    <Link
                      to="/company/search"
                      className="bg-white border-2 border-blue-600 text-blue-600 px-8 py-4 text-lg rounded-xl font-semibold hover:bg-blue-50 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 group"
                    >
                      <Users className="w-6 h-6" />
                      Explore Workers
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  ) : (
                    <Link
                      to="/jobs"
                      className="bg-white border-2 border-blue-600 text-blue-600 px-8 py-4 text-lg rounded-xl font-semibold hover:bg-blue-50 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 group"
                    >
                      <Briefcase className="w-6 h-6" />
                      Explore Jobs
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Right Column - Illustration */}
              <div className="relative animate-slide-in-right">
                {/* Background Illustration Layer */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                  {/* Blueprint grid pattern */}
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: 'linear-gradient(rgba(37, 99, 235, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(37, 99, 235, 0.1) 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                  }}></div>
                  
                  {/* Floating Tool Icons */}
                  <div className="absolute top-10 left-10 w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center opacity-40 animate-float">
                    <Wrench className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="absolute top-32 right-8 w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center opacity-30 animate-float" style={{ animationDelay: '0.5s' }}>
                    <Award className="w-7 h-7 text-green-600" />
                  </div>
                  <div className="absolute bottom-24 left-16 w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center opacity-35 animate-float" style={{ animationDelay: '1s' }}>
                    <Briefcase className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="absolute bottom-40 right-20 w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center opacity-30 animate-float" style={{ animationDelay: '1.5s' }}>
                    <Target className="w-7 h-7 text-orange-600" />
                  </div>
                  <div className="absolute top-1/2 left-8 w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center opacity-25 animate-float" style={{ animationDelay: '0.8s' }}>
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                  </div>
                  
                  {/* Large decorative circles */}
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-200 rounded-full opacity-10 blur-3xl"></div>
                  <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-purple-200 rounded-full opacity-10 blur-3xl"></div>
                </div>

                <div className="relative">
                  {/* Main illustration card */}
                  <div className="premium-card p-8 bg-gradient-to-br from-white to-blue-50 backdrop-blur-sm">
                    <div className="space-y-6">
                      {/* Conditional Carousel: Jobs for workers, Workers for others */}
                      {isAuthenticated && role === 'worker' ? (
                        // JOB OPENINGS CAROUSEL FOR WORKERS
                        <>
                          {loadingJobs ? (
                            <div className="flex items-center justify-between gap-4 p-6 bg-white rounded-xl shadow-sm animate-pulse">
                              <div className="flex items-center gap-4 flex-1">
                                <div className="w-16 h-16 bg-slate-200 rounded-full"></div>
                                <div className="flex-1">
                                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                                  <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                                </div>
                              </div>
                            </div>
                          ) : jobOpenings.length > 0 ? (
                            <div className="relative overflow-hidden">
                              <button
                                onClick={() => navigate('/jobs')}
                                className="w-full flex items-center justify-between gap-4 p-6 bg-white rounded-xl shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:bg-blue-50 cursor-pointer group"
                                key={currentWorkerIndex % jobOpenings.length}
                              >
                                {/* Left side - Company icon and job details */}
                                <div className="flex items-center gap-4 flex-1">
                                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-3xl">🏢</span>
                                  </div>
                                  <div className="flex-1 min-w-0 text-left">
                                    <div className="font-bold text-[#1e40af] text-lg truncate group-hover:text-[#2563EB] transition-colors">
                                      {jobOpenings[currentWorkerIndex % jobOpenings.length].client_name}
                                    </div>
                                    <div className="text-sm text-slate-600 truncate">
                                      {jobOpenings[currentWorkerIndex % jobOpenings.length].required_trade}
                                    </div>
                                    <div className="text-xs text-blue-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      Click to view jobs →
                                    </div>
                                  </div>
                                </div>
                              </button>
                              
                              {/* Carousel indicators */}
                              {jobOpenings.length > 1 && (
                                <div className="flex justify-center gap-1.5 mt-3">
                                  {jobOpenings.slice(0, Math.min(jobOpenings.length, 5)).map((_, index) => (
                                    <button
                                      key={index}
                                      onClick={() => setCurrentWorkerIndex(index)}
                                      className={`transition-all duration-300 rounded-full ${
                                        index === (currentWorkerIndex % jobOpenings.length)
                                          ? 'w-6 h-2 bg-[#FF6B35]'
                                          : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                                      }`}
                                      aria-label={`View job ${index + 1}`}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center justify-between gap-4 p-6 bg-white rounded-xl shadow-sm">
                              <div className="flex items-center gap-4 flex-1">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B35] to-[#F7931E] rounded-full flex items-center justify-center">
                                  <span className="text-3xl">🏢</span>
                                </div>
                                <div className="flex-1">
                                  <div className="font-bold text-[#FF6B35] text-lg">No Job Openings Yet</div>
                                  <div className="text-sm text-slate-600">Check back soon!</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        // COMPANY CAROUSEL FOR NON-WORKERS (BEFORE LOGIN)
                        <>
                          {loading ? (
                            <div className="flex items-center justify-between gap-4 p-6 bg-white rounded-xl shadow-sm animate-pulse">
                              <div className="flex items-center gap-4 flex-1">
                                <div className="w-16 h-16 bg-slate-200 rounded-full"></div>
                                <div className="flex-1">
                                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                                  <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                                </div>
                              </div>
                              <div className="w-16 h-16 bg-slate-200 rounded-full"></div>
                            </div>
                          ) : companies.length > 0 ? (
                            <div className="relative overflow-hidden">
                              <button
                                onClick={() => !isAuthenticated && setShowLoginModal(true)}
                                className="w-full flex items-center justify-between gap-4 p-6 bg-white rounded-xl shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:bg-blue-50 cursor-pointer group"
                                key={currentWorkerIndex}
                              >
                                {/* Left side - Company icon and details */}
                                <div className="flex items-center gap-4 flex-1">
                                  <div className="w-16 h-16 bg-gradient-to-br from-[#2563EB] to-[#1e40af] rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-3xl">🏢</span>
                                  </div>
                                  <div className="flex-1 min-w-0 text-left">
                                    <div className="font-bold text-[#1e40af] text-lg truncate group-hover:text-[#2563EB] transition-colors">
                                      {companies[currentWorkerIndex % companies.length].company_name || 'Company'}
                                    </div>
                                    <div className="text-sm text-slate-600 truncate">
                                      {companies[currentWorkerIndex % companies.length].location || 'Location'}
                                    </div>
                                    <div className="text-xs text-blue-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      {isAuthenticated ? 'View company →' : 'Login to view →'}
                                    </div>
                                  </div>
                                </div>
                              </button>
                              
                              {/* Carousel indicators */}
                              {companies.length > 1 && (
                                <div className="flex justify-center gap-1.5 mt-3">
                                  {companies.slice(0, Math.min(companies.length, 5)).map((_, index) => (
                                    <button
                                      key={index}
                                      onClick={() => setCurrentWorkerIndex(index)}
                                      className={`transition-all duration-300 rounded-full ${
                                        index === (currentWorkerIndex % companies.length)
                                          ? 'w-6 h-2 bg-[#1e40af]'
                                          : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                                      }`}
                                      aria-label={`View company ${index + 1}`}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center justify-between gap-4 p-6 bg-white rounded-xl shadow-sm">
                              <div className="flex items-center gap-4 flex-1">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#2563EB] to-[#1e40af] rounded-full flex items-center justify-center">
                                  <span className="text-3xl">🏢</span>
                                </div>
                                <div className="flex-1">
                                  <div className="font-bold text-[#1e40af] text-lg">No Companies Yet</div>
                                  <div className="text-sm text-slate-600">Be the first to join!</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {/* Feature badges */}
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          AI-Powered
                        </span>
                        <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          Verified
                        </span>
                        <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          Fast Hiring
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Floating badge */}
                  <div className="absolute -top-4 -right-4 premium-card p-4 bg-white shadow-xl animate-float">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Success Rate</div>
                        <div className="text-lg font-bold text-[#1e40af]">{stats.successRate}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
            TRUST / SOCIAL PROOF SECTION
            ============================================ */}
        <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Users, emoji: '👷', value: loading ? '...' : `${stats.totalWorkers}+`, label: 'Skilled Workers', color: 'blue' },
                { icon: Building2, emoji: '🏢', value: loading ? '...' : `${stats.totalCompanies}+`, label: 'Companies', color: 'green' },
                { icon: MapPin, emoji: '📍', value: '40+', label: 'Cities Served', color: 'purple' },
                { icon: TrendingUp, emoji: '📈', value: `${stats.successRate}%`, label: 'Hiring Success', color: 'orange' }
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 text-center hover:-translate-y-1 hover:shadow-xl hover:border-blue-300 hover:shadow-blue-200 transition-all duration-300 animate-fade-in-stagger"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-5xl mb-4">{stat.emoji}</div>
                  <div className="text-4xl font-bold text-[#1e40af] mb-2">{stat.value}</div>
                  <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================
            HOW IT WORKS - 3 STEP PROCESS
            ============================================ */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-4xl sm:text-5xl font-bold text-[#1e40af] mb-4">
                How It Works
              </h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-[#3b82f6] to-[#1e40af] mx-auto rounded-full shadow-sm"></div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4">
              {[
                {
                  emoji: '👤',
                  title: 'Create Profile',
                  description: 'Tell us about your skills',
                  clickable: true,
                  onClick: () => setShowProfileOptionsModal(true)
                },
                {
                  emoji: '🤖',
                  title: 'AI Resume Generated',
                  description: 'We build your profile',
                  clickable: true,
                  onClick: handleAIResumeClick
                },
                {
                  emoji: '💼',
                  title: 'Get Hired',
                  description: 'Connect with employers',
                  clickable: true,
                  onClick: () => navigate('/jobs')
                }
              ].map((step, index) => (
                <React.Fragment key={index}>
                  {step.clickable ? (
                    <button
                      onClick={step.onClick}
                      className="step-card bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8 text-center group hover:-translate-y-2 hover:shadow-2xl hover:border-blue-400 transition-all duration-300 animate-scale-in w-full md:w-64 cursor-pointer"
                      style={{ animationDelay: `${index * 0.15}s` }}
                    >
                      {/* Emoji Icon */}
                      <div className="text-7xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {step.emoji}
                      </div>
                      
                      {/* Step Number */}
                      <div className="inline-block px-4 py-1 bg-gradient-to-r from-[#3b82f6] to-[#1e40af] text-white rounded-full text-sm font-bold mb-3">
                        Step {index + 1}
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-xl font-bold text-[#1e40af] mb-2 group-hover:text-[#3b82f6] transition-colors">
                        {step.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-2">
                        {step.description}
                      </p>
                      
                      {/* Click hint */}
                      <p className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        {index === 0 ? 'Click to start →' : index === 1 ? 'Click to view →' : 'Browse jobs →'}
                      </p>
                    </button>
                  ) : (
                    <div
                      className="step-card bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8 text-center group hover:-translate-y-2 hover:shadow-2xl hover:border-blue-400 transition-all duration-300 animate-scale-in w-full md:w-64"
                      style={{ animationDelay: `${index * 0.15}s` }}
                    >
                      {/* Emoji Icon */}
                      <div className="text-7xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {step.emoji}
                      </div>
                      
                      {/* Step Number */}
                      <div className="inline-block px-4 py-1 bg-gradient-to-r from-[#3b82f6] to-[#1e40af] text-white rounded-full text-sm font-bold mb-3">
                        Step {index + 1}
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-xl font-bold text-[#1e40af] mb-2 group-hover:text-[#3b82f6] transition-colors">
                        {step.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-600 text-sm">
                        {step.description}
                      </p>
                    </div>
                  )}
                  
                  {/* Arrow Connector - Only between cards */}
                  {index < 2 && (
                    <div className="hidden md:block text-[#3b82f6] animate-pulse">
                      <ArrowRight className="w-12 h-12" strokeWidth={3} />
                    </div>
                  )}
                  
                  {/* Mobile Arrow - Below card */}
                  {index < 2 && (
                    <div className="md:hidden text-[#3b82f6] rotate-90 my-2">
                      <ArrowRight className="w-10 h-10 mx-auto" strokeWidth={3} />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================
            WORKER DASHBOARD - AFTER LOGIN
            ============================================ */}
        {isAuthenticated && role === 'worker' && (
          <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8 animate-fade-in">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1e40af] mb-3">
                  Worker Dashboard
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[#3b82f6] to-[#1e40af] mx-auto rounded-full"></div>
                <p className="text-base text-slate-600 mt-4">
                  Everything you need in one place
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Create AI Resume Card */}
                <button
                  onClick={() => setShowProfileOptionsModal(true)}
                  className="premium-card p-5 bg-gradient-to-br from-white to-blue-50 hover:from-blue-50 hover:to-blue-100 border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#2563EB] to-[#1e40af] rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-4xl">🤖</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#1e40af] mb-2 group-hover:text-[#2563EB] transition-colors">
                      Create AI Resume
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Build profile in 2 minutes
                    </p>
                  </div>
                </button>

                {/* Apply for Jobs Card */}
                <button
                  onClick={() => navigate('/jobs')}
                  className="premium-card p-5 bg-gradient-to-br from-white to-green-50 hover:from-green-50 hover:to-green-100 border-2 border-green-200 hover:border-green-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-4xl">💼</span>
                    </div>
                    <h3 className="text-lg font-bold text-green-700 mb-2 group-hover:text-green-600 transition-colors">
                      Apply for Jobs
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Find work opportunities
                    </p>
                  </div>
                </button>

                {/* My Profile Card */}
                <button
                  onClick={handleAIResumeClick}
                  className="premium-card p-5 bg-gradient-to-br from-white to-purple-50 hover:from-purple-50 hover:to-purple-100 border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-4xl">👤</span>
                    </div>
                    <h3 className="text-lg font-bold text-purple-700 mb-2 group-hover:text-purple-600 transition-colors">
                      My Profile
                    </h3>
                    <p className="text-slate-600 text-sm">
                      View your details
                    </p>
                  </div>
                </button>

                {/* My Ratings Card */}
                <button
                  onClick={handleAIResumeClick}
                  className="premium-card p-5 bg-gradient-to-br from-white to-yellow-50 hover:from-yellow-50 hover:to-yellow-100 border-2 border-yellow-200 hover:border-yellow-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-4xl">⭐</span>
                    </div>
                    <h3 className="text-lg font-bold text-yellow-700 mb-2 group-hover:text-yellow-600 transition-colors">
                      My Ratings
                    </h3>
                    <p className="text-slate-600 text-sm">
                      View reviews
                    </p>
                  </div>
                </button>

                {/* Download Resume Card */}
                <button
                  onClick={handleAIResumeClick}
                  className="premium-card p-5 bg-gradient-to-br from-white to-red-50 hover:from-red-50 hover:to-red-100 border-2 border-red-200 hover:border-red-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-4xl">📄</span>
                    </div>
                    <h3 className="text-lg font-bold text-red-700 mb-2 group-hover:text-red-600 transition-colors">
                      Download Resume
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Get PDF resume
                    </p>
                  </div>
                </button>

                {/* Notifications Card */}
                <button
                  onClick={() => navigate('/notifications')}
                  className="premium-card p-5 bg-gradient-to-br from-white to-indigo-50 hover:from-indigo-50 hover:to-indigo-100 border-2 border-indigo-200 hover:border-indigo-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-4xl">🔔</span>
                    </div>
                    <h3 className="text-lg font-bold text-indigo-700 mb-2 group-hover:text-indigo-600 transition-colors">
                      Notifications
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Check job updates
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ============================================
            WORKER FEATURES SECTION - CAROUSEL
            ============================================ */}
        <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl sm:text-5xl font-bold text-[#1e40af] mb-4">
                Worker Features
              </h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-[#3b82f6] to-[#1e40af] mx-auto rounded-full shadow-sm"></div>
              <p className="text-lg text-slate-600 mt-6 max-w-2xl mx-auto">
                Everything you need to build your career
              </p>
            </div>

            {/* Carousel Container */}
            <FeaturesCarousel features={[
              {
                emoji: '🤖',
                title: 'AI Resume in 2 Minutes',
                description: 'Create professional profile instantly with AI'
              },
              {
                emoji: '📋',
                title: 'Easy Form Creation',
                description: 'Step-by-step guided profile building'
              },
              {
                emoji: '🎤',
                title: 'Voice Input Support',
                description: 'Speak your skills, we write them down'
              },
              {
                emoji: '🌐',
                title: 'Multi-Language',
                description: 'English, Tamil, Hindi supported'
              },
              {
                emoji: '📄',
                title: '4 Professional Templates',
                description: 'Download resume in multiple styles'
              },
              {
                emoji: '💼',
                title: 'Job Opportunities',
                description: 'Apply to verified company openings'
              },
              {
                emoji: '📢',
                title: 'Profile Visibility',
                description: 'Let companies discover your skills'
              },
              {
                emoji: '📧',
                title: 'Email Notifications',
                description: 'Get instant job confirmation alerts'
              },
              {
                emoji: '⭐',
                title: 'Build Reputation',
                description: 'Earn ratings from satisfied clients'
              },
              {
                emoji: '📱',
                title: 'Mobile Friendly',
                description: 'Access anywhere, anytime on any device'
              },
              {
                emoji: '🔒',
                title: 'Secure Platform',
                description: 'Your data is safe and protected'
              },
              {
                emoji: '🚀',
                title: 'Quick Hiring',
                description: 'Get hired faster with verified profile'
              }
            ]} />
          </div>
        </section>

        {/* ============================================
            COMPANY FEATURES SECTION - CAROUSEL
            ============================================ */}
        {(!isAuthenticated || role !== 'worker') && (
          <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl sm:text-5xl font-bold text-[#1e40af] mb-4">
                Company Features
              </h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-[#3b82f6] to-[#1e40af] mx-auto rounded-full shadow-sm"></div>
              <p className="text-lg text-slate-600 mt-6 max-w-2xl mx-auto">
                Everything you need to find the right workers
              </p>
            </div>

            {/* Carousel Container */}
            <FeaturesCarousel features={[
              {
                emoji: '🔎',
                title: 'Find Skilled Workers',
                description: 'Search verified professionals'
              },
              {
                emoji: '📢',
                title: 'Post Job Openings',
                description: 'Hire workers quickly'
              },
              {
                emoji: '📥',
                title: 'Receive Worker Applications',
                description: 'Get applications instantly'
              },
              {
                emoji: '📄',
                title: 'View AI Generated Resumes',
                description: 'Professional worker profiles'
              },
              {
                emoji: '⬇',
                title: 'Download Worker Resume',
                description: 'Get PDF resumes'
              },
              {
                emoji: '⭐',
                title: 'Rate Workers after Work',
                description: 'Give feedback and ratings'
              },
              {
                emoji: '📧',
                title: 'Email Notification when workers apply',
                description: 'Stay updated on applications'
              }
            ]} />
          </div>
        </section>
        )}

        {/* ============================================
            TRUST & SAFETY SECTION
            ============================================ */}
        <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl sm:text-5xl font-bold text-[#1e40af] mb-4">
                Trust & Safety
              </h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-[#3b82f6] to-[#1e40af] mx-auto rounded-full shadow-sm"></div>
              <p className="text-lg text-slate-600 mt-6 max-w-2xl mx-auto">
                Your security and trust are our top priorities
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  emoji: '🔐',
                  title: 'Verified Worker Profiles',
                  description: 'Workers earn verified badges through completed projects and ratings from real clients'
                },
                {
                  emoji: '⭐',
                  title: 'Rating System',
                  description: 'Transparent ratings and reviews from real clients help you make informed decisions'
                },
                {
                  emoji: '🛡',
                  title: 'Secure Hiring Platform',
                  description: 'Your information is protected with industry-standard security measures'
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8 text-center group hover:-translate-y-2 hover:shadow-2xl hover:border-blue-400 transition-all duration-300 animate-fade-in-stagger"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {/* Emoji Icon */}
                  <div className="text-7xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {item.emoji}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-[#1e40af] mb-3 group-hover:text-[#3b82f6] transition-colors">
                    {item.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default HomePage;

