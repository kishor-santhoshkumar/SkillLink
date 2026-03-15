/**
 * ResumePreview Component
 * Displays structured skilled worker profile in a clean, professional format
 */
import { getPhotoUrl } from '../services/api';

const ResumePreview = ({ resume }) => {
  if (!resume) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 mb-6 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Profile Generated Yet</h3>
        <p className="text-gray-500">Enter your information above and click "Generate Profile" to see your skilled worker profile.</p>
      </div>
    );
  }

  const InfoSection = ({ title, content, icon }) => {
    if (!content) return null;
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <span className="mr-2">{icon}</span>
          {title}
        </h3>
        <div className="pl-7">
          <p className="text-gray-700 whitespace-pre-line">{content}</p>
        </div>
      </div>
    );
  };

  const ContactInfo = ({ phone, location }) => {
    const items = [];
    if (phone) items.push({ icon: '📱', text: phone });
    if (location) items.push({ icon: '📍', text: location });
    
    if (items.length === 0) return null;

    return (
      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="flex flex-wrap gap-4">
          {items.map((item, index) => (
            <div key={index} className="flex items-center text-gray-600">
              <span className="mr-2">{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const MetricsBadge = ({ label, value, color = 'blue' }) => {
    if (!value && value !== 0) return null;
    
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      purple: 'bg-purple-100 text-purple-800',
      orange: 'bg-orange-100 text-orange-800'
    };

    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorClasses[color]}`}>
        {label}: {value}
      </div>
    );
  };

  const TradeBadge = ({ trade }) => {
    if (!trade) return null;
    
    const tradeColors = {
      'Carpenter': 'bg-amber-100 text-amber-800 border-amber-300',
      'Plumber': 'bg-blue-100 text-blue-800 border-blue-300',
      'Electrician': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Mechanic': 'bg-gray-100 text-gray-800 border-gray-300',
      'Mason': 'bg-stone-100 text-stone-800 border-stone-300',
      'Painter': 'bg-purple-100 text-purple-800 border-purple-300',
      'Welder': 'bg-red-100 text-red-800 border-red-300'
    };

    const colorClass = tradeColors[trade] || 'bg-indigo-100 text-indigo-800 border-indigo-300';

    return (
      <div className={`inline-flex items-center px-4 py-2 rounded-lg text-lg font-bold border-2 ${colorClass}`}>
        🔧 {trade}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 mb-6">
      {/* Header with Photo */}
      <div className="text-center mb-8 pb-6 border-b-2 border-primary-500">
        {/* Profile Photo */}
        {resume.profile_photo && (
          <div className="mb-4">
            <img 
              src={getPhotoUrl(resume.id)} 
              alt={resume.full_name}
              className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-primary-200"
            />
          </div>
        )}
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {resume.full_name || 'Skilled Worker Profile'}
        </h1>
        
        {/* Trade Badge */}
        <div className="mb-4">
          <TradeBadge trade={resume.primary_trade} />
        </div>

        {/* Experience and Rating */}
        <div className="flex items-center justify-center gap-6">
          {resume.years_of_experience && (
            <p className="text-xl text-gray-600 font-medium">
              {resume.years_of_experience} Experience
            </p>
          )}
          
          {/* Average Rating */}
          {resume.average_rating > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-5 h-5 ${star <= Math.round(resume.average_rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-700">{resume.average_rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <ContactInfo 
        phone={resume.contact_number}
        location={resume.location}
      />

      {/* Metrics */}
      {(resume.resume_score || resume.ai_confidence_score || resume.detected_language) && (
        <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex flex-wrap gap-3">
            <MetricsBadge label="Quality Score" value={resume.resume_score} color="green" />
            <MetricsBadge label="AI Confidence" value={resume.ai_confidence_score} color="blue" />
            <MetricsBadge label="Language" value={resume.detected_language?.toUpperCase()} color="purple" />
          </div>
        </div>
      )}

      {/* Professional Summary */}
      {resume.professional_summary && (
        <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
            <p className="text-gray-700 italic">"{resume.professional_summary}"</p>
          </div>
        </div>
      )}

      {/* Specializations */}
      {resume.specializations && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <span className="mr-2">⚙️</span>
            Specializations
          </h3>
          <div className="pl-7">
            <div className="flex flex-wrap gap-2">
              {resume.specializations.split(',').map((spec, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {spec.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Service Details */}
      {(resume.service_type || resume.availability || resume.travel_radius) && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <span className="mr-2">📋</span>
            Service Details
          </h3>
          <div className="pl-7 grid grid-cols-1 md:grid-cols-3 gap-4">
            {resume.service_type && (
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <p className="text-xs text-green-600 font-medium mb-1">Service Type</p>
                <p className="text-gray-800 font-semibold">{resume.service_type}</p>
              </div>
            )}
            {resume.availability && (
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-xs text-blue-600 font-medium mb-1">Availability</p>
                <p className="text-gray-800 font-semibold">{resume.availability}</p>
              </div>
            )}
            {resume.travel_radius && (
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <p className="text-xs text-purple-600 font-medium mb-1">Travel Radius</p>
                <p className="text-gray-800 font-semibold">{resume.travel_radius}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Projects Completed */}
      {resume.projects_completed && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <span className="mr-2">✅</span>
            Projects Completed
          </h3>
          <div className="pl-7">
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200 inline-block">
              <p className="text-3xl font-bold text-orange-600">{resume.projects_completed}+</p>
              <p className="text-sm text-gray-600">Successful Projects</p>
            </div>
          </div>
        </div>
      )}

      {/* Tools Known */}
      <InfoSection 
        title="Tools & Equipment" 
        content={resume.tools_known}
        icon="🔨"
      />

      {/* Expected Wage */}
      {resume.expected_wage && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <span className="mr-2">💰</span>
            Expected Wage
          </h3>
          <div className="pl-7">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200 inline-block">
              <p className="text-xl font-bold text-green-600">{resume.expected_wage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Languages */}
      {resume.languages && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <span className="mr-2">🌐</span>
            Languages
          </h3>
          <div className="pl-7">
            <p className="text-gray-700">{resume.languages}</p>
          </div>
        </div>
      )}

      {/* Footer Info */}
      {resume.created_at && (
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          Profile generated on {new Date(resume.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      )}
    </div>
  );
};

export default ResumePreview;
