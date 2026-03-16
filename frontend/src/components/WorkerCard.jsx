import { useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, Star, Phone, Wrench, Car, Award, Mail, Shield } from 'lucide-react';
import VerificationBadges from './VerificationBadges';
import ProfileBadgeRing from './ProfileBadgeRing';
import { useRef, useEffect } from 'react';

const WorkerCard = ({ worker }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  const rating = worker.client_rating || worker.average_rating || 0;
  const location = worker.village_or_city || worker.location || 'Location not specified';
  const experience = worker.years_of_experience || 'Not specified';
  const isVerified = worker.projects_completed >= 20 && rating >= 4.0;

  // Mouse tracking for hover light effect
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    };

    card.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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
      return `http://127.0.0.1:8000${normalizedPath}`;
    }
    
    // If it starts with uploads/ (no leading slash)
    if (normalizedPath.startsWith('uploads/')) {
      return `http://127.0.0.1:8000/${normalizedPath}`;
    }
    
    // If it's just the filename
    if (!normalizedPath.includes('/')) {
      return `http://127.0.0.1:8000/uploads/${normalizedPath}`;
    }
    
    // Default: prepend base URL
    return `http://127.0.0.1:8000/${normalizedPath}`;
  };

  const photoUrl = getPhotoUrl(worker.profile_photo);

  const handleViewProfile = () => {
    navigate(`/worker/${worker.id}`);
  };

  const handleCall = (e) => {
    e.stopPropagation();
    if (worker.phone_number) {
      window.location.href = `tel:${worker.phone_number}`;
    }
  };

  return (
    <div 
      ref={cardRef}
      className="premium-card group cursor-pointer animate-fade-in-stagger"
      onClick={handleViewProfile}
    >
      {/* Header with Photo */}
      <div className="relative h-32 bg-gradient-to-br from-[#1F3A5F] to-[#2563EB]">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }}></div>
        
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-10">
          <div className="relative">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={worker.full_name}
                className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-xl transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center shadow-xl transition-transform duration-300 group-hover:scale-110"
              style={{ display: photoUrl ? 'none' : 'flex' }}
            >
              <span className="text-3xl font-bold text-slate-600">
                {worker.full_name?.charAt(0) || '?'}
              </span>
            </div>
            {/* Badge Ring */}
            <div className="absolute -inset-4">
              <ProfileBadgeRing worker={worker} size="sm" demo={true} />
            </div>
          </div>
        </div>
        {isVerified && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg animate-glow-pulse">
            <Award className="w-3 h-3" />
            Verified
          </div>
        )}
      </div>

      {/* Content */}
      <div className="pt-14 px-6 pb-6">
        {/* Verification Sources */}
        {(worker.is_email_verified || worker.is_phone_verified || worker.is_identity_verified || worker.is_background_checked) && (
          <div className="flex flex-wrap gap-1.5 justify-center mb-3">
            {worker.is_email_verified && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium border border-blue-200">
                <Mail className="w-2.5 h-2.5" />
                Email
              </span>
            )}
            {worker.is_phone_verified && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full font-medium border border-green-200">
                <Phone className="w-2.5 h-2.5" />
                Phone
              </span>
            )}
            {worker.is_identity_verified && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded-full font-medium border border-purple-200">
                <Shield className="w-2.5 h-2.5" />
                Identity
              </span>
            )}
            {worker.is_background_checked && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-full font-medium border border-amber-200">
                <Award className="w-2.5 h-2.5" />
                Background
              </span>
            )}
          </div>
        )}
        
        {/* Name and Trade */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-[#1F3A5F] mb-1 group-hover:text-[#2563EB] transition-colors">
            {worker.full_name || 'Name not available'}
          </h3>
          <p className="text-[#2563EB] font-semibold">
            {worker.primary_trade || 'Trade not specified'}
          </p>
        </div>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 transition-all duration-300 ${
                    i < Math.floor(rating)
                      ? 'fill-yellow-400 text-yellow-400 group-hover:scale-110'
                      : 'text-slate-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-slate-700">
              {rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-600 group-hover:text-slate-700 transition-colors">
            <MapPin className="w-4 h-4 flex-shrink-0 text-[#2563EB]" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 group-hover:text-slate-700 transition-colors">
            <Briefcase className="w-4 h-4 flex-shrink-0 text-[#2563EB]" />
            <span>{experience} experience</span>
          </div>
          {worker.projects_completed > 0 && (
            <div className="flex items-center gap-2 text-sm text-slate-600 group-hover:text-slate-700 transition-colors">
              <Award className="w-4 h-4 flex-shrink-0 text-[#2563EB]" />
              <span>{worker.projects_completed} projects completed</span>
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="mb-4">
          <VerificationBadges worker={worker} size="sm" />
        </div>

        {/* Skills and Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {worker.own_tools && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium border border-blue-200 transition-all duration-300 hover:bg-blue-100">
              <Wrench className="w-3 h-3" />
              Own Tools
            </span>
          )}
          {worker.own_vehicle && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium border border-green-200 transition-all duration-300 hover:bg-green-100">
              <Car className="w-3 h-3" />
              Own Vehicle
            </span>
          )}
          {worker.availability && (
            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs rounded-full capitalize font-medium border border-purple-200 transition-all duration-300 hover:bg-purple-100">
              {worker.availability}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleViewProfile}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#1F3A5F] to-[#2563EB] text-white rounded-xl hover:shadow-lg transition-all duration-300 text-sm font-semibold hover:-translate-y-0.5"
          >
            View Profile
          </button>
          {worker.phone_number && (
            <button
              onClick={handleCall}
              className="px-4 py-2.5 border-2 border-[#2563EB] text-[#2563EB] rounded-xl hover:bg-blue-50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              title="Call worker"
            >
              <Phone className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerCard;
