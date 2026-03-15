/**
 * Jobs Page
 * Displays job posting form and job listings
 */
import { useState } from 'react';
import JobPostingForm from '../components/JobPostingForm';
import JobList from '../components/JobList';

const Jobs = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleJobCreated = () => {
    // Refresh job list
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Job Marketplace
          </h1>
          <p className="text-xl text-gray-600">
            Post jobs or find work opportunities
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Post Job */}
          <div>
            <JobPostingForm onJobCreated={handleJobCreated} />
          </div>

          {/* Right Column - Job List */}
          <div>
            <JobList key={refreshKey} filterStatus="open" />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm mt-12 pb-8">
          <p>Connect skilled workers with job opportunities</p>
        </footer>
      </div>
    </div>
  );
};

export default Jobs;
