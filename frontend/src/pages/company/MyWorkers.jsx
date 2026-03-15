import { useState, useEffect } from 'react';
import { Users, Clock, CheckCircle, Star } from 'lucide-react';
import axios from 'axios';

const MyWorkers = () => {
  const [activeTab, setActiveTab] = useState('in-progress');
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [hasExistingRating, setHasExistingRating] = useState(false);

  // Helper function to construct photo URL
  const getPhotoUrl = (photoPath) => {
    if (!photoPath) return null;
    
    // Normalize path separators (Windows uses backslashes)
    const normalizedPath = photoPath.replace(/\\/g, '/');
    
    // If it's already a full URL
    if (normalizedPath.startsWith('http')) {
      return normalizedPath;
    }
    // If it starts with /uploads/, use as is
    if (normalizedPath.startsWith('/uploads/')) {
      return `http://127.0.0.1:8000${normalizedPath}`;
    }
    // If it starts with uploads/ (no leading slash)
    if (normalizedPath.startsWith('uploads/')) {
      return `http://127.0.0.1:8000/${normalizedPath}`;
    }
    // If it's just the filename
    if (!normalizedPath.includes('/')) {
      return `http://127.0.0.1:8000/uploads/${normalizedPath}`;
    }
    // Default: prepend base URL
    return `http://127.0.0.1:8000/${normalizedPath}`;
  };

  useEffect(() => {
    fetchMyWorkers();
  }, [activeTab]);

  const fetchMyWorkers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://127.0.0.1:8000/jobs/my-workers?status=${activeTab}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWorkers(response.data);
    } catch (error) {
      console.error('Error fetching workers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = async (jobId) => {
    if (!confirm('Mark this job as completed?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://127.0.0.1:8000/jobs/${jobId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Job marked as completed!');
      fetchMyWorkers(); // Refresh list
    } catch (error) {
      console.error('Error marking job as completed:', error);
      alert('Failed to mark job as completed');
    }
  };

  const handleRateWorker = async (worker) => {
    setSelectedWorker(worker);
    setRating(0);
    setHasExistingRating(false);
    
    // Check if company has already rated this worker
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://127.0.0.1:8000/resumes/${worker.worker_id}/reviews`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Check if current company has already submitted a review
      const companyUser = JSON.parse(localStorage.getItem('user'));
      const existingReview = response.data.find(review => 
        review.client_name === companyUser?.username || review.client_name === 'Company'
      );
      
      if (existingReview) {
        setRating(existingReview.rating);
        setHasExistingRating(true);
      }
    } catch (error) {
      console.error('Error checking existing rating:', error);
    }
    
    setShowRatingModal(true);
  };

  const submitRating = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const companyUser = JSON.parse(localStorage.getItem('user'));
      
      await axios.post(
        `http://127.0.0.1:8000/resumes/${selectedWorker.worker_id}/reviews`,
        {
          client_name: companyUser?.username || 'Company',
          rating: rating,
          comment: ''
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert(hasExistingRating ? 'Rating updated successfully!' : 'Rating submitted successfully!');
      setShowRatingModal(false);
      fetchMyWorkers(); // Refresh to show updated rating
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-progress':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'in-progress':
        return <Clock className="w-5 h-5" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const tabs = [
    { id: 'in-progress', label: 'In Progress', icon: Clock, color: 'blue' },
    { id: 'completed', label: 'Completed', icon: CheckCircle, color: 'green' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#3b82f6] to-[#1e40af] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[#1e40af] mb-2">
            My Workers
          </h1>
          <p className="text-lg text-slate-600">
            Track and manage your hired workers
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-md p-2 mb-8">
          <div className="grid grid-cols-2 gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-r from-${tab.color}-500 to-${tab.color}-600 text-white shadow-md`
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Workers List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading workers...</p>
          </div>
        ) : workers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-md">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 text-lg">No workers in this category</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workers.map((worker, index) => (
              <div
                key={worker.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 hover:-translate-y-1 hover:shadow-xl hover:border-blue-300 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Worker Photo */}
                <div className="flex justify-center mb-4">
                  {worker.profile_photo ? (
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-100">
                      <img
                        src={getPhotoUrl(worker.profile_photo)}
                        alt={worker.worker_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center"><svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div>';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border-4 border-blue-100">
                      <Users className="w-12 h-12 text-blue-600" />
                    </div>
                  )}
                </div>

                {/* Worker Name */}
                <h3 className="text-xl font-bold text-[#1e40af] text-center mb-2">
                  {worker.worker_name}
                </h3>

                {/* Trade */}
                <p className="text-center text-slate-600 mb-3">
                  {worker.worker_trade}
                </p>

                {/* Job Title */}
                <div className="bg-slate-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-slate-600 text-center">
                    {worker.job_title}
                  </p>
                </div>

                {/* Status Badge */}
                <div className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg mb-3 ${getStatusColor(activeTab)}`}>
                  {getStatusIcon(activeTab)}
                  <span className="text-sm font-semibold capitalize">
                    {activeTab.replace('-', ' ')}
                  </span>
                </div>

                {/* Current Rating */}
                {worker.rating > 0 && (
                  <div className="flex items-center justify-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < worker.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                {activeTab === 'in-progress' && (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleRateWorker(worker)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl font-semibold shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <Star className="w-4 h-4" />
                      Rate Worker
                    </button>
                    <button
                      onClick={() => handleMarkCompleted(worker.job_id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark Completed
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
            <h3 className="text-2xl font-bold text-[#1e40af] mb-4 text-center">
              {hasExistingRating ? 'Update Rating' : 'Rate'} {selectedWorker?.worker_name}
            </h3>
            <p className="text-slate-600 mb-6 text-center">
              {hasExistingRating 
                ? 'Update your rating for this worker\'s performance' 
                : 'How would you rate this worker\'s performance?'}
            </p>
            
            {/* Star Rating */}
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-12 h-12 ${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowRatingModal(false)}
                className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={submitRating}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                {hasExistingRating ? 'Resubmit Rating' : 'Submit Rating'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyWorkers;
