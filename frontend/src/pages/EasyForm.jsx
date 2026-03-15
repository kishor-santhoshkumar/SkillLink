import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Loader2, Check, Camera, Upload, X } from 'lucide-react';
import axios from 'axios';
import TradeSelector from '../components/TradeSelector';
import SpecializationSection from '../components/SpecializationSection';

const EasyForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    village_or_city: '',
    district: '',
    state: '',
    primary_trade: '',
    education_level: '',
    years_of_experience: '',
    specializations: [],
    own_tools: false,
    own_vehicle: false,
    service_type: '',
    availability: '',
    travel_radius: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTradeSelect = (trade) => {
    setFormData(prev => ({
      ...prev,
      primary_trade: trade,
      specializations: [] // Reset specializations when trade changes
    }));
  };

  const handleToggleSpecialization = (spec) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter(s => s !== spec)
        : [...prev.specializations, spec]
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (JPG, PNG)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setPhotoFile(file);
      setError('');

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.full_name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!formData.phone_number.trim()) {
      setError('Please enter your phone number');
      return;
    }
    if (!formData.primary_trade) {
      setError('Please select your trade');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Prepare data for backend
      const submitData = {
        ...formData,
        specializations: formData.specializations.join(', '),
        tools_handled: formData.specializations.join(', '), // Use specializations as tools
        worked_as: 'self-employed',
        projects_completed: 0
      };

      // Create profile
      const response = await axios.post('http://127.0.0.1:8000/resumes/structured', submitData);
      const createdResume = response.data;

      // Upload photo if provided
      if (photoFile && createdResume.id) {
        const photoFormData = new FormData();
        photoFormData.append('file', photoFile);

        try {
          await axios.post(
            `http://127.0.0.1:8000/resumes/${createdResume.id}/upload-photo`,
            photoFormData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );
          console.log('Photo uploaded successfully');
        } catch (photoErr) {
          console.error('Photo upload failed:', photoErr);
        }
      }

      // Small delay to ensure photo is saved
      await new Promise(resolve => setTimeout(resolve, 500));

      // Navigate to profile page with resume ID
      navigate(`/profile?id=${createdResume.id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate progress (simulated)
  const calculateProgress = () => {
    let filledFields = 0;
    const totalFields = 8;

    if (formData.full_name) filledFields++;
    if (formData.phone_number) filledFields++;
    if (formData.village_or_city) filledFields++;
    if (formData.primary_trade) filledFields++;
    if (formData.education_level) filledFields++;
    if (formData.years_of_experience) filledFields++;
    if (formData.specializations.length > 0) filledFields++;
    if (formData.service_type) filledFields++;

    return Math.round((filledFields / totalFields) * 100);
  };

  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 bg-[#2563EB] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1F3A5F] mb-2">
            Create Your Work Profile
          </h1>
          <p className="text-lg text-slate-600">
            Fill the details step-by-step
          </p>

          {/* Progress Bar */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">
                Profile Completion
              </span>
              <span className="text-sm font-bold text-[#2563EB]">
                {progress}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-[#2563EB] h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-8">
          
          {/* Section 1: Basic Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#1F3A5F] border-b-2 border-[#2563EB] pb-2">
              BASIC DETAILS
            </h2>
            
            <div>
              <label className="block text-base font-semibold text-slate-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-4 text-lg border-2 border-slate-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-base font-semibold text-slate-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className="w-full px-4 py-4 text-lg border-2 border-slate-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-base font-semibold text-slate-700 mb-2">
                Village / City
              </label>
              <input
                type="text"
                name="village_or_city"
                value={formData.village_or_city}
                onChange={handleInputChange}
                placeholder="Enter your village or city"
                className="w-full px-4 py-4 text-lg border-2 border-slate-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-base font-semibold text-slate-700 mb-2">
                  District
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  placeholder="District"
                  className="w-full px-4 py-4 text-lg border-2 border-slate-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-base font-semibold text-slate-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  className="w-full px-4 py-4 text-lg border-2 border-slate-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Profile Photo */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#1F3A5F] border-b-2 border-[#2563EB] pb-2">
              PROFILE PHOTO
            </h2>

            {!photoPreview ? (
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-[#2563EB] transition-colors">
                <input
                  type="file"
                  id="photo-upload-form"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <label
                  htmlFor="photo-upload-form"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                    <Camera className="w-10 h-10 text-[#2563EB]" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-[#1F3A5F] mb-1">
                      Upload Your Photo
                    </p>
                    <p className="text-sm text-slate-500">
                      JPG or PNG, max 5MB
                    </p>
                  </div>
                </label>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Profile preview"
                    className="w-32 h-32 rounded-xl object-cover border-4 border-white shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-green-600 font-medium flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Photo uploaded successfully
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Trade Selection */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#1F3A5F] border-b-2 border-[#2563EB] pb-2">
              SELECT YOUR TRADE *
            </h2>
            <TradeSelector
              selectedTrade={formData.primary_trade}
              onSelectTrade={handleTradeSelect}
            />
          </div>

          {/* Section 4: Education Level */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#1F3A5F] border-b-2 border-[#2563EB] pb-2">
              EDUCATION LEVEL
            </h2>
            <select
              name="education_level"
              value={formData.education_level}
              onChange={handleInputChange}
              className="w-full px-4 py-4 text-lg border-2 border-slate-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
            >
              <option value="">Select education level</option>
              <option value="No formal education">No formal education</option>
              <option value="5th Standard">5th Standard</option>
              <option value="10th Standard">10th Standard</option>
              <option value="12th Standard">12th Standard</option>
              <option value="ITI">ITI</option>
              <option value="Diploma">Diploma</option>
              <option value="Degree">Degree</option>
            </select>
          </div>

          {/* Section 5: Experience */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#1F3A5F] border-b-2 border-[#2563EB] pb-2">
              YEARS OF EXPERIENCE
            </h2>
            <select
              name="years_of_experience"
              value={formData.years_of_experience}
              onChange={handleInputChange}
              className="w-full px-4 py-4 text-lg border-2 border-slate-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
            >
              <option value="">Select experience</option>
              <option value="0-1 years">0-1 years</option>
              <option value="1-3 years">1-3 years</option>
              <option value="3-5 years">3-5 years</option>
              <option value="5-10 years">5-10 years</option>
              <option value="10+ years">10+ years</option>
            </select>
          </div>

          {/* Section 6: Specializations */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#1F3A5F] border-b-2 border-[#2563EB] pb-2">
              SELECT YOUR SKILLS
            </h2>
            <SpecializationSection
              trade={formData.primary_trade}
              selectedSpecializations={formData.specializations}
              onToggleSpecialization={handleToggleSpecialization}
            />
          </div>

          {/* Section 7: Tools & Vehicle */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#1F3A5F] border-b-2 border-[#2563EB] pb-2">
              TOOLS & TRAVEL
            </h2>
            
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, own_tools: !prev.own_tools }))}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${
                formData.own_tools
                  ? 'border-[#2563EB] bg-blue-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                  formData.own_tools
                    ? 'border-[#2563EB] bg-[#2563EB]'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {formData.own_tools && <Check className="w-4 h-4 text-white" />}
              </div>
              <span
                className={`text-left text-base font-medium ${
                  formData.own_tools ? 'text-[#2563EB]' : 'text-slate-700'
                }`}
              >
                I own my work tools
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, own_vehicle: !prev.own_vehicle }))}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${
                formData.own_vehicle
                  ? 'border-[#2563EB] bg-blue-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                  formData.own_vehicle
                    ? 'border-[#2563EB] bg-[#2563EB]'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {formData.own_vehicle && <Check className="w-4 h-4 text-white" />}
              </div>
              <span
                className={`text-left text-base font-medium ${
                  formData.own_vehicle ? 'text-[#2563EB]' : 'text-slate-700'
                }`}
              >
                I have my own vehicle
              </span>
            </button>
          </div>

          {/* Section 8: Service Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#1F3A5F] border-b-2 border-[#2563EB] pb-2">
              WORK AVAILABILITY
            </h2>

            <div>
              <label className="block text-base font-semibold text-slate-700 mb-2">
                Service Type
              </label>
              <select
                name="service_type"
                value={formData.service_type}
                onChange={handleInputChange}
                className="w-full px-4 py-4 text-lg border-2 border-slate-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
              >
                <option value="">Select service type</option>
                <option value="Daily wage">Daily wage</option>
                <option value="Contract">Contract</option>
                <option value="Per project">Per project</option>
              </select>
            </div>

            <div>
              <label className="block text-base font-semibold text-slate-700 mb-2">
                Availability
              </label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                className="w-full px-4 py-4 text-lg border-2 border-slate-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
              >
                <option value="">Select availability</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>

            <div>
              <label className="block text-base font-semibold text-slate-700 mb-2">
                Travel Radius
              </label>
              <select
                name="travel_radius"
                value={formData.travel_radius}
                onChange={handleInputChange}
                className="w-full px-4 py-4 text-lg border-2 border-slate-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
              >
                <option value="">Select travel radius</option>
                <option value="5 km">5 km</option>
                <option value="10 km">10 km</option>
                <option value="15 km">15 km</option>
                <option value="City-wide">City-wide</option>
              </select>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-[#1F3A5F] text-white text-lg font-bold rounded-xl shadow-lg hover:bg-[#152a45] transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Creating Your Profile...
              </>
            ) : (
              <>
                <Check className="w-6 h-6" />
                Generate My Profile
              </>
            )}
          </button>
        </form>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            * Required fields
          </p>
        </div>
      </div>
    </div>
  );
};

export default EasyForm;
