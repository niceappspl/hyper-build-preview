import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

// Get the API URL from environment variables or use default
const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3000/api';

// Maximum number of retries for failed requests
const MAX_RETRIES = 2;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 120 seconds timeout (2 minutes)
});

// Token validation function
const isTokenValid = (token: string): boolean => {
  if (!token) return false;
  
  try {
    // For JWT tokens, we can check basic structure
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Check if token is expired
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && payload.exp < Date.now() / 1000) return false;
    
    return true;
  } catch (e) {
    console.error('Error validating token:', e);
    return false;
  }
};

// Request interceptor for adding the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Check if token might be invalid before using it
      if (!isTokenValid(token)) {
        console.warn('Token appears to be invalid, clearing local storage');
        localStorage.removeItem('token');
        
        // If we're not already on the login page, redirect there
        if (!window.location.pathname.includes('/auth')) {
          window.location.href = '/auth';
          // Reject the request to prevent further errors
          return Promise.reject(new Error('Invalid authentication token'));
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Log outgoing requests in development
    if (import.meta.env.DEV) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`API Response (${response.status}):`, response.data);
    }
    
    // Validate that the response data has expected structure for common endpoints
    const url = response.config.url;
    if (url && url.includes('/projects') && response.status === 201) {
      if (!response.data || !response.data.id) {
        console.warn('Invalid project data structure in response:', response.data);
        console.warn('Response URL:', url);
        console.warn('Response status:', response.status);
        console.warn('Response headers:', response.headers);
      }
    }
    
    return response;
  },
  async (error) => {
    // Extract config, response for retry logic
    const { config, response } = error;
    
    // Get the retry count from config or initialize it
    const retryCount = config._retryCount || 0;
    
    // Only retry on network errors or 5xx server errors, and if we haven't exceeded MAX_RETRIES
    const shouldRetry = (
      (!response || (response.status >= 500 && response.status < 600)) && 
      retryCount < MAX_RETRIES
    );
    
    // Handle 401 Unauthorized errors - redirect to login
    if (response && response.status === 401) {
      console.warn('401 Unauthorized response, clearing auth token');
      localStorage.removeItem('token');
      
      // Only redirect if we're not already on the auth page
      if (!window.location.pathname.includes('/auth')) {
        window.location.href = '/auth';
      }
    } 
    
    // Log the error
    if (import.meta.env.DEV) {
      if (response) {
        console.error(`API Error (${response.status}):`, response.data);
      } else {
        console.error('API Network Error:', error.message);
      }
    }
    
    // Retry the request if it meets our criteria
    if (shouldRetry && config) {
      // Increase the retry count
      config._retryCount = retryCount + 1;
      
      // Add a small delay before retrying (exponential backoff)
      const delay = Math.pow(2, retryCount) * 1000;
      console.log(`Retrying request (${config._retryCount}/${MAX_RETRIES}) after ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Retry the request
      return api(config);
    }
    
    return Promise.reject(error);
  }
);

export default api; 