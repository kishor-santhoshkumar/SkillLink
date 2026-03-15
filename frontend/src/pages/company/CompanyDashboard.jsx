import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, FileText, Download, Star, Mail } from 'lucide-react';

const CompanyDashboard = () => {
  const navigate = useNavigate();

  const dashboardActions = [
    {
      title: 'Explore Workers',
      emoji: '👥',
      icon: Users,
      description: 'Find skilled workers',
      path: '/company/search',
      color: 'from-blue-500 to-blue-700'
    },
    {
      title: 'Post Job Opening',
      emoji: '📢',
      icon: Briefcase,
      description: 'Hire workers quickly',
      path: '/company/jobs',
      color: 'from-green-500 to-green-700'
    },
    {
      title: 'View Applications',
      emoji: '📥',
      icon: FileText,
      description: 'See who applied',
      path: '/company/jobs',
      color: 'from-purple-500 to-purple-700'
    },
    {
      title: 'Download Resumes',
      emoji: '📄',
      icon: Download,
      description: 'Get worker profiles',
      path: '/company/search',
      color: 'from-red-500 to-red-700'
    },
    {
      title: 'Rate Workers',
      emoji: '⭐',
      icon: Star,
      description: 'Give feedback',
      path: '/company/search',
      color: 'from-yellow-500 to-yellow-700'
    },
    {
      title: 'Email Notifications',
      emoji: '📧',
      icon: Mail,
      description: 'Get updates',
      path: '/company/jobs',
      color: 'from-indigo-500 to-indigo-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Company Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Manage your hiring process
          </p>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {dashboardActions.map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.path)}
              className="dashboard-card group"
            >
              {/* Emoji Icon */}
              <div className="emoji-icon-large mb-4 group-hover:scale-110 transition-transform duration-300">
                {action.emoji}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {action.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 font-medium">
                {action.description}
              </p>

              {/* Hover Arrow */}
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-blue-600 font-bold text-xl">→</span>
              </div>
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Quick Actions
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Create Profile */}
            <button
              onClick={() => navigate('/company/profile')}
              className="feature-card group"
            >
              <div className="emoji-icon mb-4 group-hover:scale-110 transition-transform">
                🏢
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Create Profile
              </h3>
              <p className="text-gray-600 text-sm">
                Set up company details
              </p>
            </button>

            {/* Search Workers */}
            <button
              onClick={() => navigate('/company/search')}
              className="feature-card group"
            >
              <div className="emoji-icon mb-4 group-hover:scale-110 transition-transform">
                🔎
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Search for Workers
              </h3>
              <p className="text-gray-600 text-sm">
                Find the right talent
              </p>
            </button>

            {/* Hire */}
            <button
              onClick={() => navigate('/company/jobs')}
              className="feature-card group"
            >
              <div className="emoji-icon mb-4 group-hover:scale-110 transition-transform">
                ✅
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Hire Them
              </h3>
              <p className="text-gray-600 text-sm">
                Accept applications
              </p>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="stat-card-large">
            <div className="text-4xl mb-2">📢</div>
            <div className="text-3xl font-bold text-blue-600">0</div>
            <div className="text-sm text-gray-600">Active Jobs</div>
          </div>
          <div className="stat-card-large">
            <div className="text-4xl mb-2">📥</div>
            <div className="text-3xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-600">Applications</div>
          </div>
          <div className="stat-card-large">
            <div className="text-4xl mb-2">👥</div>
            <div className="text-3xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-600">Workers Hired</div>
          </div>
          <div className="stat-card-large">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-3xl font-bold text-yellow-600">0.0</div>
            <div className="text-sm text-gray-600">Company Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
