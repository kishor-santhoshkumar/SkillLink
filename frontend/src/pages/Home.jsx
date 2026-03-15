/**
 * Home Page Component
 * Main page that orchestrates the worker profile generation flow
 */
import { useState } from 'react';
import ResumeForm from '../components/ResumeForm';
import ResumePreview from '../components/ResumePreview';
import ScoreCard from '../components/ScoreCard';
import PhotoUpload from '../components/PhotoUpload';
import ReviewSection from '../components/ReviewSection';
import { createResume, downloadResume } from '../services/api';

const Home = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);

  const handleResumeGenerated = async (data) => {
    try {
      setLoading(true);
      setError('');
      
      // Call API to create profile
      const response = await createResume(data);
      setResume(response);
      setShowPhotoUpload(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUploaded = (photoUrl) => {
    // Update resume with new photo
    if (resume) {
      setResume({ ...resume, profile_photo: photoUrl });
    }
  };

  const handleDownload = () => {
    if (resume?.id) {
      downloadResume(resume.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            SkillLink
          </h1>
          <p className="text-xl text-gray-600">
            AI-Powered Skilled Worker Hiring Platform
          </p>
          <p className="text-gray-500 mt-2">
            For Carpenters, Plumbers, Electricians, Mechanics & More
          </p>
          
          {/* Navigation */}
          <div className="mt-6 flex justify-center gap-4">
            <a 
              href="/" 
              className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Create Profile
            </a>
            <a 
              href="/jobs" 
              className="px-6 py-2 border-2 border-primary-600 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              View Jobs
            </a>
          </div>
        </header>

        {/* Profile Form */}
        <ResumeForm onResumeGenerated={handleResumeGenerated} />

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Photo Upload (only show after profile created) */}
        {resume && showPhotoUpload && (
          <PhotoUpload 
            workerId={resume.id} 
            currentPhotoUrl={resume.profile_photo}
            onPhotoUploaded={handlePhotoUploaded}
          />
        )}

        {/* Profile Preview */}
        <ResumePreview resume={resume} />

        {/* Score Card */}
        {resume && <ScoreCard resumeId={resume.id} />}

        {/* Review Section */}
        {resume && <ReviewSection workerId={resume.id} />}

        {/* Download Button */}
        {resume && (
          <div className="text-center mb-8">
            <button
              onClick={handleDownload}
              className="bg-green-600 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              📥 Download PDF Profile
            </button>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm mt-12 pb-8">
          <p>Powered by Groq AI • Multi-language Support • Instant PDF Generation</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
