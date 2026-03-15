import { useState, useEffect } from 'react';
import { Briefcase, MapPin, Wrench, Clock, DollarSign, Filter } from 'lucide-react';
import axios from 'axios';

const JobsWorker = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTrade, setFilterTrade] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applying, setApplying] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState(new Set()); // Track applied job IDs

  const trades = ['Carpenter', 'Plumber', 'Electrician', 'Mechanic', 'Mason', 'Painter', 'Welder'];

  useEffect(() => {
    fetchJobs();
    fetchMyApplications();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/jobs/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/jobs/my-applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Create a Set of job IDs that the user has applied to
      const appliedJobIds = new Set(response.data.map(app => app.job_id));
      setAppliedJobs(appliedJobIds);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleApplyClick = (job) => {
    // Check if already applied
    if (appliedJobs.has(job.id)) {
      alert('You have already applied for this job');
      return;
    }
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  const handleApplyConfirm = async () => {
    setApplying(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://127.0.0.1:8000/jobs/${selectedJob.id}/apply`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Application sent successfully!');
      // Add job to applied jobs set
      setAppliedJobs(prev => new Set([...prev, selectedJob.id]));
      setShowApplyModal(false);
      setSelectedJob(null);
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to apply. Please try again.';
      alert(errorMsg);
    } finally {
      setApplying(false);
    }
  };

  const handleCancelApplication = async (jobId) => {
    if (!confirm('Are you sure you want to cancel your application?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://127.0.0.1:8000/jobs/${jobId}/cancel-application`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Application cancelled successfully!');
      // Remove job from applied jobs set
      setAppliedJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to cancel application. Please try again.';
      alert(errorMsg);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesTrade = !filterTrade || job.required_trade === filterTrade;
    const matchesLocation = !filterLocation || job.location?.toLowerCase().includes(filterLocation.toLowerCase());
    return matchesTrade && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-16 h-16 bg-gradient-to-br from-[#3b82f6] to-[#1e40af] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#1e40af] mb-4">
            Available Jobs
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore jobs posted by companies and apply instantly
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-[#2563EB]" />
            <h3 className="font-semibold text-[#1F3A5F]">Filter Jobs</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Trade
              </label>
              <select
                value={filterTrade}
                onChange={(e) => setFilterTrade(e.target.value)}
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              >
                <option value="">All Trades</option>
                {trades.map(trade => (
                  <option key={trade} value={trade}>{trade}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                placeholder="Search location..."
                className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterTrade('');
                  setFilterLocation('');
                }}
                className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all duration-300 font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">No jobs found matching your filters.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job, index) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 hover:-translate-y-1 hover:shadow-xl hover:border-blue-300 hover:shadow-blue-200 transition-all duration-300 animate-fade-in-stagger"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Job Title */}
                <h3 className="text-xl font-bold text-[#1e40af] mb-2">
                  {job.required_trade} Position
                </h3>

                {/* Company Name */}
                <p className="text-slate-600 font-medium mb-4">
                  {job.client_name}
                </p>

                {/* Job Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-[#2563EB]" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Wrench className="w-4 h-4 text-[#2563EB]" />
                    <span>Trade: {job.required_trade}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <DollarSign className="w-4 h-4 text-[#2563EB]" />
                    <span>Budget: {job.budget || 'Negotiable'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4 text-[#2563EB]" />
                    <span>Contact: {job.phone_number}</span>
                  </div>
                </div>

                {/* Apply Button or Applied Status */}
                {appliedJobs.has(job.id) ? (
                  <div className="flex gap-2">
                    <button
                      disabled
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-xl font-semibold shadow-md cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Applied
                    </button>
                    <button
                      onClick={() => handleCancelApplication(job.id)}
                      className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleApplyClick(job)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl font-semibold shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Apply Confirmation Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
            <h3 className="text-2xl font-bold text-[#1e40af] mb-4">
              Apply for this job?
            </h3>
            <p className="text-slate-600 mb-6">
              You are applying for: <span className="font-semibold">{selectedJob?.required_trade} position at {selectedJob?.client_name}</span>
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowApplyModal(false)}
                disabled={applying}
                className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyConfirm}
                disabled={applying}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {applying ? 'Applying...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsWorker;
