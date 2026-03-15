/**
 * ResumeForm Component
 * Handles raw resume text input and submission
 */
import { useState } from 'react';

const ResumeForm = ({ onResumeGenerated }) => {
  const [rawInput, setRawInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!rawInput.trim()) {
      setError('Please enter your profile information');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Call parent callback with raw input
      await onResumeGenerated({ raw_input: rawInput });
      
      // Clear form on success
      // setRawInput(''); // Keep input for reference
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setRawInput('');
    setError('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Create Your Skilled Worker Profile
      </h2>
      <p className="text-gray-600 mb-6">
        Enter your details below in any language (English, Tamil, Hindi). 
        Our AI will extract and structure your information automatically.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label 
            htmlFor="rawInput" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Profile Information
          </label>
          <textarea
            id="rawInput"
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder="Example: My name is Kumar. Phone: +91-9876543210. I am a Plumber with 5 years experience in Chennai. I specialize in pipe fitting, bathroom installation, and water heater repairs. Available for daily wage work. Can travel up to 10km. Completed 50+ projects. Know how to use pipe wrench, threading machine, soldering tools. Expected wage: ₹800 per day."
            className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || !rawInput.trim()}
            className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Profile...
              </span>
            ) : (
              '🚀 Generate Profile'
            )}
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Clear
          </button>
        </div>
      </form>

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 Tip:</strong> Include your name, phone, trade (carpenter/plumber/electrician), experience, specializations, location, and service details for best results.
        </p>
      </div>
    </div>
  );
};

export default ResumeForm;
