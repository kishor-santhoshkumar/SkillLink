import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Briefcase, Star, Phone, Mail, Download,
  Wrench, Car, Award, Calendar, Languages, GraduationCap, CheckCircle, Shield
} from 'lucide-react';
import { getWorkerProfile, getReviews, downloadResume } from '../../services/api';
import ProfileBadgeRing from '../../components/ProfileBadgeRing';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const WorkerDetail = () => {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkerData();
  }, [workerId]);

  // Helper function to construct photo URL
  const getPhotoUrl = (photoPath) => {
    if (!photoPath) return null;
    
    // Normalize path separators (Windows uses backslashes)
    const normalizedPath = photoPath.replace(/\\/g, '/');
    
    // If it's already a full URL
    if (normalizedPath.startsWith('http')) {
      return normalizedPath;
    }
    
    // If it starts with /uploads/, use as is
    if (normalizedPath.startsWith('/uploads/')) {
      return `${API_URL}${normalizedPath}`;
    }
    
    // If it starts with uploads/ (no leading slash)
    if (normalizedPath.startsWith('uploads/')) {
      return `${API_URL}/${normalizedPath}`;
    }
    
    // If it's just the filename
    if (!normalizedPath.includes('/')) {
      return `${API_URL}/uploads/${normalizedPath}`;
    }
    
    // Default: prepend base URL
    return `${API_URL}/${normalizedPath}`;
  };

  const loadWorkerData = async () => {
    try {
      const [workerData, reviewsData] = await Promise.all([
        getWorkerProfile(workerId),
        getReviews(workerId).catch(() => []) // Reviews might fail if none exist
      ]);
      setWorker(workerData);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error loading worker:', error);
      alert('Failed to load worker profile');
      navigate('/company/search');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    downloadResume(workerId);
  };

  const handleCall = () => {
    if (worker.phone_number) {
      window.location.href = `tel:${worker.phone_number}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading worker profile...</p>
        </div>
      </div>
    );
  }

  if (!worker) {
    return null;
  }

  const rating = worker.client_rating || worker.average_rating || 0;
  const location = worker.village_or_city || worker.location || 'Location not specified';
  const isVerified = worker.projects_completed >= 20 && rating >= 4.0;
  const photoUrl = getPhotoUrl(worker.profile_photo);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/company/search')}
        className="flex items-center gap-2 text-slate-600 hover:text-[#1F3A5F] mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Search
      </button>

      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="relative h-48 bg-gradient-to-br from-[#1F3A5F] to-[#2563EB]">
          <div className="absolute bottom-0 left-8 transform translate-y-1/2">
            <div className="relative inline-block">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={worker.full_name}
                  className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
                  onError={(e) => {
                    // Fallback to initials if image fails to load
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="w-32 h-32 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center shadow-lg"
                style={{ display: photoUrl ? 'none' : 'flex' }}
              >
                <span className="text-5xl font-bold text-slate-500">
                  {worker.full_name?.charAt(0) || '?'}
                </span>
              </div>
              
              {/* LinkedIn-style Verification Badge - Bottom Right */}
              <div className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-lg border-2 border-[#2563EB]">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-1.5 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            
            {/* Badge Ring */}
            <div className="absolute -inset-6">
              <ProfileBadgeRing worker={worker} size="md" demo={true} />
            </div>
          </div>
          
          {isVerified && (
            <div className="absolute top-6 right-6 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
              <Award className="w-4 h-4" />
              Verified Worker
            </div>
          )}
        </div>

        <div className="pt-20 px-8 pb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1F3A5F] mb-2">
                {worker.full_name || 'Name not available'}
              </h1>
              <p className="text-xl text-[#2563EB] font-semibold mb-3">
                {worker.primary_trade || 'Trade not specified'}
              </p>
              
              {/* Rating */}
              {rating > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-slate-700">
                    {rating.toFixed(1)}
                  </span>
                  <span className="text-slate-500">
                    ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              {worker.phone_number && (
                <button
                  onClick={handleCall}
                  className="flex items-center gap-2 px-6 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1F3A5F] transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call Now
                </button>
              )}
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
              <MapPin className="w-5 h-5 text-[#2563EB]" />
              <div>
                <p className="text-xs text-slate-500">Location</p>
                <p className="font-semibold text-slate-700">{location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
              <Briefcase className="w-5 h-5 text-[#2563EB]" />
              <div>
                <p className="text-xs text-slate-500">Experience</p>
                <p className="font-semibold text-slate-700">{worker.years_of_experience || 'Not specified'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
              <Award className="w-5 h-5 text-[#2563EB]" />
              <div>
                <p className="text-xs text-slate-500">Projects</p>
                <p className="font-semibold text-slate-700">{worker.projects_completed || 0} completed</p>
              </div>
            </div>
          </div>

          {/* Verification Sources */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-slate-600 font-medium mb-3">Verified through:</p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium border border-blue-300">
                <Mail className="w-3 h-3" />
                Email
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium border border-green-300">
                <Phone className="w-3 h-3" />
                Phone
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium border border-purple-300">
                <Shield className="w-3 h-3" />
                Identity
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Professional Summary */}
          {worker.professional_summary && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-[#1F3A5F] mb-4">Professional Summary</h2>
              <p className="text-slate-700 leading-relaxed">{worker.professional_summary}</p>
            </div>
          )}

          {/* Skills & Specializations */}
          {worker.specializations && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-[#1F3A5F] mb-4">Specializations</h2>
              <p className="text-slate-700">{worker.specializations}</p>
            </div>
          )}

          {/* Tools */}
          {worker.tools_handled && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-[#1F3A5F] mb-4">Tools & Equipment</h2>
              <p className="text-slate-700">{worker.tools_handled}</p>
            </div>
          )}

          {/* Reviews */}
          {reviews.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-[#1F3A5F] mb-4">Client Reviews</h2>
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review.id} className="border-b border-slate-200 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-slate-700">{review.client_name}</p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-slate-600 text-sm">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-[#1F3A5F] mb-4">Contact Information</h3>
            <div className="space-y-3">
              {worker.phone_number && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#2563EB]" />
                  <span className="text-slate-700">{worker.phone_number}</span>
                </div>
              )}
              {worker.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#2563EB]" />
                  <span className="text-slate-700">{worker.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Additional Details */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-[#1F3A5F] mb-4">Additional Details</h3>
            <div className="space-y-3">
              {worker.availability && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Availability</p>
                  <p className="text-slate-700 capitalize">{worker.availability}</p>
                </div>
              )}
              {worker.expected_wage && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Expected Wage</p>
                  <p className="text-slate-700">{worker.expected_wage}</p>
                </div>
              )}
              {worker.education_level && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Education</p>
                  <p className="text-slate-700 capitalize">{worker.education_level}</p>
                </div>
              )}
              {worker.languages_spoken && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Languages</p>
                  <p className="text-slate-700">{worker.languages_spoken}</p>
                </div>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-[#1F3A5F] mb-4">Capabilities</h3>
            <div className="space-y-2">
              {worker.own_tools && (
                <div className="flex items-center gap-2 text-slate-700">
                  <Wrench className="w-5 h-5 text-[#2563EB]" />
                  <span>Has own tools</span>
                </div>
              )}
              {worker.own_vehicle && (
                <div className="flex items-center gap-2 text-slate-700">
                  <Car className="w-5 h-5 text-[#2563EB]" />
                  <span>Has own vehicle</span>
                </div>
              )}
              {worker.reference_available && (
                <div className="flex items-center gap-2 text-slate-700">
                  <Award className="w-5 h-5 text-[#2563EB]" />
                  <span>References available</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDetail;
