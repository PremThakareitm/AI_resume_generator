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
  try {
    const response = await axiosInstance.get("/api/v1/resume/health", {
      timeout: 5000 // 5 second timeout for health check
    });
    return { isHealthy: true, message: "Backend is running" };
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
      return { isHealthy: false, message: "Backend server is not running" };
    } else if (error.response?.status === 404) {
      return { isHealthy: true, message: "Backend is running (health endpoint not implemented)" };
    } else {
      return { isHealthy: false, message: "Backend health check failed" };
    }
  }
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
