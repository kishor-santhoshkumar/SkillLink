/**
 * API Service for SkillLink Backend
 * Handles all HTTP requests to the FastAPI backend
 */
import axios from 'axios';

// Base URL for API - uses proxy in development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout for AI processing
});

// Add request interceptor to automatically include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('API Request:', config.method.toUpperCase(), config.url);
      console.log('Token present:', !!token);
    } else {
      console.warn('No token found in localStorage for request:', config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('401 Unauthorized - Token may be invalid or expired');
      console.error('Request URL:', error.config?.url);
      console.error('Token in request:', error.config?.headers?.Authorization ? 'Present' : 'Missing');
    }
    return Promise.reject(error);
  }
);

/**
 * Create a new resume from raw text input
 * @param {Object} data - Resume data object
 * @param {string} data.raw_input - Raw resume text
 * @returns {Promise} Resume response with extracted data
 */
export const createResume = async (data) => {
  try {
    const response = await api.post('/resumes/', data);
    return response.data;
  } catch (error) {
    console.error('Error creating resume:', error);
    throw error;
  }
};

/**
 * Get resume quality score and feedback
 * @param {number} id - Resume ID
 * @returns {Promise} Score object with score and feedback
 */
export const getResumeScore = async (id) => {
  try {
    const response = await api.get(`/resumes/${id}/score`);
    return response.data;
  } catch (error) {
    console.error('Error fetching resume score:', error);
    throw error;
  }
};

/**
 * Get resume by ID
 * @param {number} id - Resume ID
 * @returns {Promise} Resume data
 */
export const getResume = async (id) => {
  try {
    const response = await api.get(`/resumes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching resume:', error);
    throw error;
  }
};

/**
 * Download resume as PDF
 * Opens PDF in new tab
 * @param {number} id - Resume ID
 */
export const downloadResume = (id) => {
  const downloadUrl = `${API_BASE_URL}/resumes/${id}/download`;
  window.open(downloadUrl, '_blank');
};

// ============================================================
// PHOTO UPLOAD API
// ============================================================

/**
 * Upload profile photo for a worker
 * @param {number} id - Worker ID
 * @param {File} file - Image file
 * @returns {Promise} Upload response with photo URL
 */
export const uploadPhoto = async (id, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(
      `${API_BASE_URL}/resumes/${id}/upload-photo`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw error;
  }
};

/**
 * Get photo URL for a worker
 * @param {number} id - Worker ID
 * @returns {string} Photo URL
 */
export const getPhotoUrl = (id) => {
  return `${API_BASE_URL}/resumes/${id}/photo`;
};

// ============================================================
// REVIEW API
// ============================================================

/**
 * Add a review for a worker
 * @param {number} workerId - Worker ID
 * @param {Object} reviewData - Review data
 * @param {string} reviewData.client_name - Client name
 * @param {number} reviewData.rating - Rating (1-5)
 * @param {string} reviewData.comment - Optional comment
 * @returns {Promise} Created review
 */
export const addReview = async (workerId, reviewData) => {
  try {
    const response = await api.post(`/resumes/${workerId}/reviews`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

/**
 * Get all reviews for a worker
 * @param {number} workerId - Worker ID
 * @returns {Promise} Array of reviews
 */
export const getReviews = async (workerId) => {
  try {
    const response = await api.get(`/resumes/${workerId}/reviews`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

/**
 * Get review statistics for a worker
 * @param {number} workerId - Worker ID
 * @returns {Promise} Review stats (count, average)
 */
export const getReviewStats = async (workerId) => {
  try {
    const response = await api.get(`/resumes/${workerId}/reviews/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching review stats:', error);
    throw error;
  }
};

// ============================================================
// JOB REQUEST API
// ============================================================

/**
 * Create a new job request
 * @param {Object} jobData - Job request data
 * @returns {Promise} Created job request
 */
export const createJob = async (jobData) => {
  try {
    const response = await api.post('/jobs/', jobData);
    return response.data;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

/**
 * Get all job requests with optional filters
 * @param {Object} filters - Optional filters
 * @param {string} filters.status - Filter by status (open, assigned, completed)
 * @param {string} filters.trade - Filter by trade
 * @returns {Promise} Array of job requests
 */
export const getJobs = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.trade) params.append('trade', filters.trade);
    
    const response = await api.get(`/jobs/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

/**
 * Get a specific job request by ID
 * @param {number} jobId - Job ID
 * @returns {Promise} Job request data
 */
export const getJob = async (jobId) => {
  try {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching job:', error);
    throw error;
  }
};

/**
 * Assign a worker to a job
 * @param {number} jobId - Job ID
 * @param {number} workerId - Worker ID
 * @returns {Promise} Updated job request
 */
export const assignWorkerToJob = async (jobId, workerId) => {
  try {
    const response = await api.patch(`/jobs/${jobId}/assign/${workerId}`);
    return response.data;
  } catch (error) {
    console.error('Error assigning worker:', error);
    throw error;
  }
};

/**
 * Get jobs for a specific trade
 * @param {string} trade - Trade name
 * @returns {Promise} Array of job requests
 */
export const getJobsByTrade = async (trade) => {
  try {
    const response = await api.get(`/jobs/trade/${trade}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs by trade:', error);
    throw error;
  }
};

export default api;



// ============================================================
// COMPANY API
// ============================================================

/**
 * Create a company profile
 * @param {Object} companyData - Company data
 * @returns {Promise} Created company profile
 */
export const createCompany = async (companyData) => {
  try {
    const response = await api.post('/companies/', companyData);
    return response.data;
  } catch (error) {
    console.error('Error creating company:', error);
    throw error;
  }
};

/**
 * Get current user's company profile
 * @returns {Promise} Company profile
 */
export const getMyCompany = async () => {
  try {
    const response = await api.get('/companies/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching company:', error);
    throw error;
  }
};

/**
 * Update company profile
 * @param {number} companyId - Company ID
 * @param {Object} companyData - Updated company data
 * @returns {Promise} Updated company profile
 */
export const updateCompany = async (companyId, companyData) => {
  try {
    const response = await api.put(`/companies/${companyId}`, companyData);
    return response.data;
  } catch (error) {
    console.error('Error updating company:', error);
    throw error;
  }
};

// ============================================================
// WORKER SEARCH API
// ============================================================

/**
 * Search for workers with filters
 * @param {Object} filters - Search filters
 * @returns {Promise} Array of worker profiles
 */
export const searchWorkers = async (filters) => {
  try {
    const params = new URLSearchParams();
    if (filters.trade) params.append('trade', filters.trade);
    if (filters.min_experience) params.append('min_experience', filters.min_experience);
    if (filters.location) params.append('location', filters.location);
    if (filters.availability) params.append('availability', filters.availability);
    if (filters.own_tools !== undefined) params.append('own_tools', filters.own_tools);
    if (filters.own_vehicle !== undefined) params.append('own_vehicle', filters.own_vehicle);
    if (filters.min_rating) params.append('min_rating', filters.min_rating);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await api.get(`/workers/search?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error searching workers:', error);
    throw error;
  }
};

/**
 * Get worker profile by ID
 * @param {number} workerId - Worker ID
 * @returns {Promise} Worker profile
 */
export const getWorkerProfile = async (workerId) => {
  try {
    const response = await api.get(`/workers/${workerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching worker profile:', error);
    throw error;
  }
};

/**
 * Get list of available trades
 * @returns {Promise} Array of trade names
 */
export const getAvailableTrades = async () => {
  try {
    const response = await api.get('/workers/trades/list');
    return response.data;
  } catch (error) {
    console.error('Error fetching trades:', error);
    throw error;
  }
};


// ============================================================
// PROFILE PUBLISHING API
// ============================================================

/**
 * Publish worker profile to make it visible to companies
 * @param {number} resumeId - Resume ID
 * @returns {Promise} Publish status
 */
export const publishProfile = async (resumeId) => {
  try {
    const response = await api.patch(`/resumes/${resumeId}/publish`);
    return response.data;
  } catch (error) {
    console.error('Error publishing profile:', error);
    throw error;
  }
};

/**
 * Unpublish worker profile to hide it from companies
 * @param {number} resumeId - Resume ID
 * @returns {Promise} Publish status
 */
export const unpublishProfile = async (resumeId) => {
  try {
    const response = await api.patch(`/resumes/${resumeId}/unpublish`);
    return response.data;
  } catch (error) {
    console.error('Error unpublishing profile:', error);
    throw error;
  }
};

/**
 * Get publish status of a worker profile
 * @param {number} resumeId - Resume ID
 * @returns {Promise} Publish status
 */
export const getPublishStatus = async (resumeId) => {
  try {
    const response = await api.get(`/resumes/${resumeId}/publish-status`);
    return response.data;
  } catch (error) {
    console.error('Error getting publish status:', error);
    throw error;
  }
};
