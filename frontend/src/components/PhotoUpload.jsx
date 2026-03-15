/**
 * PhotoUpload Component
 * Handles profile photo upload for workers
 */
import { useState } from 'react';
import { uploadPhoto, getPhotoUrl } from '../services/api';

const PhotoUpload = ({ workerId, currentPhotoUrl, onPhotoUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(currentPhotoUrl);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a JPG or PNG image');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size must be less than 5MB');
      return;
    }

    setError('');
    setUploading(true);

    try {
      // Upload photo
      const response = await uploadPhoto(workerId, file);
      
      // Update preview
      const newPhotoUrl = `${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}${response.photo_url}`;
      setPreview(newPhotoUrl);
      
      // Notify parent component
      if (onPhotoUploaded) {
        onPhotoUploaded(newPhotoUrl);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Photo</h3>
      
      {/* Photo Preview */}
      <div className="flex items-center gap-6 mb-4">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
          {preview ? (
            <img 
              src={preview} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </div>
        
        <div className="flex-1">
          <label className="block">
            <span className="sr-only">Choose profile photo</span>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileSelect}
              disabled={uploading}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-primary-50 file:text-primary-700
                hover:file:bg-primary-100
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </label>
          <p className="mt-2 text-xs text-gray-500">
            JPG or PNG. Max size 5MB.
          </p>
        </div>
      </div>

      {/* Upload Status */}
      {uploading && (
        <div className="flex items-center gap-2 text-blue-600">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Uploading...</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
