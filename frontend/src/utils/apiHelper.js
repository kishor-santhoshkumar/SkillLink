/**
 * API Helper Utility
 * Demonstrates how to use environment variables for API calls in React
 */

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Example: Fetch jobs using environment variable
 * Usage: const jobs = await fetchJobs();
 */
export const fetchJobs = async () => {
  try {
    const response = await fetch(`${API_URL}jobs`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Jobs fetched:', data);
    return data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

/**
 * Example: Fetch workers using environment variable
 * Usage: const workers = await fetchWorkers();
 */
export const fetchWorkers = async () => {
  try {
    const response = await fetch(`${API_URL}workers/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Workers fetched:', data);
    return data;
  } catch (error) {
    console.error('Error fetching workers:', error);
    throw error;
  }
};

/**
 * Example: Fetch with authentication token
 * Usage: const profile = await fetchWithAuth('resumes/68');
 */
export const fetchWithAuth = async (endpoint) => {
  try {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Data from ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Example: POST request with authentication
 * Usage: const result = await postWithAuth('jobs/', jobData);
 */
export const postWithAuth = async (endpoint, data) => {
  try {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log(`POST to ${endpoint} successful:`, result);
    return result;
  } catch (error) {
    console.error(`Error posting to ${endpoint}:`, error);
    throw error;
  }
};

export default {
  API_URL,
  fetchJobs,
  fetchWorkers,
  fetchWithAuth,
  postWithAuth,
};
