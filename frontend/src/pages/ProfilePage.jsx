import React from 'react';
import { User } from 'lucide-react';

const ProfilePage = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#2563EB] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1F3A5F] mb-4">
            My Profile
          </h1>
          <div className="w-24 h-1 bg-[#2563EB] mx-auto rounded-full mb-4"></div>
          <p className="text-lg text-slate-600">
            View and manage your professional profile
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <p className="text-slate-600 mb-6">
            This is the profile page. The existing ResumePreview component will be integrated here.
          </p>
          
          {/* Placeholder for existing functionality */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center">
            <p className="text-[#1F3A5F] font-semibold">
              Existing ResumePreview and profile management will be placed here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
