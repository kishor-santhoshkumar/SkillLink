import { useState, useEffect } from 'react';
import { Briefcase, Plus, Users, MapPin, Wrench, DollarSign, Clock, X, Eye } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CompanyJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [posting, setPosting] = useState(false);

  const [formData, setFormData] = useState({
    client_name: '',
    phone_number: '',
    location: '',
    required_trade: '',
    job_description: '',
    budget: ''
  });

  const trades = ['Carpenter', 'Plumber', 'Electrician', 'Mechanic', 'Mason', 'Painter', 'Welder'];

  useEffect(() => {
    fetchJobs();
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://127.0.0.1:8000/jobs/', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Job posted successfully!');
      setShowPostModal(false);
      setFormData({
        client_name: '',
        phone_number: '',
        location: '',
        required_trade: '',
        job_description: '',
        budget: ''
      });
      fetchJobs();
    } catch (error) {
      console.error('Error posting job:', error);
      const errorMsg = error.response?.data?.detail || 'Failed to post job. Please try again.';
      alert(errorMsg);
    } finally {
      setPosting(false);
    }
  };

  const handleViewApplicants = async (job) => {
    setSelectedJob(job);
    setShowApplicantsModal(true);
    // Fetch real applicants from API
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://127.0.0.1:8000/jobs/${job.id}/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplicants(response.data);
    } catch (error) {
      console.error('Error fetching applicants:', error);
      setApplicants([]);
    }
  };

  const handleAcceptWorker = async (applicationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://127.0.0.1:8000/jobs/applications/${applicationId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Worker accepted successfully! Job remains open for more applicants.');
      // Refresh applicants list
      if (selectedJob) {
        handleViewApplicants(selectedJob);
      }
      fetchJobs();
    } catch (error) {
      console.error('Error accepting worker:', error);
      const errorMsg = error.response?.data?.detail || 'Failed to accept worker. Please try again.';
      alert(errorMsg);
    }
  };

  const handleCloseJob = async (jobId) => {
    if (!confirm('Are you sure you want to close this job? No more workers will be able to apply.')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://127.0.0.1:8000/jobs/${jobId}/close`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Job closed successfully!');
      fetchJobs();
    } catch (error) {
      console.error('Error closing job:', error);
      const errorMsg = error.response?.data?.detail || 'Failed to close job. Please try again.';
      alert(errorMsg);
    }
  };

  const handleReopenJob = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://127.0.0.1:8000/jobs/${jobId}/reopen`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Job reopened successfully!');
      fetchJobs();
    } catch (error) {
      console.error('Error reopening job:', error);
      const errorMsg = error.response?.data?.detail || 'Failed to reopen job. Please try again.';
      alert(errorMsg);
    }
  };

  const getAcceptedCount = (jobId) => {
    // This would need to be fetched from API, for now return from applicants if available
    return 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <div className="w-16 h-16 bg-gradient-to-br from-[#2563EB] to-[#1F3A5F] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#1F3A5F] mb-2">
              Manage Jobs
            </h1>
            <p className="text-lg text-slate-600">
              Post jobs and manage applicants
            </p>
          </div>
          <button
            onClick={() => setShowPostModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            Post New Job
          </button>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 shadow-md">
            <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">No jobs posted yet.</p>
            <button
              onClick={() => setShowPostModal(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              Post Your First Job
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, index) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 hover:-translate-y-1 hover:shadow-xl hover:border-blue-300 hover:shadow-blue-200 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    job.status === 'open' ? 'bg-green-100 text-green-700' :
                    job.status === 'closed' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {job.status?.toUpperCase() || 'OPEN'}
                  </span>
                </div>

                {/* Job Title */}
                <h3 className="text-xl font-bold text-[#1F3A5F] mb-4">
                  {job.required_trade} Position
                </h3>

                {/* Job Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-[#2563EB]" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Wrench className="w-4 h-4 text-[#2563EB]" />
                    <span>{job.required_trade}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <DollarSign className="w-4 h-4 text-[#2563EB]" />
                    <span>₹{job.budget || 'Negotiable'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4 text-[#2563EB]" />
                    <span>{job.phone_number}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleViewApplicants(job)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl font-semibold shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <Users className="w-5 h-5" />
                    View Applicants
                  </button>
                  
                  {job.status === 'open' ? (
                    <button
                      onClick={() => handleCloseJob(job.id)}
                      className="w-full bg-red-100 text-red-700 px-4 py-2 rounded-xl font-semibold hover:bg-red-200 transition-all duration-300"
                    >
                      Close Job
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReopenJob(job.id)}
                      className="w-full bg-green-100 text-green-700 px-4 py-2 rounded-xl font-semibold hover:bg-green-200 transition-all duration-300"
                    >
                      Reopen Job
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Job Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#1F3A5F]">Post New Job</h3>
              <button
                onClick={() => setShowPostModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handlePostJob} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="client_name"
                    value={formData.client_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    placeholder="Your company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Trade Required *
                  </label>
                  <select
                    name="required_trade"
                    value={formData.required_trade}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  >
                    <option value="">Select Trade</option>
                    {trades.map(trade => (
                      <option key={trade} value={trade}>{trade}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    placeholder="e.g., Mumbai, Maharashtra"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Budget (Optional)
                  </label>
                  <input
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    placeholder="e.g., ₹25,000 - ₹30,000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Job Description *
                </label>
                <textarea
                  name="job_description"
                  value={formData.job_description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                  placeholder="Describe the job requirements, responsibilities, and qualifications..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  disabled={posting}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={posting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  {posting ? 'Posting...' : 'Post Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Applicants Modal */}
      {showApplicantsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-3xl w-full shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-[#1F3A5F]">
                  Applicants for {selectedJob?.required_trade} Position
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  {applicants.filter(a => a.status === 'accepted').length} worker(s) accepted • 
                  {applicants.filter(a => a.status === 'pending').length} pending
                </p>
              </div>
              <button
                onClick={() => setShowApplicantsModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {applicants.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">No applicants yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applicants.map(applicant => (
                  <div
                    key={applicant.id}
                    className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-[#1F3A5F] mb-2">
                          {applicant.worker_name || 'Worker'}
                        </h4>
                        <div className="space-y-1 text-sm text-slate-600">
                          <p><span className="font-medium">Trade:</span> {applicant.worker_trade || 'N/A'}</p>
                          <p><span className="font-medium">Phone:</span> {applicant.worker_phone || 'N/A'}</p>
                          <p><span className="font-medium">Status:</span> <span className={`font-semibold ${
                            applicant.status === 'accepted' ? 'text-green-600' :
                            applicant.status === 'rejected' ? 'text-red-600' :
                            'text-yellow-600'
                          }`}>{applicant.status.toUpperCase()}</span></p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {/* View Profile Button */}
                        <button
                          onClick={() => navigate(`/worker/${applicant.worker_id}`)}
                          className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-semibold hover:bg-slate-200 transition-all duration-300"
                        >
                          <Eye className="w-4 h-4" />
                          View Profile
                        </button>
                        
                        {/* Accept Button */}
                        {applicant.status === 'pending' && (
                          <button
                            onClick={() => handleAcceptWorker(applicant.id)}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                          >
                            Accept
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyJobs;
