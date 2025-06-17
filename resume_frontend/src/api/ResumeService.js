import axios from "axios";

// Use environment variable for API URL with fallback to relative path for production
const isProduction = import.meta.env.PROD;
// Get base URL from env var or use default
const rawBaseURL = import.meta.env.VITE_API_URL || (isProduction ? "" : "http://localhost:8080");

// Debug all variables to help with debugging
console.log("Is Production:", isProduction);
console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

// Ensure baseURL doesn't end with /api to prevent double prefixes
export const baseURL = rawBaseURL === "/api" ? "" : rawBaseURL;
console.log("API base URL (final):", baseURL);

export const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false
});

// Helper function to handle API paths correctly
const getApiPath = (path) => {
  // Simplify the path handling logic
  // Always ensure paths have /api prefix in production
  // Remove /v1/ from the path if it exists, as it's handled by the backend
  if (import.meta.env.PROD) {
    // Remove any leading slashes
    const trimmedPath = path.replace(/^\/+/, '');
    
    // If path already starts with api/, use it
    if (trimmedPath.startsWith('api/')) {
      return '/' + trimmedPath;
    }
    
    // Otherwise add the /api prefix
    return `/api/${trimmedPath}`;
  }
  
  // For development, use path as is
  return path;
};

// Log test paths to debug
console.log("Test API path for /v1/resume/health:", getApiPath("/v1/resume/health"));
console.log("Test API path for /health:", getApiPath("/health"));

export const generateResume = async (description) => {
  // Use relative paths and let axiosInstance handle the baseURL
  const endpoint = getApiPath('/v1/resume/generate');
  console.log(`Calling generateResume at: ${baseURL}${endpoint}`);
  
  const response = await axiosInstance.post(endpoint, {
    userDescription: description,
  });

  return response.data;
};

export const generateTailoredResume = async (userDescription, jobDescription) => {
  const endpoint = getApiPath('/v1/resume/generate-tailored');
  console.log(`Calling generateTailoredResume at: ${baseURL}${endpoint}`);
  
  const response = await axiosInstance.post(endpoint, {
    userDescription: userDescription,
    jobDescription: jobDescription,
  });

  return response.data;
};

export const checkBackendHealth = async () => {
  // Try multiple health endpoints in sequence, using both direct and helper function paths
  const healthEndpoints = [
    "/api/health",  // Direct path without using getApiPath
    "/api/v1/resume/health", // Direct path without using getApiPath
    getApiPath("health"),
    getApiPath("v1/resume/health"),
  ];
  
  for (const endpoint of healthEndpoints) {
    try {
      console.log(`Checking backend health at: ${baseURL}${endpoint}`);
      const response = await axiosInstance.get(endpoint, {
        timeout: 10000, // 10 second timeout for health check
        validateStatus: status => status < 500 // Accept any non-server error status
      });
      
      // Check if response data is HTML (likely frontend, not backend)
      const responseData = response.data;
      const isHTML = typeof responseData === 'string' && 
                    (responseData.trim().startsWith('<!DOCTYPE') || 
                     responseData.trim().startsWith('<html'));
      
      if (isHTML) {
        console.log(`Endpoint ${endpoint} returned HTML, not a valid backend response`);
        continue;
      }
      
      // Check if we got a valid status and JSON response
      if (response.status === 200 && typeof responseData === 'object') {
        console.log(`Health check response from ${endpoint}:`, response.data);
        return { 
          isHealthy: true, 
          message: "Backend is running", 
          endpoint: endpoint,
          data: response.data
        };
      } else {
        console.log(`Endpoint ${endpoint} returned non-JSON or non-200 response:`, response.status);
        continue;
      }
      
    } catch (error) {
      console.error(`Health check error for ${endpoint}:`, error);
      
      // If we got a 404, try the next endpoint
      if (error.response?.status === 404) {
        console.log(`Endpoint ${endpoint} not found, trying next...`);
        continue;
      }
      
      // For connection or network errors, stop and report failure
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        return { 
          isHealthy: false, 
          message: `Backend server is not running`,
          error: error.toString()
        };
      }
    }
  }
  
  // If we got here, all endpoints were tried and failed
  return { 
    isHealthy: false, 
    message: `Backend health check failed: No working health endpoints found`,
    error: "All health endpoints returned errors"
  };
};

export const sendResumeToWhatsApp = async (phoneNumber, resumeData) => {
  try {
    // Try with lowercase 'whatsapp'
    const endpoint = getApiPath("/v1/resume/send-whatsapp");
    console.log("Sending WhatsApp request to:", `${baseURL}${endpoint}`);
    console.log("Phone number:", phoneNumber);
    console.log("Message length:", resumeData ? resumeData.length : 0);
    
    try {
      const response = await axiosInstance.post(endpoint, {
        phoneNumber: phoneNumber,
        resumeData: resumeData,
      });
      console.log("WhatsApp API response:", response.data);
      return response.data;
    } catch (firstError) {
      console.log("First endpoint attempt failed, trying alternative endpoint");
      // Try with camelCase 'WhatsApp' as fallback
      const altEndpoint = getApiPath("/v1/resume/sendWhatsApp");
      const response = await axiosInstance.post(altEndpoint, {
        phoneNumber: phoneNumber,
        resumeData: resumeData,
      });
      console.log("WhatsApp API response (alt endpoint):", response.data);
      return response.data;
    }
  } catch (error) {
    console.error("WhatsApp API error:", error);
    // If the server returns an error response, use it
    if (error.response && error.response.data) {
      return error.response.data;
    }
    // Otherwise return a generic error
    return {
      success: false,
      message: error.message || "Failed to connect to the server"
    };
  }
};
