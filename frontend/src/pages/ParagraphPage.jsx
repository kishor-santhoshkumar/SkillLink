import { useState } from 'react';
import { FileText, Sparkles, Download, Loader2, CheckCircle, Camera, X, Upload, Languages, User, Mic, Keyboard } from 'lucide-react';
import axios from 'axios';
import VoiceRecorder from '../components/VoiceRecorder';

const ParagraphPage = () => {
  const [methodSelected, setMethodSelected] = useState(false); // Track if user selected input method
  const [inputMode, setInputMode] = useState('type'); // 'type' or 'voice'
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [formData, setFormData] = useState({
    raw_input: ''
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [resumeData, setResumeData] = useState(null);
  const [language, setLanguage] = useState('english');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  // Translations for instructions
  const translations = {
    english: {
      title: "How to describe your work:",
      instructions: [
        "Tell us your name and trade (carpenter, plumber, electrician, etc.)",
        "Mention your years of experience",
        "List your skills and specializations",
        "Describe projects you've completed",
        "Include your location and contact number",
        "Add any tools you know how to use"
      ]
    },
    tamil: {
      title: "உங்கள் வேலையை எப்படி விவரிப்பது:",
      instructions: [
        "உங்கள் பெயர் மற்றும் தொழில் சொல்லுங்கள் (தச்சர், குழாய் பழுதுபார்ப்பவர், மின்சாரம், போன்றவை)",
        "உங்கள் அனுபவ ஆண்டுகளை குறிப்பிடுங்கள்",
        "உங்கள் திறன்கள் மற்றும் சிறப்புகளை பட்டியலிடுங்கள்",
        "நீங்கள் முடித்த திட்டங்களை விவரிக்கவும்",
        "உங்கள் இடம் மற்றும் தொடர்பு எண்ணை சேர்க்கவும்",
        "நீங்கள் பயன்படுத்த தெரிந்த கருவிகளை சேர்க்கவும்"
      ]
    },
    hindi: {
      title: "अपने काम का वर्णन कैसे करें:",
      instructions: [
        "अपना नाम और व्यवसाय बताएं (बढ़ई, प्लंबर, इलेक्ट्रीशियन, आदि)",
        "अपने अनुभव के वर्षों का उल्लेख करें",
        "अपने कौशल और विशेषज्ञता की सूची बनाएं",
        "आपने जो परियोजनाएं पूरी की हैं उनका वर्णन करें",
        "अपना स्थान और संपर्क नंबर शामिल करें",
        "आप जो उपकरण उपयोग करना जानते हैं उन्हें जोड़ें"
      ]
    }
  };

  const languageOptions = [
    { code: 'english', label: 'English', flag: '🇺🇸' },
    { code: 'tamil', label: 'தமிழ்', flag: '🇮🇳' },
    { code: 'hindi', label: 'हिंदी', flag: '🇮🇳' }
  ];

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setShowLanguageMenu(false);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (JPG, PNG)');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setPhotoFile(file);
      setError('');

      // Create preview
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

  const handleTranscriptChange = (transcript) => {
    console.log('Transcript updated:', transcript);
    setFormData({ raw_input: transcript });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.raw_input.trim()) {
      setError('Please describe your work experience');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Step 1: Create profile
      const response = await axios.post('http://127.0.0.1:8000/resumes/', formData);
      const createdResume = response.data;
      
      // Step 2: Upload photo if provided
      if (photoFile && createdResume.id) {
        console.log('Uploading photo for resume ID:', createdResume.id);
        setUploadingPhoto(true);
        const photoFormData = new FormData();
        photoFormData.append('file', photoFile);

        try {
          const photoUploadResponse = await axios.post(
            `http://127.0.0.1:8000/resumes/${createdResume.id}/upload-photo`,
            photoFormData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );
          console.log('Photo upload response:', photoUploadResponse.data);
          
          // Fetch updated resume data with photo
          const updatedResponse = await axios.get(`http://127.0.0.1:8000/resumes/${createdResume.id}`);
          console.log('Updated resume with photo:', updatedResponse.data);
          console.log('Photo path:', updatedResponse.data.profile_photo);
          setResumeData(updatedResponse.data);
        } catch (photoErr) {
          console.error('Photo upload failed:', photoErr);
          // Still show success even if photo upload fails
          setResumeData(createdResume);
        } finally {
          setUploadingPhoto(false);
        }
      } else {
        console.log('No photo file to upload');
        setResumeData(createdResume);
      }

      setSuccess(true);
      setError('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create profile. Please try again.');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!resumeData?.id) return;

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/resumes/${resumeData.id}/download`,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${resumeData.full_name || 'profile'}_${resumeData.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to download PDF. Please try again.');
    }
  };

  const handleReset = () => {
    setFormData({ raw_input: '' });
    setPhotoFile(null);
    setPhotoPreview(null);
    setResumeData(null);
    setSuccess(false);
    setError('');
  };

  // Handle method selection
  const handleMethodSelect = (method) => {
    setInputMode(method);
    setMethodSelected(true);
  };

  return (
    <div className="min-h-screen pt-20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Show method selection screen if not selected yet */}
        {!methodSelected ? (
          <div className="animate-fade-in">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2563EB] to-[#1e40af] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#1e40af] mb-3">
                Describe Your Work
              </h1>
              <div className="w-20 h-1 bg-[#2563EB] mx-auto rounded-full mb-3"></div>
              <p className="text-base text-slate-600">
                Choose how you want to share your details
              </p>
            </div>

            {/* Method Selection Options - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
              {/* Type Details Option - Left Box */}
              <button
                onClick={() => handleMethodSelect('type')}
                className="h-[280px] p-6 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-2xl hover:border-blue-400 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group flex flex-col items-center justify-center text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-[#2563EB] to-[#1e40af] rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <span className="text-5xl">⌨️</span>
                </div>
                <h3 className="text-2xl font-bold text-[#1e40af] mb-2 group-hover:text-[#2563EB] transition-colors">
                  Type Details
                </h3>
                <p className="text-sm text-gray-600">
                  Write about your skills and experience using keyboard
                </p>
              </button>

              {/* Speak Details Option - Right Box */}
              <button
                onClick={() => handleMethodSelect('voice')}
                className="h-[280px] p-6 bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-2xl hover:border-green-400 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group flex flex-col items-center justify-center text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <span className="text-5xl">🎤</span>
                </div>
                <h3 className="text-2xl font-bold text-green-700 mb-2 group-hover:text-green-600 transition-colors">
                  Speak Details
                </h3>
                <p className="text-sm text-gray-600">
                  Tell us about your work using your voice
                </p>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-8 animate-fade-in">
              <div className="w-16 h-16 bg-[#2563EB] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#1F3A5F] mb-4">
                Describe Your Work
              </h1>
              <div className="w-24 h-1 bg-[#2563EB] mx-auto rounded-full mb-4"></div>
              <p className="text-lg text-slate-600">
                {inputMode === 'type' ? 'Type your details below' : 'Speak your details using microphone'}
              </p>
            </div>

            {/* Mode Toggle - Now just shows selected mode */}
            <div className="flex justify-center gap-4 mb-8">
              <button
                type="button"
                onClick={() => setInputMode('type')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  inputMode === 'type'
                    ? 'bg-[#2563EB] text-white shadow-lg'
                    : 'bg-white text-slate-600 border-2 border-slate-200 hover:border-[#2563EB]'
                }`}
              >
                <Keyboard className="w-5 h-5" />
                Type Details
              </button>
              <button
                type="button"
                onClick={() => setInputMode('voice')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  inputMode === 'voice'
                    ? 'bg-[#2563EB] text-white shadow-lg'
                    : 'bg-white text-slate-600 border-2 border-slate-200 hover:border-[#2563EB]'
                }`}
              >
                <Mic className="w-5 h-5" />
                Speak Details
              </button>
            </div>
          </>
        )}

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Instructions */}
              <div className="bg-blue-50 border-l-4 border-[#2563EB] p-4 rounded-r-xl relative">
                {/* Language Selector */}
                <div className="absolute top-4 right-4">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                      className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200"
                      title="Change language"
                    >
                      <Languages className="w-4 h-4 text-[#2563EB]" />
                      <span className="text-xs font-medium text-slate-600">Translate</span>
                      <span className="text-sm font-medium text-slate-700">
                        {languageOptions.find(l => l.code === language)?.flag}
                      </span>
                    </button>

                    {/* Language Dropdown */}
                    {showLanguageMenu && (
                      <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-10">
                        {languageOptions.map((option) => (
                          <button
                            key={option.code}
                            type="button"
                            onClick={() => handleLanguageChange(option.code)}
                            className={`w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors flex items-center gap-2 ${
                              language === option.code ? 'bg-blue-50 text-[#2563EB] font-semibold' : 'text-slate-700'
                            }`}
                          >
                            <span>{option.flag}</span>
                            <span className="text-sm">{option.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="font-semibold text-[#1F3A5F] mb-2 pr-16">
                  {translations[language].title}
                </h3>
                <ul className="text-sm text-slate-700 space-y-1">
                  {translations[language].instructions.map((instruction, index) => (
                    <li key={index}>• {instruction}</li>
                  ))}
                </ul>
              </div>

              {/* Input Mode: Type or Voice - MOVED UP */}
              <div>
                {inputMode === 'type' ? (
                  /* Type Mode */
                  <>
                    <label 
                      htmlFor="raw_input" 
                      className="block text-sm font-semibold text-[#1F3A5F] mb-2"
                    >
                      Your Work Experience
                    </label>
                    <textarea
                      id="raw_input"
                      name="raw_input"
                      rows="12"
                      value={formData.raw_input}
                      onChange={(e) => setFormData({ raw_input: e.target.value })}
                      placeholder="Example: My name is Rajesh Kumar. I am a carpenter with 10 years of experience. I specialize in furniture making, door and window fitting, and wooden flooring. I have completed over 100 projects in Delhi. I know how to use circular saw, drill machine, and other carpentry tools. Contact: 9876543210"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 resize-none text-slate-700"
                      disabled={loading}
                    />
                    <p className="text-sm text-slate-500 mt-2">
                      You can write in English, Hindi, Tamil, or any language you're comfortable with.
                    </p>
                  </>
                ) : (
                  /* Voice Mode */
                  <div className="space-y-6">
                    {/* Language Selector for Voice */}
                    <div>
                      <label className="block text-sm font-semibold text-[#1F3A5F] mb-2">
                        Select Language for Speech
                      </label>

              {/* Photo Upload Section - MOVED DOWN */}
              <div className="bg-slate-50 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Camera className="w-5 h-5 text-[#1F3A5F]" />
                  <h3 className="font-semibold text-[#1F3A5F]">
                    Profile Photo (Optional)
                  </h3>
                </div>

                {!photoPreview ? (
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-[#2563EB] transition-colors duration-200">
                    <input
                      type="file"
                      id="photo-upload"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="cursor-pointer flex flex-col items-center gap-3"
                    >
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-[#2563EB]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#1F3A5F] mb-1">
                          Click to upload photo
                        </p>
                        <p className="text-sm text-slate-500">
                          JPG or PNG, max 5MB
                        </p>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="relative inline-block">
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
                )}

                <p className="text-xs text-slate-500 mt-3">
                  Adding a photo helps employers recognize you and builds trust
                </p>
              </div>
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white text-slate-700"
                      >
                        <option value="english">English</option>
                        <option value="tamil">Tamil (தமிழ்)</option>
                        <option value="hindi">Hindi (हिंदी)</option>
                      </select>
                    </div>

                    {/* Instructions - Multilingual */}
                    <div className="bg-blue-50 border-l-4 border-[#2563EB] p-4 rounded-r-xl relative">
                      {/* Language Selector */}
                      <div className="absolute top-4 right-4">
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                            className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200"
                            title="Change language"
                          >
                            <Languages className="w-4 h-4 text-[#2563EB]" />
                            <span className="text-xs font-medium text-slate-600">Translate</span>
                            <span className="text-sm font-medium text-slate-700">
                              {languageOptions.find(l => l.code === language)?.flag}
                            </span>
                          </button>

                          {/* Language Dropdown */}
                          {showLanguageMenu && (
                            <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-10">
                              {languageOptions.map((option) => (
                                <button
                                  key={option.code}
                                  type="button"
                                  onClick={() => handleLanguageChange(option.code)}
                                  className={`w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors flex items-center gap-2 ${
                                    language === option.code ? 'bg-blue-50 text-[#2563EB] font-semibold' : 'text-slate-700'
                                  }`}
                                >
                                  <span>{option.flag}</span>
                                  <span className="text-sm">{option.label}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <h3 className="font-semibold text-[#1F3A5F] mb-2 pr-16">
                        {translations[language].title}
                      </h3>
                      <ul className="text-sm text-slate-700 space-y-1">
                        {translations[language].instructions.map((instruction, index) => (
                          <li key={index}>• {instruction}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Voice Recorder */}
                    <VoiceRecorder
                      language={selectedLanguage}
                      onTranscriptChange={handleTranscriptChange}
                      currentTranscript={formData.raw_input}
                    />

                    {/* Editable Transcript */}
                    {formData.raw_input && (
                      <div>
                        <label className="block text-sm font-semibold text-[#1F3A5F] mb-2">
                          Edit Your Transcript (if needed)
                        </label>
                        <textarea
                          rows="8"
                          value={formData.raw_input}
                          onChange={(e) => setFormData({ raw_input: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 resize-none text-slate-700"
                          disabled={loading}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !formData.raw_input.trim()}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#1F3A5F] text-white rounded-xl font-semibold shadow-lg hover:bg-[#152a45] transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {uploadingPhoto ? 'Uploading Photo...' : 'Creating Your Profile...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Professional Profile
                  </>
                )}
              </button>
              
              {/* Helper text for disabled button */}
              {!formData.raw_input.trim() && (
                <p className="text-center text-sm text-slate-500">
                  {inputMode === 'voice' 
                    ? 'Please speak your details using the microphone above'
                    : 'Please describe your work experience to continue'
                  }
                </p>
              )}
            </form>
          ) : (
            /* Success State */
            <div className="space-y-6 animate-fade-in">
              {/* Success Message */}
              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-green-900 mb-1">
                      Profile Created Successfully!
                    </h3>
                    <p className="text-green-700 text-sm">
                      Your professional profile has been generated using AI.
                      {photoFile && ' Your photo has been uploaded.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Profile Summary with Photo */}
              <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                <div className="flex items-start gap-6">
                  {/* Profile Photo */}
                  {(resumeData.profile_photo || photoPreview) && (
                    <div className="flex-shrink-0">
                      <img
                        src={resumeData.profile_photo 
                          ? `http://127.0.0.1:8000${resumeData.profile_photo.startsWith('/') ? '' : '/'}${resumeData.profile_photo}`
                          : photoPreview
                        }
                        alt="Profile"
                        className="w-24 h-24 rounded-xl object-cover border-4 border-white shadow-lg"
                      />
                    </div>
                  )}

                  {/* Profile Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#1F3A5F] mb-4">
                      Profile Summary
                    </h3>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      {resumeData.full_name && (
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Name</p>
                          <p className="font-semibold text-slate-900">{resumeData.full_name}</p>
                        </div>
                      )}
                      
                      {resumeData.primary_trade && (
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Trade</p>
                          <p className="font-semibold text-slate-900">{resumeData.primary_trade}</p>
                        </div>
                      )}
                      
                      {resumeData.years_of_experience && (
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Experience</p>
                          <p className="font-semibold text-slate-900">{resumeData.years_of_experience}</p>
                        </div>
                      )}
                      
                      {resumeData.phone_number && (
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Phone</p>
                          <p className="font-semibold text-slate-900">{resumeData.phone_number}</p>
                        </div>
                      )}
                      
                      {resumeData.village_or_city && (
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Location</p>
                          <p className="font-semibold text-slate-900">
                            {resumeData.village_or_city}
                            {resumeData.district && `, ${resumeData.district}`}
                            {resumeData.state && `, ${resumeData.state}`}
                          </p>
                        </div>
                      )}
                      
                      {resumeData.projects_completed && (
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Projects Completed</p>
                          <p className="font-semibold text-slate-900">{resumeData.projects_completed}+</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {resumeData.resume_score && (
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Profile Quality Score</span>
                      <span className="text-2xl font-bold text-[#2563EB]">
                        {resumeData.resume_score}/100
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-[#2563EB] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${resumeData.resume_score}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => window.location.href = `/profile?id=${resumeData.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#2563EB] text-white rounded-xl font-semibold shadow-lg hover:bg-[#1d4ed8] transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <User className="w-5 h-5" />
                  View My Profile
                </button>
                
                <button
                  onClick={handleDownloadPDF}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#1F3A5F] text-white rounded-xl font-semibold shadow-lg hover:bg-[#152a45] transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <Download className="w-5 h-5" />
                  Download PDF Profile
                </button>
                
                <button
                  onClick={handleReset}
                  className="flex-1 px-6 py-4 bg-white text-[#1F3A5F] border-2 border-[#1F3A5F] rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300"
                >
                  Create Another Profile
                </button>
              </div>

              {/* Additional Info */}
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-sm text-slate-600">
                  Your profile ID is <span className="font-bold text-[#1F3A5F]">#{resumeData.id}</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Save this ID to access your profile later
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-slate-50 rounded-2xl p-6">
          <h3 className="font-bold text-[#1F3A5F] mb-3">Need Help?</h3>
          <p className="text-sm text-slate-600 mb-3">
            Our AI will automatically extract information from your description and create a professional profile.
          </p>
          <ul className="text-sm text-slate-600 space-y-2">
            <li>✓ Works with any language (English, Hindi, Tamil, etc.)</li>
            <li>✓ No need for perfect grammar or formatting</li>
            <li>✓ Just describe your work naturally</li>
            <li>✓ AI will organize everything professionally</li>
            <li>✓ Adding a photo makes your profile more trustworthy</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ParagraphPage;
