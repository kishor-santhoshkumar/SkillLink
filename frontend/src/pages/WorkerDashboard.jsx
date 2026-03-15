import { useNavigate } from 'react-router-dom';
import { FileText, Briefcase, User, Star, Download, Mic, FileEdit } from 'lucide-react';

const WorkerDashboard = () => {
  const navigate = useNavigate();

  const dashboardActions = [
    {
      title: 'Create AI Resume',
      emoji: '🤖',
      icon: FileText,
      description: 'Build profile in 2 minutes',
      path: '/paragraph',
      color: 'from-blue-500 to-blue-700'
    },
    {
      title: 'Apply for Jobs',
      emoji: '💼',
      icon: Briefcase,
      description: 'Find work opportunities',
      path: '/jobs',
      color: 'from-green-500 to-green-700'
    },
    {
      title: 'My Profile',
      emoji: '👤',
      icon: User,
      description: 'View your details',
      path: '/profile',
      color: 'from-purple-500 to-purple-700'
    },
    {
      title: 'My Ratings',
      emoji: '⭐',
      icon: Star,
      description: 'See your reviews',
      path: '/profile',
      color: 'from-yellow-500 to-yellow-700'
    },
    {
      title: 'Download Resume',
      emoji: '📄',
      icon: Download,
      description: 'Get PDF resume',
      path: '/profile',
      color: 'from-red-500 to-red-700'
    },
    {
      title: 'Voice Profile',
      emoji: '🎤',
      icon: Mic,
      description: 'Speak about your work',
      path: '/paragraph',
      color: 'from-indigo-500 to-indigo-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Worker Dashboard
          </h1>
          <p className="text-base text-gray-600">
            Choose what you want to do
          </p>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {dashboardActions.map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.path)}
              className="dashboard-card group"
            >
              {/* Emoji Icon */}
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {action.emoji}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {action.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm font-medium">
                {action.description}
              </p>

              {/* Hover Arrow */}
              <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-blue-600 font-bold text-lg">→</span>
              </div>
            </button>
          ))}
        </div>

        {/* Create Profile Options Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-bold text-center text-gray-900 mb-6">
            Create Your Profile
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {/* Option 1: Fill Form */}
            <button
              onClick={() => navigate('/form')}
              className="feature-card group"
            >
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                📋
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Fill Easy Form
              </h3>
              <p className="text-gray-600 text-sm">
                Answer simple questions
              </p>
            </button>

            {/* Option 2: Voice Input */}
            <button
              onClick={() => navigate('/paragraph')}
              className="feature-card group"
            >
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                🎤
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Describe Your Work
              </h3>
              <p className="text-gray-600 text-sm">
                Speak or type about yourself
              </p>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="stat-card-large">
            <div className="text-3xl mb-2">📝</div>
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-xs text-gray-600">Applications</div>
          </div>
          <div className="stat-card-large">
            <div className="text-3xl mb-2">👁️</div>
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-xs text-gray-600">Profile Views</div>
          </div>
          <div className="stat-card-large">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-2xl font-bold text-yellow-600">0.0</div>
            <div className="text-xs text-gray-600">Rating</div>
          </div>
          <div className="stat-card-large">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-xs text-gray-600">Jobs Done</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
