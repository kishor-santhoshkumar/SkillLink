import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, Search, CheckCircle, 
  Shield, Target, Users, ArrowRight, Zap, Star
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getMyCompany } from '../../services/api';

const Dashboard = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompany();
  }, []);

  const loadCompany = async () => {
    try {
      const data = await getMyCompany(token);
      setCompany(data);
    } catch (error) {
      console.error('Error loading company:', error);
      if (error.response?.status === 404) {
        setCompany(null);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: Users,
      title: 'Easy Profile Creation',
      description: 'Create your company profile to start searching for skilled workers.'
    },
    {
      icon: Zap,
      title: 'AI-Powered Extraction',
      description: 'Smart technology extracts and matches worker skills automatically.'
    },
    {
      icon: Shield,
      title: 'Rural-Friendly Platform',
      description: 'Designed for workers from all backgrounds and literacy levels.'
    },
    {
      icon: Target,
      title: 'Direct Hiring Support',
      description: 'Connect directly with employers looking for your skills.'
    }
  ];

  const benefits = [
    'Find verified skilled workers quickly',
    'View detailed skill-based profiles',
    'Direct contact access to workers',
    'See ratings and reviews from other clients',
    'Hire with confidence'
  ];

  const steps = [
    {
      number: '1',
      title: 'Create Profile',
      description: 'Tell us about your skills and experience in your own words.'
    },
    {
      number: '2',
      title: 'Get Verified',
      description: 'Complete projects and earn ratings to become a verified worker.'
    },
    {
      number: '3',
      title: 'Get Hired',
      description: 'Connect with employers and start working on projects.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Company Profile Status */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#1F3A5F] mb-4 text-center">
            Company Dashboard
          </h1>
          <p className="text-lg text-slate-600 mb-8 text-center">
            Find and hire skilled workers for your projects
          </p>

          {/* Company Profile Status Alert */}
          {!company ? (
            <div className="max-w-4xl mx-auto bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-4">
                <Building2 className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-yellow-900 mb-2">
                    Complete Your Company Profile
                  </h3>
                  <p className="text-yellow-700 mb-4">
                    Create your company profile to start searching for skilled workers.
                  </p>
                  <button
                    onClick={() => navigate('/company/profile')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-600 text-white rounded-xl font-semibold hover:bg-yellow-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <Building2 className="w-5 h-5" />
                    Create Company Profile
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md border-2 border-green-200 p-6 mb-6">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-[#1F3A5F] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#1F3A5F] mb-1">{company.company_name}</h2>
                    <p className="text-slate-600 mb-2 text-lg">{company.company_type}</p>
                    <p className="text-sm text-slate-500">📍 {company.location}</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/company/profile')}
                  className="px-5 py-2.5 text-[#2563EB] hover:bg-blue-50 rounded-xl transition-colors font-semibold border-2 border-[#2563EB]"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          )}

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            <button
              onClick={() => navigate('/company/search')}
              className="premium-card p-8 hover:shadow-xl transition-all duration-300 text-left group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#2563EB] to-[#1F3A5F] rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#1F3A5F] mb-2 group-hover:text-[#2563EB] transition-colors">Search Workers</h3>
              <p className="text-slate-600 leading-relaxed">
                Find skilled workers by trade, location, and experience
              </p>
              <div className="mt-4 flex items-center gap-2 text-[#2563EB] font-semibold group-hover:gap-3 transition-all">
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </button>

            <button
              onClick={() => navigate('/company/profile')}
              className="premium-card p-8 hover:shadow-xl transition-all duration-300 text-left group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#1F3A5F] mb-2 group-hover:text-[#2563EB] transition-colors">Company Profile</h3>
              <p className="text-slate-600 leading-relaxed">
                {company ? 'Update your company information' : 'Create your company profile'}
              </p>
              <div className="mt-4 flex items-center gap-2 text-[#2563EB] font-semibold group-hover:gap-3 transition-all">
                <span>{company ? 'Edit Profile' : 'Create Profile'}</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </button>
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
            {features.map((feature, index) => (
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

      {/* For Companies Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Gradient Card */}
            <div className="bg-gradient-to-br from-[#1F3A5F] to-[#2563EB] p-8 rounded-2xl shadow-xl">
              <div className="text-white">
                <Building2 className="w-16 h-16 mb-4 opacity-90" />
                <h3 className="text-2xl font-bold mb-2">Trusted by Companies</h3>
                <p className="text-blue-100 mb-6">
                  Find the right skilled workers for your projects
                </p>
                <button
                  onClick={() => navigate('/company/search')}
                  className="px-6 py-3 bg-white text-[#1F3A5F] rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center gap-2"
                >
                  Explore Workers
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Side - Benefits List */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1F3A5F] mb-4">
                For Companies
              </h2>
              <div className="w-24 h-1 bg-[#2563EB] mb-6 rounded-full"></div>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#2563EB] flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F3A5F] mb-4">
              How It Works
            </h2>
            <div className="w-24 h-1 bg-[#2563EB] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-[#F8FAFC] p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1F3A5F] to-[#2563EB] rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <span className="text-3xl font-bold text-white">{step.number}</span>
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC]">
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
                icon: Star,
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
                className="text-center p-6 rounded-2xl hover:bg-white transition-all duration-300"
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
            Start Hiring Skilled Workers Today
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of companies finding the right talent for their projects
          </p>
          <button
            onClick={() => navigate('/company/profile')}
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-[#1F3A5F] rounded-xl font-bold text-lg shadow-xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
          >
            <Building2 className="w-6 h-6" />
            Create Profile Now
            <ArrowRight className="w-6 h-6" />
          </button>
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
  );
};

export default Dashboard;
