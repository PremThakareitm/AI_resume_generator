import axios from "axios";

// Use environment variable for API URL with fallback to localhost for development
export const baseURLL = import.meta.env.VITE_API_URL || "http://localhost:8080";

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
