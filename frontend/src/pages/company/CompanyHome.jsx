import { useNavigate } from 'react-router-dom';
import { 
  Building2, Users, Target, Shield, Search, CheckCircle, 
  TrendingUp, MessageSquare, Star, ArrowRight, Briefcase, Zap
} from 'lucide-react';

const CompanyHome = () => {
  const navigate = useNavigate();

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
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1F3A5F] mb-6 tracking-tight">
            SkillLink
          </h1>
          <p className="text-xl sm:text-2xl text-[#2563EB] font-semibold mb-4">
            AI-Powered Skilled Worker Hiring Platform
          </p>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Connecting skilled workers from rural and urban communities with trusted companies and employers.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/company/profile')}
              className="group w-full sm:w-auto px-8 py-4 bg-[#1F3A5F] text-white rounded-xl font-semibold shadow-lg hover:bg-[#152a45] transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Building2 className="w-5 h-5" />
              Create Profile
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/company/search')}
              className="w-full sm:w-auto px-8 py-4 bg-white text-[#1F3A5F] border-2 border-[#1F3A5F] rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              Explore Workers
            </button>
          </div>
        </div>
      </section>

      {/* Why SkillLink Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F3A5F] mb-4">
              Why SkillLink?
            </h2>
            <div className="w-24 h-1 bg-[#2563EB] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-[#F8FAFC] p-6 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-[#2563EB] rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#1F3A5F] mb-2">
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
                  onClick={() => navigate('/company/profile')}
                  className="px-6 py-3 bg-white text-[#1F3A5F] rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300"
                >
                  Learn More
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

export default CompanyHome;
