import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  User, MapPin, Phone, Download, Loader2, 
  Briefcase, Award, AlertCircle, Eye, EyeOff, CheckCircle
} from 'lucide-react';
import axios from 'axios';
import { publishProfile, unpublishProfile, getPublishStatus } from '../services/api';
import TemplateSelector from '../components/TemplateSelector';

const ProfileSimple = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const profileId = searchParams.get('id');
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('executive');
  const [templateSaving, setTemplateSaving] = useState(false);

  useEffect(() => {
    if (profileId) {
      fetchProfile(profileId);
    } else {
      fetchLatestProfile();
    }
  }, [profileId]);

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

  const fetchProfile = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:8000/resumes/${id}`);
      console.log('Profile data:', response.data);
      console.log('Photo path:', response.data.profile_photo);
      setProfile(response.data);
      setError('');
      
      // Set selected template from profile data
      if (response.data.resume_template) {
        setSelectedTemplate(response.data.resume_template);
      }
      
      // Fetch publish status
      try {
        const statusResponse = await getPublishStatus(id);
        setIsPublished(statusResponse.is_published);
      } catch (err) {
        console.error('Error fetching publish status:', err);
      }
    } catch (err) {
      setError('Failed to load profile');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/resumes/');
      if (response.data && response.data.length > 0) {
        const latest = response.data[0];
        setProfile(latest);
        window.history.replaceState(null, '', `/profile?id=${latest.id}`);
      } else {
        setProfile(null);
      }
      setError('');
    } catch (err) {
      setError('Failed to load profiles');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!profile?.id) return;
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/resumes/${profile.id}/download`,
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${profile.full_name || 'profile'}_${profile.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to download PDF');
    }
  };

  const handlePublishToggle = async () => {
    if (!profile?.id) return;
    
    setPublishLoading(true);
    try {
      if (isPublished) {
        // Unpublish
        const response = await unpublishProfile(profile.id);
        setIsPublished(false);
        alert(response.message || 'Profile unpublished successfully!');
      } else {
        // Publish
        const response = await publishProfile(profile.id);
        setIsPublished(true);
        alert(response.message || 'Profile published successfully! Companies can now see your profile.');
      }
    } catch (err) {
      console.error('Error toggling publish status:', err);
      alert('Failed to update profile visibility. Please try again.');
    } finally {
      setPublishLoading(false);
    }
  };

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
  };

  const handleTemplateSave = async () => {
    if (!profile?.id) return;
    
    setTemplateSaving(true);
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/resumes/${profile.id}`,
        { resume_template: selectedTemplate }
      );
      
      // Update profile with new template
      setProfile(response.data);
      alert('Resume template saved successfully! Your next PDF download will use this template.');
    } catch (err) {
      console.error('Error saving template:', err);
      alert('Failed to save template. Please try again.');
    } finally {
      setTemplateSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#2563EB] animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#1F3A5F] mb-2">No Profile Yet</h2>
          <p className="text-slate-600 mb-6">{error || 'Create your profile to get started'}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/paragraph')}
              className="px-6 py-3 bg-[#2563EB] text-white rounded-xl font-semibold hover:bg-[#1d4ed8]"
            >
              Describe Your Work
            </button>
            <button
              onClick={() => navigate('/form')}
              className="px-6 py-3 bg-white text-[#2563EB] border-2 border-[#2563EB] rounded-xl font-semibold hover:bg-blue-50"
            >
              Easy Form
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex gap-6 items-start">
            {profile.profile_photo ? (
              <img
                src={getPhotoUrl(profile.profile_photo)}
                alt={profile.full_name}
                className="w-32 h-32 rounded-full object-cover border-4 border-[#2563EB]"
                onError={(e) => {
                  console.error('Image failed to load:', profile.profile_photo);
                  console.error('Tried URL:', getPhotoUrl(profile.profile_photo));
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="w-32 h-32 rounded-full bg-slate-200 border-4 border-[#2563EB] flex items-center justify-center" style={{ display: profile.profile_photo ? 'none' : 'flex' }}>
              <User className="w-16 h-16 text-slate-400" />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[#1F3A5F] mb-2">
                {profile.full_name || 'Skilled Worker'}
              </h1>
              {profile.primary_trade && (
                <span className="inline-block px-4 py-1 bg-[#2563EB] text-white rounded-full text-sm font-semibold mb-3">
                  {profile.primary_trade}
                </span>
              )}
              
              <div className="space-y-2 text-slate-600 mt-3">
                {profile.years_of_experience && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#2563EB]" />
                    <span>{profile.years_of_experience}</span>
                  </div>
                )}
                {profile.phone_number && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#2563EB]" />
                    <span>{profile.phone_number}</span>
                  </div>
                )}
                {(profile.village_or_city || profile.district) && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#2563EB]" />
                    <span>
                      {[profile.village_or_city, profile.district, profile.state]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {profile.professional_summary && (
            <>
              <div className="w-full h-px bg-slate-200 my-6"></div>
              <p className="text-slate-700">{profile.professional_summary}</p>
            </>
          )}
        </div>

        {/* Score Badge */}
        {profile.resume_score && (
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="text-4xl font-bold text-[#2563EB] mb-2">
              {profile.resume_score}%
            </div>
            <div className="text-slate-600">Profile Quality Score</div>
          </div>
        )}

        {/* Skills */}
        {profile.specializations && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-[#1F3A5F] mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-[#2563EB]" />
              Core Skills
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {profile.specializations.split(',').map((skill, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-[#2563EB] rounded-full mt-2"></div>
                  <span className="text-slate-700">{skill.trim()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Template Selector */}
        <TemplateSelector
          selectedTemplate={selectedTemplate}
          onSelect={handleTemplateSelect}
          onSave={handleTemplateSave}
          saving={templateSaving}
          profileId={profile.id}
        />

        {/* Download and Publish Buttons */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="px-8 py-4 bg-[#1F3A5F] text-white text-lg font-bold rounded-xl shadow-lg hover:bg-[#152a45] transition-all flex items-center justify-center gap-3"
            >
              <Download className="w-6 h-6" />
              Download Resume
            </button>

            {/* Publish/Unpublish Button */}
            <button
              onClick={handlePublishToggle}
              disabled={publishLoading}
              className={`px-8 py-4 text-white text-lg font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 ${
                isPublished
                  ? 'bg-orange-600 hover:bg-orange-700'
                  : 'bg-green-600 hover:bg-green-700'
              } ${publishLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {publishLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Processing...
                </>
              ) : isPublished ? (
                <>
                  <EyeOff className="w-6 h-6" />
                  Unpublish Profile
                </>
              ) : (
                <>
                  <Eye className="w-6 h-6" />
                  Publish Profile
                </>
              )}
            </button>
          </div>

          {/* Publish Status Info */}
          <div className={`mt-6 p-4 rounded-xl ${
            isPublished ? 'bg-green-50 border-2 border-green-200' : 'bg-orange-50 border-2 border-orange-200'
          }`}>
            <div className="flex items-start gap-3">
              {isPublished ? (
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <h3 className={`font-semibold mb-1 ${
                  isPublished ? 'text-green-900' : 'text-orange-900'
                }`}>
                  {isPublished ? 'Profile is Published' : 'Profile is Not Published'}
                </h3>
                <p className={`text-sm ${
                  isPublished ? 'text-green-700' : 'text-orange-700'
                }`}>
                  {isPublished
                    ? 'Your profile is visible to companies. They can find and contact you for job opportunities.'
                    : 'Your profile is hidden from companies. Click "Publish Profile" to make it visible and start receiving job opportunities.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile ID */}
        <div className="text-center text-sm text-slate-500">
          Profile ID: <span className="font-bold text-[#1F3A5F]">#{profile.id}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileSimple;
