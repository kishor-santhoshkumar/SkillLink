import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  User, MapPin, Phone, Languages, Download, Loader2, 
  Briefcase, Wrench, GraduationCap, Award, CheckCircle,
  Clock, DollarSign, Car, Tool, AlertCircle, Star
} from 'lucide-react';
import axios from 'axios';

const Profile = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const profileId = searchParams.get('id');
  
  const [profile, setProfile] = useState(null);
  const [allProfiles, setAllProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    console.log('Profile component mounted, profileId:', profileId);
    if (profileId) {
      fetchProfile(profileId);
    } else {
      // No profile ID provided - fetch all profiles or show create options
      fetchAllProfiles();
    }
  }, [profileId]);

  const fetchAllProfiles = async () => {
    console.log('Fetching all profiles...');
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/resumes/');
      console.log('Profiles response:', response.data);
      if (response.data && response.data.length > 0) {
        setAllProfiles(response.data);
        // If profiles exist, show the most recent one
        const latestProfile = response.data[0];
        setProfile(latestProfile);
        // Update URL with the profile ID
        window.history.replaceState(null, '', `/profile?id=${latestProfile.id}`);
      } else {
        // No profiles exist
        console.log('No profiles found');
        setAllProfiles([]);
        setProfile(null);
      }
      setError('');
    } catch (err) {
      console.error('Error fetching profiles:', err);
      setError('Failed to load profiles');
      setProfile(null);
      setAllProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const selectedId = e.target.value;
    navigate(`/profile?id=${selectedId}`);
  };

  const fetchProfile = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:8000/resumes/${id}`);
      setProfile(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!profile?.id) return;

    try {
      setDownloading(true);
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
      setError('Failed to download PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#2563EB] animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !profile) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#1F3A5F] mb-2">Profile Not Found</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-[#2563EB] text-white rounded-xl font-semibold hover:bg-[#1d4ed8] transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // No profile state
  if (!profile && !loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center animate-fade-in">
          <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#1F3A5F] mb-2">No Profile Yet</h2>
          <p className="text-slate-600 mb-6">
            {error || 'Please create your profile to get started.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/paragraph')}
              className="flex-1 px-6 py-3 bg-[#2563EB] text-white rounded-xl font-semibold hover:bg-[#1d4ed8] transition-colors"
            >
              Describe Your Work
            </button>
            <button
              onClick={() => navigate('/form')}
              className="flex-1 px-6 py-3 bg-white text-[#2563EB] border-2 border-[#2563EB] rounded-xl font-semibold hover:bg-blue-50 transition-colors"
            >
              Easy Form
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if verified worker
  const isVerified = profile.projects_completed > 20 && profile.client_rating >= 4.0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Profile Selector (if multiple profiles exist) */}
        {allProfiles.length > 1 && (
          <div className="bg-white rounded-xl shadow p-4">
            <label className="block text-sm font-semibold text-slate-600 mb-2">
              Select Profile to View:
            </label>
            <select
              value={profile?.id || ''}
              onChange={handleProfileChange}
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            >
              {allProfiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.full_name || 'Unnamed Profile'} - {p.primary_trade || 'No Trade'} (ID: {p.id})
                </option>
              ))}
            </select>
          </div>
        )}
        
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Profile Photo */}
            <div className="flex-shrink-0">
              {profile.profile_photo ? (
                <img
                  src={`http://127.0.0.1:8000${profile.profile_photo}`}
                  alt={profile.full_name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-[#2563EB] shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-slate-200 border-4 border-[#2563EB] flex items-center justify-center">
                  <User className="w-16 h-16 text-slate-400" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                <div>
                  <h1 className="text-3xl font-bold text-[#1F3A5F] mb-2">
                    {profile.full_name || 'Skilled Worker'}
                  </h1>
                  {profile.primary_trade && (
                    <span className="inline-block px-4 py-1.5 bg-[#2563EB] text-white rounded-full text-sm font-semibold">
                      {profile.primary_trade}
                    </span>
                  )}
                </div>
                {isVerified && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    Verified Worker
                  </div>
                )}
              </div>

              <div className="space-y-2 text-slate-600">
                {profile.years_of_experience && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#2563EB]" />
                    <span>{profile.years_of_experience} of experience</span>
                  </div>
                )}
                
                {(profile.village_or_city || profile.district || profile.state) && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#2563EB]" />
                    <span>
                      {[profile.village_or_city, profile.district, profile.state]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </div>
                )}
                
                {profile.phone_number && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#2563EB]" />
                    <span>{profile.phone_number}</span>
                  </div>
                )}
                
                {profile.languages_spoken && (
                  <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4 text-[#2563EB]" />
                    <span>{profile.languages_spoken}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          {profile.professional_summary && (
            <>
              <div className="w-full h-px bg-slate-200 my-6"></div>
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase mb-2">
                  Professional Summary
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  {profile.professional_summary}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Score & Confidence Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {profile.resume_score !== null && (
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <div className="text-3xl font-bold text-[#2563EB] mb-1">
                {profile.resume_score}%
              </div>
              <div className="text-sm text-slate-600">Quality Score</div>
            </div>
          )}
          
          {profile.ai_confidence_score !== null && (
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {profile.ai_confidence_score}%
              </div>
              <div className="text-sm text-slate-600">AI Confidence</div>
            </div>
          )}
          
          {profile.detected_language && (
            <div className="bg-white rounded-xl shadow p-4 text-center col-span-2 sm:col-span-1">
              <div className="text-lg font-bold text-slate-700 mb-1 capitalize">
                {profile.detected_language}
              </div>
              <div className="text-sm text-slate-600">Language</div>
            </div>
          )}
        </div>

        {/* Core Skills */}
        {profile.specializations && (
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[#1F3A5F] mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-[#2563EB]" />
              Core Skills
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {profile.specializations.split(',').map((skill, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-[#2563EB] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-slate-700">{skill.trim()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tools & Equipment */}
        {profile.tools_handled && (
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[#1F3A5F] mb-4 flex items-center gap-2">
              <Wrench className="w-6 h-6 text-[#2563EB]" />
              Tools & Equipment
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {profile.tools_handled.split(',').map((tool, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-[#2563EB] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-slate-700">{tool.trim()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Work Background */}
        {(profile.worked_as || profile.company_name || profile.project_types || profile.projects_completed !== null) && (
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[#1F3A5F] mb-4 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-[#2563EB]" />
              Work Experience
            </h2>
            <div className="space-y-3">
              {profile.worked_as && (
                <div>
                  <span className="text-sm font-semibold text-slate-500">Worked As:</span>
                  <p className="text-slate-700 capitalize">{profile.worked_as}</p>
                </div>
              )}
              {profile.company_name && (
                <div>
                  <span className="text-sm font-semibold text-slate-500">Company:</span>
                  <p className="text-slate-700">{profile.company_name}</p>
                </div>
              )}
              {profile.project_types && (
                <div>
                  <span className="text-sm font-semibold text-slate-500">Project Types:</span>
                  <p className="text-slate-700">{profile.project_types}</p>
                </div>
              )}
              {profile.projects_completed !== null && (
                <div>
                  <span className="text-sm font-semibold text-slate-500">Projects Completed:</span>
                  <p className="text-slate-700 text-2xl font-bold text-[#2563EB]">
                    {profile.projects_completed}+
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Service Details */}
        {(profile.service_type || profile.availability || profile.travel_radius || profile.expected_wage || profile.own_tools !== null || profile.own_vehicle !== null) && (
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[#1F3A5F] mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-[#2563EB]" />
              Service Details
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.service_type && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="text-sm text-slate-500 mb-1">Service Type</div>
                  <div className="font-semibold text-slate-700">{profile.service_type}</div>
                </div>
              )}
              {profile.availability && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="text-sm text-slate-500 mb-1">Availability</div>
                  <div className="font-semibold text-slate-700">{profile.availability}</div>
                </div>
              )}
              {profile.travel_radius && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="text-sm text-slate-500 mb-1">Travel Radius</div>
                  <div className="font-semibold text-slate-700">{profile.travel_radius}</div>
                </div>
              )}
              {profile.expected_wage && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="text-sm text-slate-500 mb-1 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    Expected Wage
                  </div>
                  <div className="font-semibold text-slate-700">{profile.expected_wage}</div>
                </div>
              )}
              {profile.own_tools !== null && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="text-sm text-slate-500 mb-1 flex items-center gap-1">
                    <Tool className="w-4 h-4" />
                    Own Tools
                  </div>
                  <div className={`font-semibold ${profile.own_tools ? 'text-green-600' : 'text-slate-400'}`}>
                    {profile.own_tools ? 'Yes' : 'No'}
                  </div>
                </div>
              )}
              {profile.own_vehicle !== null && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="text-sm text-slate-500 mb-1 flex items-center gap-1">
                    <Car className="w-4 h-4" />
                    Own Vehicle
                  </div>
                  <div className={`font-semibold ${profile.own_vehicle ? 'text-green-600' : 'text-slate-400'}`}>
                    {profile.own_vehicle ? 'Yes' : 'No'}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Education & Training */}
        {(profile.education_level || profile.technical_training) && (
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[#1F3A5F] mb-4 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-[#2563EB]" />
              Education & Training
            </h2>
            <div className="space-y-3">
              {profile.education_level && (
                <div>
                  <span className="text-sm font-semibold text-slate-500">Education Level:</span>
                  <p className="text-slate-700">{profile.education_level}</p>
                </div>
              )}
              {profile.technical_training && (
                <div>
                  <span className="text-sm font-semibold text-slate-500">Technical Training:</span>
                  <p className="text-slate-700">{profile.technical_training}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Trust & Verification */}
        {(profile.client_rating !== null || profile.reference_available !== null) && (
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[#1F3A5F] mb-4 flex items-center gap-2">
              <Star className="w-6 h-6 text-[#2563EB]" />
              Trust & Verification
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {profile.client_rating !== null && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="text-sm text-slate-500 mb-1">Client Rating</div>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-[#2563EB]">
                      {profile.client_rating.toFixed(1)}
                    </div>
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  </div>
                </div>
              )}
              {profile.reference_available !== null && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="text-sm text-slate-500 mb-1">References</div>
                  <div className={`font-semibold ${profile.reference_available ? 'text-green-600' : 'text-slate-400'}`}>
                    {profile.reference_available ? 'Available' : 'Not Available'}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Download Button */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center">
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="w-full sm:w-auto px-8 py-4 bg-[#1F3A5F] text-white text-lg font-bold rounded-xl shadow-lg hover:bg-[#152a45] transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 mx-auto"
          >
            {downloading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="w-6 h-6" />
                Download Professional Resume
              </>
            )}
          </button>
          <p className="text-sm text-slate-500 mt-3">
            Get your professional PDF resume with all details
          </p>
        </div>

        {/* Profile ID */}
        <div className="text-center">
          <p className="text-sm text-slate-500">
            Profile ID: <span className="font-bold text-[#1F3A5F]">#{profile.id}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
