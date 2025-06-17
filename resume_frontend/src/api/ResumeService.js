import axios from "axios";

// Use environment variable for API URL with fallback to relative path for production
const isProduction = import.meta.env.PROD;
export const baseURLL = import.meta.env.VITE_API_URL || 
                        (isProduction ? "/api" : "http://localhost:8080");

export const axiosInstance = axios.create({
  baseURL: baseURLL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false
});

export const generateResume = async (description) => {
  const response = await axiosInstance.post("/api/v1/resume/generate", {
    userDescription: description,
  });

  return response.data;
};

export const generateTailoredResume = async (userDescription, jobDescription) => {
  const response = await axiosInstance.post("/api/v1/resume/generate-tailored", {
    userDescription: userDescription,
    jobDescription: jobDescription,
  });

  return response.data;
};

export const checkBackendHealth = async () => {
  // Try multiple health endpoints in sequence
  const healthEndpoints = [
    "/api/v1/resume/health",
    "/health",
    "/"
  ];
  
  for (const endpoint of healthEndpoints) {
    try {
      console.log(`Checking backend health at: ${baseURLL}${endpoint}`);
      const response = await axiosInstance.get(endpoint, {
        timeout: 10000 // 10 second timeout for health check
      });
      console.log(`Health check response from ${endpoint}:`, response.data);
      return { 
        isHealthy: true, 
        message: "Backend is running", 
        endpoint: endpoint,
        data: response.data
      };
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
          message: `Backend server is not running at ${baseURLL}`,
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
    const endpoint = "/api/v1/resume/send-whatsapp";
    console.log("Sending WhatsApp request to:", `${baseURLL}${endpoint}`);
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
      const altEndpoint = "/api/v1/resume/sendWhatsApp";
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
